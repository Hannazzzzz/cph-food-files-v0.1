import { describe, it, expect } from 'vitest';
import { filtersToSearchParams, searchParamsToFilters } from './urlFilters';

describe('urlFilters', () => {
  describe('filtersToSearchParams', () => {
    it('creates params for single food tag', () => {
      const params = filtersToSearchParams(['Cafe'], [], []);
      expect(params.toString()).toBe('food=Cafe');
    });

    it('creates params for single mood tag', () => {
      const params = filtersToSearchParams([], ['Cozy'], []);
      expect(params.toString()).toBe('mood=Cozy');
    });

    it('creates params for single hood tag', () => {
      const params = filtersToSearchParams([], [], ['Vesterbro']);
      expect(params.toString()).toBe('hood=Vesterbro');
    });

    it('creates params for multiple tags with comma separation', () => {
      const params = filtersToSearchParams(['Cafe', 'Bakery'], [], []);
      expect(params.get('food')).toBe('Cafe,Bakery');
    });

    it('creates params for all three filter categories', () => {
      const params = filtersToSearchParams(
        ['Cafe', 'Bakery'],
        ['Cozy'],
        ['Vesterbro', 'Nørrebro']
      );
      expect(params.get('food')).toBe('Cafe,Bakery');
      expect(params.get('mood')).toBe('Cozy');
      expect(params.get('hood')).toBe('Vesterbro,Nørrebro');
    });

    it('handles Danish characters (ø, æ, å)', () => {
      const params = filtersToSearchParams([], [], ['Nørrebro', 'Østerbro']);
      expect(params.get('hood')).toBe('Nørrebro,Østerbro');
      // Verify URL encoding works
      expect(params.toString()).toContain('hood=N');
    });

    it('omits empty food category', () => {
      const params = filtersToSearchParams([], ['Cozy'], ['Vesterbro']);
      expect(params.has('food')).toBe(false);
      expect(params.has('mood')).toBe(true);
      expect(params.has('hood')).toBe(true);
    });

    it('omits empty mood category', () => {
      const params = filtersToSearchParams(['Cafe'], [], ['Vesterbro']);
      expect(params.has('food')).toBe(true);
      expect(params.has('mood')).toBe(false);
      expect(params.has('hood')).toBe(true);
    });

    it('omits empty hood category', () => {
      const params = filtersToSearchParams(['Cafe'], ['Cozy'], []);
      expect(params.has('food')).toBe(true);
      expect(params.has('mood')).toBe(true);
      expect(params.has('hood')).toBe(false);
    });

    it('returns empty params when all filters empty', () => {
      const params = filtersToSearchParams([], [], []);
      expect(params.toString()).toBe('');
    });

    it('handles tags with spaces', () => {
      const params = filtersToSearchParams(['French Bakery'], [], []);
      expect(params.get('food')).toBe('French Bakery');
    });

    it('preserves tag casing', () => {
      const params = filtersToSearchParams(['CAFE', 'BaKeRy'], [], []);
      expect(params.get('food')).toBe('CAFE,BaKeRy');
    });
  });

  describe('searchParamsToFilters', () => {
    it('parses single food tag', () => {
      const params = new URLSearchParams('food=Cafe');
      const filters = searchParamsToFilters(params);
      expect(filters.food).toEqual(['Cafe']);
      expect(filters.mood).toEqual([]);
      expect(filters.hood).toEqual([]);
    });

    it('parses single mood tag', () => {
      const params = new URLSearchParams('mood=Cozy');
      const filters = searchParamsToFilters(params);
      expect(filters.food).toEqual([]);
      expect(filters.mood).toEqual(['Cozy']);
      expect(filters.hood).toEqual([]);
    });

    it('parses single hood tag', () => {
      const params = new URLSearchParams('hood=Vesterbro');
      const filters = searchParamsToFilters(params);
      expect(filters.food).toEqual([]);
      expect(filters.mood).toEqual([]);
      expect(filters.hood).toEqual(['Vesterbro']);
    });

    it('parses comma-separated tags', () => {
      const params = new URLSearchParams('food=Cafe,Bakery');
      const filters = searchParamsToFilters(params);
      expect(filters.food).toEqual(['Cafe', 'Bakery']);
    });

    it('parses multiple filter categories', () => {
      const params = new URLSearchParams('food=Cafe,Bakery&mood=Cozy&hood=Vesterbro,Nørrebro');
      const filters = searchParamsToFilters(params);
      expect(filters.food).toEqual(['Cafe', 'Bakery']);
      expect(filters.mood).toEqual(['Cozy']);
      expect(filters.hood).toEqual(['Vesterbro', 'Nørrebro']);
    });

    it('handles Danish characters (ø, æ, å)', () => {
      const params = new URLSearchParams('hood=Nørrebro,Østerbro');
      const filters = searchParamsToFilters(params);
      expect(filters.hood).toEqual(['Nørrebro', 'Østerbro']);
    });

    it('trims whitespace from tags', () => {
      const params = new URLSearchParams('food=Cafe , Bakery ');
      const filters = searchParamsToFilters(params);
      expect(filters.food).toEqual(['Cafe', 'Bakery']);
    });

    it('filters out empty values after split', () => {
      const params = new URLSearchParams('food=Cafe,,Bakery');
      const filters = searchParamsToFilters(params);
      expect(filters.food).toEqual(['Cafe', 'Bakery']);
    });

    it('handles empty comma-separated values', () => {
      const params = new URLSearchParams('food=,,,');
      const filters = searchParamsToFilters(params);
      expect(filters.food).toEqual([]);
    });

    it('returns empty arrays for missing params', () => {
      const params = new URLSearchParams('');
      const filters = searchParamsToFilters(params);
      expect(filters).toEqual({ food: [], mood: [], hood: [] });
    });

    it('returns empty array when param exists but is empty', () => {
      const params = new URLSearchParams('food=');
      const filters = searchParamsToFilters(params);
      expect(filters.food).toEqual([]);
    });

    it('handles tags with spaces', () => {
      const params = new URLSearchParams('food=French%20Bakery');
      const filters = searchParamsToFilters(params);
      expect(filters.food).toEqual(['French Bakery']);
    });

    it('preserves tag casing', () => {
      const params = new URLSearchParams('food=CAFE,BaKeRy');
      const filters = searchParamsToFilters(params);
      expect(filters.food).toEqual(['CAFE', 'BaKeRy']);
    });

    it('handles only some categories present', () => {
      const params = new URLSearchParams('food=Cafe&hood=Vesterbro');
      const filters = searchParamsToFilters(params);
      expect(filters.food).toEqual(['Cafe']);
      expect(filters.mood).toEqual([]);
      expect(filters.hood).toEqual(['Vesterbro']);
    });
  });

  describe('round-trip encoding', () => {
    it('preserves filters through serialization cycle with all categories', () => {
      const original = {
        food: ['Fastelavnsbolle', 'Croissant'],
        mood: ['Cafe'],
        hood: ['Nørrebro', 'Østerbro'],
      };

      const params = filtersToSearchParams(
        original.food,
        original.mood,
        original.hood
      );
      const restored = searchParamsToFilters(params);

      expect(restored).toEqual(original);
    });

    it('preserves filters with Danish characters', () => {
      const original = {
        food: ['Æbleskiver'],
        mood: [],
        hood: ['Nørrebro', 'Vesterbro', 'Østerbro'],
      };

      const params = filtersToSearchParams(
        original.food,
        original.mood,
        original.hood
      );
      const restored = searchParamsToFilters(params);

      expect(restored).toEqual(original);
    });

    it('preserves empty filters', () => {
      const original = {
        food: [],
        mood: [],
        hood: [],
      };

      const params = filtersToSearchParams(
        original.food,
        original.mood,
        original.hood
      );
      const restored = searchParamsToFilters(params);

      expect(restored).toEqual(original);
    });

    it('preserves single category filter', () => {
      const original = {
        food: ['Bakery'],
        mood: [],
        hood: [],
      };

      const params = filtersToSearchParams(
        original.food,
        original.mood,
        original.hood
      );
      const restored = searchParamsToFilters(params);

      expect(restored).toEqual(original);
    });

    it('preserves tags with special characters', () => {
      const original = {
        food: ['Café', 'Bakery & Pastry'],
        mood: [],
        hood: [],
      };

      const params = filtersToSearchParams(
        original.food,
        original.mood,
        original.hood
      );
      const restored = searchParamsToFilters(params);

      expect(restored).toEqual(original);
    });
  });
});
