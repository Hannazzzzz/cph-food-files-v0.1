// One colour per tag, grouped by filter category.
// FOOD runs violet to pink, MOOD runs orange to yellow, HOOD runs green to azure.
// Built in OKLCH (FOOD) with a minimum pairwise CIEDE2000 distance of about 9.

const FOOD: Record<string, string> = {
  'coffee': '#8047DD',
  'tea': '#BEB0DD',
  'afternoon tea': '#ECCFFF',
  'beer': '#755B80',
  'wine': '#DC5BFF',
  'cocktails': '#E7A1FF',
  'fastelavnsbolle': '#5D2571',
  'pastry': '#AF2CAC',
  'ice cream': '#D723D7',
  'brunch': '#C39CBF',
  'buffet': '#FFE1F4',
  'asian': '#833574',
  'burgers': '#946B86',
  'steak': '#FF3FCB',
  'pizza': '#FF7EC2',
  'italian': '#72184B',
  'french': '#C92084',
  'mediterranean': '#DAA5B1',
  'portuguese': '#FFC1DC',
  'mexican': '#862540',
  'fish': '#885863',
  'new nordic': '#FF1493',
  'danish': '#FF366B',
  'smørrebrød': '#FF909D',
  'street food': '#FFC5C3',
  'vegetarian': '#A685FF',
  'for thought': '#B0B0B0',
  'smørrebrod': '#FF909D'
};

const MOOD: Record<string, string> = {
  'restaurant': '#FF4400',
  'cafe': '#FF925C',
  'bar': '#FF7D29',
  'bakery': '#FFC28F',
  'al fresco': '#FF8500',
  'take away': '#FFBB5C',
  'museum': '#FFB429',
  'hotel': '#FFDF8F',
  'cinema': '#FFC600',
  'shop': '#FFE55C',
  'rooftop': '#FFEA29',
  'music': '#FFFB8F'
};

const HOOD: Record<string, string> = {
  'albertslund': '#00C261',
  'amager': '#7AFFC6',
  'frederiksberg': '#06EF99',
  'gentofte': '#AFFDE6',
  'holmen': '#00C295',
  'indre by': '#7AFFE9',
  'ishøj': '#06EFD7',
  'nordvest': '#AFFDFA',
  'nørrebro': '#00BBC2',
  'refshaleøen': '#7AF2FF',
  'sydhavn': '#06C8EF',
  'vanløse': '#AFEBFD',
  'vesterbro': '#0088C2',
  'østerbro': '#7ACEFF',
  'nordhavn': '#519160'
};

export type TagCategory = 'food' | 'mood' | 'hood';

const BY_CATEGORY: Record<TagCategory, Record<string, string>> = { food: FOOD, mood: MOOD, hood: HOOD };

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Black or white text, whichever has the higher contrast on the given background.
function readableText(hex: string): string {
  const l = luminance(hex);
  const white = 1.05 / (l + 0.05);
  const black = (l + 0.05) / 0.05;
  return white >= black ? '#FFFFFF' : '#000000';
}

/**
 * Inline style for a tag chip. Tags without an assigned colour (for example a brand new
 * neighbourhood) fall back to the category colour, so they never render blank.
 */
export function tagChipStyle(category: TagCategory, tag: string): { backgroundColor: string; color: string } {
  const hex = BY_CATEGORY[category][tag.trim().toLowerCase()];
  if (!hex) {
    return { backgroundColor: `hsl(var(--${category}))`, color: `hsl(var(--${category}-foreground))` };
  }
  return { backgroundColor: hex, color: readableText(hex) };
}
