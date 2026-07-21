#!/usr/bin/env python3
"""Offline unit tests for harvest_restaurants.py - no browser or network needed.

Run: python3 tests_offline.py
"""
import csv
import os
import tempfile
import unittest

from harvest_restaurants import (
    sniff_delimiter, read_places_csv, get_name_and_url, extract_place_id,
    force_english, extract_postal_code, get_neighborhood, detect_closure,
    load_existing_tags, lookup_tags, dedupe_rows, save_results, OUTPUT_FIELDS,
)

URL_A = "https://www.google.com/maps/place/Hart/data=!4m2!3m1!1s0x4652531111111111:0xaaaaaaaaaaaaaaaa"
URL_B = "https://www.google.com/maps/place/Hart/data=!4m2!3m1!1s0x4652532222222222:0xbbbbbbbbbbbbbbbb"


def write_tmp(content, suffix='.csv', encoding='utf-8'):
    fd, path = tempfile.mkstemp(suffix=suffix)
    with os.fdopen(fd, 'w', encoding=encoding, newline='') as f:
        f.write(content)
    return path


class TestCsvReading(unittest.TestCase):
    def test_delimiter_sniffing(self):
        self.assertEqual(sniff_delimiter("a;b;c"), ';')
        self.assertEqual(sniff_delimiter("a,b,c"), ',')
        self.assertEqual(sniff_delimiter("name;food_tags;maps url"), ';')

    def test_bom_is_stripped(self):
        """Takeout CSVs start with a BOM which used to break the Title column."""
        path = write_tmp('﻿Title,Note,URL,Comment\nHart,,%s,\n' % URL_A)
        rows = read_places_csv(path)
        name, url = get_name_and_url(rows[0])
        self.assertEqual(name, 'Hart')
        self.assertEqual(url, URL_A)
        os.remove(path)

    def test_semicolon_enriched_csv(self):
        path = write_tmp('name;food_tags;mood_tags;maps url;status\nHart;Bakery;Cozy;%s;success\n' % URL_A)
        rows = read_places_csv(path)
        self.assertEqual(rows[0]['food_tags'], 'Bakery')
        name, url = get_name_and_url(rows[0])
        self.assertEqual((name, url), ('Hart', URL_A))
        os.remove(path)

    def test_case_insensitive_headers(self):
        path = write_tmp('NAME,MAPS URL\nHart,%s\n' % URL_A)
        rows = read_places_csv(path)
        self.assertEqual(get_name_and_url(rows[0]), ('Hart', URL_A))
        os.remove(path)


class TestUrlHelpers(unittest.TestCase):
    def test_place_id(self):
        self.assertEqual(extract_place_id(URL_A), '0x4652531111111111:0xaaaaaaaaaaaaaaaa')
        self.assertIsNone(extract_place_id('https://maps.app.goo.gl/abc123'))
        self.assertIsNone(extract_place_id(''))

    def test_force_english(self):
        out = force_english(URL_A)
        self.assertIn('hl=en', out)
        self.assertIn('gl=DK', out)
        # idempotent-ish: applying twice doesn't duplicate params
        out2 = force_english(out)
        self.assertEqual(out2.count('hl=en'), 1)

    def test_force_english_preserves_existing_query(self):
        out = force_english('https://www.google.com/maps/place/X?foo=bar')
        self.assertIn('foo=bar', out)
        self.assertIn('hl=en', out)


class TestNeighbourhoods(unittest.TestCase):
    def test_postal_extraction(self):
        self.assertEqual(extract_postal_code('Ryesgade 118, 2100 København Ø'), 2100)
        self.assertIsNone(extract_postal_code(''))
        self.assertIsNone(extract_postal_code(None))

    def test_mapping(self):
        self.assertEqual(get_neighborhood(2100), 'Østerbro')
        self.assertEqual(get_neighborhood(1433), 'Refshaleøen')  # specific beats Indre By
        self.assertEqual(get_neighborhood(1436), 'Holmen')
        self.assertEqual(get_neighborhood(1100), 'Indre By')
        self.assertEqual(get_neighborhood(2150), 'Nordhavn')
        self.assertEqual(get_neighborhood(9999), '')
        self.assertEqual(get_neighborhood(None), '')


class TestClosureDetection(unittest.TestCase):
    def test_english(self):
        self.assertEqual(detect_closure(['Hart Bageri', 'Permanently closed']), ('Yes', 'No'))
        self.assertEqual(detect_closure(['Temporarily closed']), ('No', 'Yes'))

    def test_danish(self):
        self.assertEqual(detect_closure(['Permanent lukket']), ('Yes', 'No'))
        self.assertEqual(detect_closure(['Midlertidigt lukket']), ('No', 'Yes'))

    def test_open_place(self):
        self.assertEqual(detect_closure(['Hart Bageri', '4.6 stars', 'Open · Closes 18:00']), ('No', 'No'))

    def test_no_false_positive_from_full_page_dump(self):
        """A review MENTIONING closure must not flag the place - detection is
        scoped to header texts, so this test documents the contract: callers
        must only pass header-region texts."""
        header_only = ['Hart Bageri', 'Open · Closes 18:00']
        self.assertEqual(detect_closure(header_only), ('No', 'No'))


class TestTagPreservation(unittest.TestCase):
    def _enriched(self):
        return write_tmp(
            'name,food_tags,mood_tags,maps url,status\n'
            'Hart,Bakery,Cozy,%s,success\n'
            'Hart,Pastries,Fancy,%s,success\n'
            'Untagged,,,https://www.google.com/maps/place/U/data=!4m2!3m1!1s0x1:0x2,success\n' % (URL_A, URL_B))

    def test_duplicate_names_keep_distinct_tags(self):
        path = self._enriched()
        tags = load_existing_tags(path)
        self.assertEqual(lookup_tags(tags, 'Hart', URL_A)['food_tags'], 'Bakery')
        self.assertEqual(lookup_tags(tags, 'Hart', URL_B)['food_tags'], 'Pastries')
        os.remove(path)

    def test_rename_keeps_tags_via_place_id(self):
        path = self._enriched()
        tags = load_existing_tags(path)
        self.assertEqual(lookup_tags(tags, 'Hart Bageri (renamed)', URL_A)['mood_tags'], 'Cozy')
        os.remove(path)

    def test_untagged_gets_nothing(self):
        path = self._enriched()
        tags = load_existing_tags(path)
        self.assertEqual(lookup_tags(tags, 'Untagged', 'https://www.google.com/maps/place/U/data=!4m2!3m1!1s0x1:0x2'), {})
        os.remove(path)

    def test_missing_file(self):
        self.assertEqual(load_existing_tags('/nonexistent/file.csv'), {})


class TestDedupe(unittest.TestCase):
    def test_dedupe_by_place_id(self):
        rows = [
            {'Title': 'Hart', 'URL': URL_A},
            {'Title': 'Hart duplicate', 'URL': URL_A},
            {'Title': 'Hart 2', 'URL': URL_B},
        ]
        result = dedupe_rows(rows)
        self.assertEqual(len(result), 2)

    def test_rows_without_url_kept_by_name(self):
        rows = [{'Title': 'A', 'URL': ''}, {'Title': 'A', 'URL': ''}, {'Title': 'B', 'URL': ''}]
        # rows without URL are dropped by name-dedupe but kept once
        result = dedupe_rows(rows)
        self.assertEqual([r['Title'] for r in result], ['A', 'B'])


class TestSaveResults(unittest.TestCase):
    def test_extra_fields_ignored(self):
        """This exact bug killed runs in January ('dict contains fields not in fieldnames')."""
        fd, path = tempfile.mkstemp(suffix='.csv'); os.close(fd)
        row = {f: '' for f in OUTPUT_FIELDS}
        row.update({'name': 'X', 'original_comment': 'boom', 'description': 'boom', 'original_tags': 'boom'})
        save_results([row], path)  # must not raise
        with open(path, encoding='utf-8') as f:
            header = f.readline().strip().split(',')
        self.assertNotIn('original_comment', header)
        os.remove(path)

    def test_roundtrip_readable_by_reader(self):
        fd, path = tempfile.mkstemp(suffix='.csv'); os.close(fd)
        row = {f: '' for f in OUTPUT_FIELDS}
        row.update({'name': 'Café, with comma', 'maps url': URL_A, 'food_tags': 'Bakery, Coffee'})
        save_results([row], path)
        rows = read_places_csv(path)
        self.assertEqual(rows[0]['name'], 'Café, with comma')
        self.assertEqual(rows[0]['food_tags'], 'Bakery, Coffee')
        os.remove(path)


if __name__ == '__main__':
    unittest.main(verbosity=2)
