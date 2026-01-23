/**
 * URL Filter Utilities
 *
 * Handles serialization and deserialization of filter state to/from URL search parameters.
 * Supports sharing filtered views via URL.
 */

/**
 * Serializes filter arrays into URL search parameters
 *
 * @param food - Array of selected food tags
 * @param mood - Array of selected mood tags
 * @param hood - Array of selected hood/neighborhood tags
 * @returns URLSearchParams object with encoded filter values
 *
 * @example
 * filtersToSearchParams(['Bakery', 'Cafe'], [], ['Nørrebro'])
 * // Returns URLSearchParams: "food=Bakery,Cafe&hood=Nørrebro"
 */
export function filtersToSearchParams(
  food: string[],
  mood: string[],
  hood: string[]
): URLSearchParams {
  const params = new URLSearchParams();

  if (food.length > 0) {
    params.set('food', food.join(','));
  }

  if (mood.length > 0) {
    params.set('mood', mood.join(','));
  }

  if (hood.length > 0) {
    params.set('hood', hood.join(','));
  }

  return params;
}

/**
 * Deserializes URL search parameters into filter arrays
 *
 * @param searchParams - URLSearchParams object to parse
 * @returns Object with food, mood, and hood filter arrays
 *
 * @example
 * const params = new URLSearchParams('food=Bakery,Cafe&hood=Nørrebro');
 * searchParamsToFilters(params)
 * // Returns: { food: ['Bakery', 'Cafe'], mood: [], hood: ['Nørrebro'] }
 */
export function searchParamsToFilters(searchParams: URLSearchParams): {
  food: string[];
  mood: string[];
  hood: string[];
} {
  const parseParam = (param: string | null): string[] => {
    if (!param) return [];

    return param
      .split(',')
      .map(s => s.trim())
      .filter(Boolean); // Remove empty strings
  };

  return {
    food: parseParam(searchParams.get('food')),
    mood: parseParam(searchParams.get('mood')),
    hood: parseParam(searchParams.get('hood')),
  };
}
