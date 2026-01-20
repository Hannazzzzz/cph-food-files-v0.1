export interface Bakery {
  name: string;
  address: string;
  neighbourhood: string;
  rating: number | null;
  reviewsCount: number | null;
  url: string;
  website: string | null;
  phone: string | null;
}

// Map postal codes to neighbourhood names
const postalCodeToNeighbourhood: Record<string, string> = {
  '1000': 'Indre By',
  '1050': 'Indre By',
  '1100': 'Indre By',
  '1150': 'Indre By',
  '1200': 'Indre By',
  '1250': 'Indre By',
  '1260': 'Indre By',
  '1300': 'Indre By',
  '1350': 'Indre By',
  '1366': 'Indre By',
  '1400': 'Indre By',
  '1432': 'Refshaleøen',
  '1450': 'Indre By',
  '1500': 'Indre By',
  '1550': 'Indre By',
  '1600': 'Vesterbro',
  '1620': 'Vesterbro',
  '1650': 'Vesterbro',
  '1700': 'Vesterbro',
  '1704': 'Vesterbro',
  '1750': 'Vesterbro',
  '1799': 'Islands Brygge',
  '1800': 'Frederiksberg',
  '1850': 'Frederiksberg',
  '1879': 'Frederiksberg',
  '1900': 'Frederiksberg',
  '2000': 'Frederiksberg',
  '2100': 'Østerbro',
  '2150': 'Nordhavn',
  '2200': 'Nørrebro',
  '2300': 'Amager',
  '2400': 'Nordvest',
  '2450': 'Sydhavn',
  '2500': 'Valby',
};

function extractNeighbourhood(address: string): string {
  // Extract postal code from address (Danish format: "Street, XXXX City")
  const match = address.match(/(\d{4})\s+/);
  if (match) {
    const postalCode = match[1];
    return postalCodeToNeighbourhood[postalCode] || 'København';
  }
  return 'København';
}

function parseReviewsCount(reviews: string): number | null {
  if (!reviews) return null;
  // Handle comma-formatted numbers like "1,003"
  const cleaned = reviews.replace(/,/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

function parseRating(rating: string): number | null {
  if (!rating) return null;
  const num = parseFloat(rating);
  return isNaN(num) ? null : num;
}

// Hardcoded bakery data parsed from the enriched CSV
// (CSV has multiline issues with keywords field, so we parse manually)
export const bakeries: Bakery[] = [
  { name: "Leckerbaer", address: "Ryesgade 118, 2100 København Ø", neighbourhood: "Østerbro", rating: 4.6, reviewsCount: 241, url: "https://www.google.com/maps/place/Leckerbaer/data=!4m2!3m1!1s0x465252fc9a472a3b:0x1c69782f50b04f89", website: "http://leckerbaer.dk/", phone: "28 40 48 64" },
  { name: "Andersen & Maillard (Nordhavn)", address: "Antwerpengade 10, 2150 København", neighbourhood: "Nordhavn", rating: 4.4, reviewsCount: 561, url: "https://www.google.com/maps/place/Andersen+%26+Maillard/data=!4m2!3m1!1s0x46525340d60ad511:0xb0f67808cae024e9", website: "https://www.andersenmaillard.dk/", phone: "33 32 23 22" },
  { name: "Collective Bakery", address: "Nørrebrogade 176, 2200 København", neighbourhood: "Nørrebro", rating: 4.3, reviewsCount: 141, url: "https://www.google.com/maps/place/Collective+Bakery/data=!4m2!3m1!1s0x4652537daeda7453:0x4b4a8ef15339e121", website: "https://www.collectivebakery.dk/", phone: "31 36 75 33" },
  { name: "Bageriet Benji", address: "Mjølnerparken 52, 2200 København N", neighbourhood: "Nørrebro", rating: 4.5, reviewsCount: 190, url: "https://www.google.com/maps/place/Bageriet+Benji/data=!4m2!3m1!1s0x465253a73dacd217:0x8f04631805fab283", website: "https://www.earnest-eats.dk/projects-1/benji", phone: null },
  { name: "Sinne gas bageri", address: "Ryesgade 63, 2100 København", neighbourhood: "Østerbro", rating: 4.9, reviewsCount: 284, url: "https://www.google.com/maps/place/Sinne+gas+bageri/data=!4m2!3m1!1s0x465253e902130051:0x3f6f375e56801295", website: "https://sinnegasbageri.dk/", phone: null },
  { name: "La Cabra", address: "Århusgade 118X, 2150 København", neighbourhood: "Nordhavn", rating: 4.5, reviewsCount: 43, url: "https://www.google.com/maps/place/La+Cabra/data=!4m2!3m1!1s0x46525314a7b7ede7:0x3a4a1e0f4b65854f", website: "https://lacabra.com/pages/nordhavn", phone: null },
  { name: "Skipper Bageri", address: "Østerbrogade 103, 2100 København", neighbourhood: "Østerbro", rating: 4.6, reviewsCount: 253, url: "https://www.google.com/maps/place/Skipper+Bageri/data=!4m2!3m1!1s0x465253da34838ac5:0xab3822dff8c8f5fa", website: "https://www.facebook.com/Skipper-bageri-107406865450827/", phone: "24 24 53 61" },
  { name: "DILLON", address: "Tåsingegade 51, 2100 København", neighbourhood: "Østerbro", rating: 4.7, reviewsCount: 73, url: "https://www.google.com/maps/place/DILLON/data=!4m2!3m1!1s0x46525306067ca7f5:0x47aaf7dcb857086f", website: "https://www.instagram.com/dillon.cph/", phone: "71 55 43 28" },
  { name: "Rug Bakery", address: "Tietgensgade 39, 1704 København", neighbourhood: "Vesterbro", rating: 4.5, reviewsCount: 1003, url: "https://www.google.com/maps/place/Rug+Bakery/data=!4m2!3m1!1s0x46525359463436c3:0x9c0a400a20eca83e", website: "https://rugbakery.com/", phone: "78 73 00 58" },
  { name: "Perron", address: "Otto Busses Vej 45, 2450 København", neighbourhood: "Sydhavn", rating: 4.0, reviewsCount: 126, url: "https://www.google.com/maps/place/Perron/data=!4m2!3m1!1s0x46525374332fc119:0xb6a2e77f1147712e", website: "https://www.perroncph.dk/", phone: null },
  { name: "Cakenhagen Vesterbrogade", address: "Vesterbrogade 1, 1620 København", neighbourhood: "Vesterbro", rating: 4.5, reviewsCount: 93, url: "https://www.google.com/maps/place/Cakenhagen+Vesterbrogade/data=!4m2!3m1!1s0x4652536a1363f95b:0x6e5ec14d6e846534", website: "https://www.nimb.dk/restaurant-bar/cakenhagen", phone: "88 70 00 00" },
  { name: "Det Franske Konditori", address: "H. C. Ørsteds Vej 44, 1879 Frederiksberg C", neighbourhood: "Frederiksberg", rating: 4.5, reviewsCount: 92, url: "https://www.google.com/maps/place/Det+Franske+Konditori/data=!4m2!3m1!1s0x465253a6f108ad7d:0xa951017679515b2f", website: "http://detfranskeconditori.dk/", phone: "35 35 15 46" },
  { name: "Hart (Nørrebro)", address: "Julius Bloms Gade 32, 2200 København", neighbourhood: "Nørrebro", rating: 4.2, reviewsCount: 85, url: "https://www.google.com/maps/place/Hart/data=!4m2!3m1!1s0x4652530030fd8f4f:0x990da25bc38605ec", website: "https://hartbageri.com/", phone: null },
  { name: "Andersen Bakery (Amager)", address: "Thorshavnsgade 26, 2300 Amager Vest", neighbourhood: "Amager", rating: 4.6, reviewsCount: 2627, url: "https://www.google.com/maps/place/Andersen+Bakery/data=!4m2!3m1!1s0x4652530d731eb667:0x421b0fb5b128311", website: "https://andersen-bakery-eu.dk/", phone: "33 75 07 35" },
  { name: "Riviera", address: "Nansensgade 64, 1366 København K", neighbourhood: "Indre By", rating: 4.3, reviewsCount: 176, url: "https://www.google.com/maps/place/Riviera/data=!4m2!3m1!1s0x4652536bbaa4ac13:0x34e841e7c3cc40fb", website: null, phone: null },
  { name: "Maison d'Angleterre", address: "Østergade 2, 1100 København K", neighbourhood: "Indre By", rating: 4.3, reviewsCount: 82, url: "https://www.google.com/maps/place/Maison+d'Angleterre/data=!4m2!3m1!1s0x46525300f88a9071:0x4b7db35f3b5ec14b", website: "https://www.dangleterre.com/en/maison-dangleterre", phone: "78 79 51 87" },
  { name: "Flere Fugle", address: "Rentemestervej 57, 2400 København", neighbourhood: "Nordvest", rating: 4.3, reviewsCount: 677, url: "https://www.google.com/maps/place/Flere+Fugle/data=!4m2!3m1!1s0x465253d689f1f72f:0xed86676cfdfeb8ff", website: "http://www.flerefugle.dk/", phone: "93 63 42 01" },
  { name: "Rondo", address: "Sjællandsgade 7, 2200 København", neighbourhood: "Nørrebro", rating: 4.5, reviewsCount: 273, url: "https://www.google.com/maps/place/Rondo/data=!4m2!3m1!1s0x4652537ae0a512b3:0x72b66bc2215f7ca4", website: "http://www.rondo.dk/", phone: "55 55 09 90" },
  { name: "Hart (Refshaleøen)", address: "Refshalevej 159A, 1432 København", neighbourhood: "Refshaleøen", rating: 4.6, reviewsCount: 290, url: "https://www.google.com/maps/place/Hart/data=!4m2!3m1!1s0x465253b36c793463:0x34b60e6a98842084", website: "https://hartbageri.com/", phone: null },
  { name: "Hart Bageri (Vesterbro)", address: "Istedgade 61, 1650 København", neighbourhood: "Vesterbro", rating: 4.6, reviewsCount: 139, url: "https://www.google.com/maps/place/Hart+Bageri/data=!4m2!3m1!1s0x46525390d674bd49:0x4ca2fd380ff2429d", website: "http://hartbageri.com/", phone: null },
  { name: "Københavns Bageri", address: "Flaskehalsen 22, 1799 København", neighbourhood: "Islands Brygge", rating: 4.6, reviewsCount: 247, url: "https://www.google.com/maps/place/K%C3%B8benhavns+Bageri/data=!4m2!3m1!1s0x4652532c32841b61:0x289933757748ada0", website: "https://www.earnest-eats.dk/projects-1/koebenhavnsbageri", phone: null },
  { name: "Juno the bakery", address: "Århusgade 48, 2100 København", neighbourhood: "Østerbro", rating: 4.7, reviewsCount: 3642, url: "https://www.google.com/maps/place/Juno+the+bakery/data=!4m2!3m1!1s0x465252f035a89c17:0x11c1cda65903316", website: "https://www.junothebakery.com/", phone: null },
  { name: "Alice Ice Cream & Coffee", address: "Markmandsgade 1, 2300 København", neighbourhood: "Amager", rating: 4.5, reviewsCount: 569, url: "https://www.google.com/maps/place/Alice+Ice+Cream+%26+Coffee/data=!4m2!3m1!1s0x4652533874b25553:0x24522c2aa3dffe0d", website: "https://www.earnest-eats.dk/projects-1/alice-63gjd", phone: null },
  { name: "Andersen Bakery (Ørestad)", address: "Ørestads Blvd. 49A, 2300 København", neighbourhood: "Amager", rating: 4.7, reviewsCount: 420, url: "https://www.google.com/maps/place/Andersen+Bakery/data=!4m2!3m1!1s0x46525598ff0d609b:0x41a63611b0520691", website: "https://andersen-bakery-eu.dk/", phone: "33 75 07 35" },
  
  { name: "Andersen & Maillard (Nørrebro)", address: "Nørrebrogade 62, 2200 København N", neighbourhood: "Nørrebro", rating: 4.4, reviewsCount: 1933, url: "https://www.google.com/maps/place/Andersen+%26+Maillard/data=!4m2!3m1!1s0x46525248586eef61:0x937ff35354fafcad", website: "https://www.andersenmaillard.dk/", phone: null },
  { name: "Meyers Bageri", address: "Jægersborggade 9, 2200 København", neighbourhood: "Nørrebro", rating: 4.6, reviewsCount: 412, url: "https://www.google.com/maps/place/Meyers+Bageri/data=!4m2!3m1!1s0x465253ad95201c67:0x5a4372488f3002af", website: "https://meyers.dk/bageri/meyers-bagerier/meyers-bageri-jaegersborggade/", phone: "25 10 11 34" },
  
  { name: "Ard Bakery", address: "Peter Bangs Vej 95, 2000 Frederiksberg", neighbourhood: "Frederiksberg", rating: 4.4, reviewsCount: 223, url: "https://www.google.com/maps/place/Ard+Bakery/data=!4m2!3m1!1s0x465253c30d306aa7:0x96cdb8507c16e76c", website: "http://www.ardbakery.dk/", phone: "31 31 38 24" },
];
