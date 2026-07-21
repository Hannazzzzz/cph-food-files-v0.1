#!/usr/bin/env python3
"""Offline tests for update_from_takeout.py - diff logic and Takeout zip reading."""
import csv
import os
import tempfile
import unittest
import zipfile

from update_from_takeout import read_takeout, diff_places, key_of
from harvest_restaurants import get_name_and_url

def U(pid):
    return f"https://www.google.com/maps/place/X/data=!4m2!3m1!1s0x{pid}:0x{pid}"

def takeout_row(name, pid):
    return {'Title': name, 'Note': '', 'URL': U(pid), 'Tags': '', 'Comment': ''}

def enriched_row(name, pid, food=''):
    return {'name': name, 'food_tags': food, 'mood_tags': '', 'maps url': U(pid), 'status': 'success'}


class TestDiff(unittest.TestCase):
    def test_add_remove_keep(self):
        takeout = [takeout_row('Kept', 'aaa1'), takeout_row('New Place', 'bbb2')]
        enriched = [enriched_row('Kept', 'aaa1', 'Coffee'), enriched_row('Gone', 'ccc3')]
        new, removed, kept = diff_places(takeout, enriched)
        self.assertEqual([get_name_and_url(r)[0] for r in new], ['New Place'])
        self.assertEqual([get_name_and_url(r)[0] for r in removed], ['Gone'])
        self.assertEqual([get_name_and_url(r)[0] for r in kept], ['Kept'])

    def test_rename_in_google_is_not_add_remove(self):
        """Same place ID, different name -> kept, not add+remove."""
        takeout = [takeout_row('New Fancy Name', 'aaa1')]
        enriched = [enriched_row('Old Name', 'aaa1', 'Bakery')]
        new, removed, kept = diff_places(takeout, enriched)
        self.assertEqual(len(new), 0)
        self.assertEqual(len(removed), 0)
        self.assertEqual(len(kept), 1)
        self.assertEqual(kept[0]['food_tags'], 'Bakery')

    def test_duplicate_takeout_rows_deduped(self):
        takeout = [takeout_row('Dup', 'aaa1'), takeout_row('Dup', 'aaa1')]
        new, removed, kept = diff_places(takeout, [])
        self.assertEqual(len(new), 1)

    def test_blank_takeout_rows_ignored(self):
        takeout = [{'Title': '', 'URL': ''}, takeout_row('Real', 'aaa1')]
        new, removed, kept = diff_places(takeout, [])
        self.assertEqual(len(new), 1)

    def test_empty_enriched_all_new(self):
        takeout = [takeout_row('A', 'aaa1'), takeout_row('B', 'bbb2')]
        new, removed, kept = diff_places(takeout, [])
        self.assertEqual(len(new), 2)
        self.assertEqual(removed, [])


class TestTakeoutZip(unittest.TestCase):
    def _make_zip(self, list_name='Favorite places'):
        fd, path = tempfile.mkstemp(suffix='.zip'); os.close(fd)
        csv_content = '﻿Title,Note,URL,Tags,Comment\n,,,,\nHart,,%s,,\n' % U('abc9')
        with zipfile.ZipFile(path, 'w') as z:
            z.writestr(f'Takeout/Saved/{list_name}.csv', csv_content.encode('utf-8'))
            z.writestr('Takeout/Saved/Other list.csv', 'Title,Note,URL\n')
        return path

    def test_reads_correct_list_from_zip(self):
        path = self._make_zip()
        rows = read_takeout(path, 'Favorite places')
        usable = [r for r in rows if all(get_name_and_url(r))]
        self.assertEqual(len(usable), 1)
        self.assertEqual(get_name_and_url(usable[0])[0], 'Hart')
        os.remove(path)

    def test_missing_list_lists_available(self):
        path = self._make_zip()
        with self.assertRaises(SystemExit) as ctx:
            read_takeout(path, 'Nonexistent list')
        self.assertIn('Other list', str(ctx.exception))
        os.remove(path)

    def test_plain_csv_passthrough(self):
        fd, path = tempfile.mkstemp(suffix='.csv')
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            f.write('Title,URL\nHart,%s\n' % U('abc9'))
        rows = read_takeout(path)
        self.assertEqual(get_name_and_url(rows[0])[0], 'Hart')
        os.remove(path)


if __name__ == '__main__':
    unittest.main(verbosity=1)
