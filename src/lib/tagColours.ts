// One colour per tag, grouped by filter category.
// FOOD runs violet to pink, MOOD runs cyan to blue to indigo, HOOD runs orange to yellow.
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
  'restaurant': '#00C7C7',
  'cafe': '#0078B8',
  'bar': '#5B67C2',
  'bakery': '#3CBBF9',
  'al fresco': '#458CFB',
  'take away': '#25E8F6',
  'museum': '#00569A',
  'hotel': '#96A7FF',
  'cinema': '#1A99DA',
  'shop': '#3C35CB',
  'rooftop': '#00C2E2',
  'music': '#73B1FF'
};

const HOOD: Record<string, string> = {
  'albertslund': '#E76346',
  'amager': '#FE9E0E',
  'frederiksberg': '#FFF8B6',
  'gentofte': '#FDD5B8',
  'holmen': '#FFEF62',
  'indre by': '#F1840B',
  'ishøj': '#DFCE22',
  'nordhavn': '#E06D00',
  'nordvest': '#DDB200',
  'nørrebro': '#F97B43',
  'refshaleøen': '#FFDA7D',
  'sydhavn': '#F55600',
  'vanløse': '#F2DBB1',
  'vesterbro': '#FFD2C7',
  'østerbro': '#FFBE2B'
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
