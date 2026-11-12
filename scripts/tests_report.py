#!/usr/bin/env python3
"""Tests for report_changes.py."""
import unittest
from report_changes import compare, render

def U(pid):
    return f"https://www.google.com/maps/place/X/data=!4m2!3m1!1s0x{pid}:0x{pid}"

def row(name, pid, perm='No', temp='No', rating='4.5', reviews='100', hours='Open', lat='55.68', lon='12.57'):
    return {'name': name, 'maps url': U(pid), 'latitude': lat, 'longitude': lon, 'permanently_closed': perm,
            'temporarily_closed': temp, 'rating': rating,
            'reviews_count': reviews, 'hours': hours, 'status': 'success'}


class TestCompare(unittest.TestCase):
    def test_no_meaningful_changes_despite_rating_noise(self):
        old = [row('A', 'aaa1', rating='4.5', reviews='100', hours='Open')]
        new = [row('A', 'aaa1', rating='4.6', reviews='150', hours='Closed')]
        self.assertEqual(render(compare(old, new)), '')

    def test_added_and_removed_silent_by_default(self):
        old = [row('A', 'aaa1'), row('B', 'bbb2')]
        new = [row('A', 'aaa1'), row('C', 'ccc3')]
        self.assertEqual(render(compare(old, new)), '')
        out = render(compare(old, new), include_membership=True)
        self.assertIn('Added (1):** C', out)
        self.assertIn('Removed (1):** B', out)

    def test_closure_transitions(self):
        old = [row('A', 'aaa1'), row('B', 'bbb2'), row('C', 'ccc3', temp='Yes')]
        new = [row('A', 'aaa1', perm='Yes'), row('B', 'bbb2', temp='Yes'), row('C', 'ccc3')]
        out = render(compare(old, new))
        self.assertIn('permanently closed, now hidden (1):** A', out)
        self.assertIn('temporarily closed (1):** B', out)
        self.assertIn('Reopened (1):** C', out)

    def test_places_without_coordinates_are_reported(self):
        old = [row('A', 'aaa1'), row('B', 'bbb2')]
        new = [row('A', 'aaa1', lat='', lon=''), row('B', 'bbb2'),
               row('Gone', 'ccc3', perm='Yes', lat='', lon='')]  # hidden anyway: not reported
        out = render(compare(old, new))
        self.assertIn('No map pin, coordinates not found (1):** A.', out)
        self.assertNotIn('Gone', out)

    def test_already_closed_stays_closed_not_reported(self):
        old = [row('A', 'aaa1', temp='Yes')]
        new = [row('A', 'aaa1', temp='Yes')]
        self.assertEqual(render(compare(old, new)), '')

    def test_rename_same_place_not_add_remove(self):
        old = [row('Old Name', 'aaa1')]
        new = [row('New Name', 'aaa1')]
        self.assertEqual(render(compare(old, new)), '')


if __name__ == '__main__':
    unittest.main(verbosity=1)
