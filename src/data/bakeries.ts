export interface Bakery {
  name: string;
  address: string;
  neighbourhood: string;
  rating: number | null;
  reviewsCount: number | null;
  url: string;
  website: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
}

// Map postal codes to neighbourhood names based on official Danish postal code directory
// København K (1000-1499) = Indre By/Christianshavn
// København V (1500-1799) = Vesterbro/City center
// Frederiksberg C (1800-1999) = Frederiksberg
// Frederiksberg (2000) = Frederiksberg
// København Ø (2100) = Østerbro
// København N (2200) = Nørrebro
// København S (2300) = Amager
// København NV (2400) = Nordvest
// København SV (2450) = Sydhavn
// Valby (2500) = Valby
const postalCodeToNeighbourhood: Record<string, string> = {
  // København K - Indre By
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
  // København K - Christianshavn
  '1400': 'Christianshavn',
  '1401': 'Christianshavn',
  '1402': 'Christianshavn',
  '1403': 'Christianshavn',
  '1404': 'Christianshavn',
  '1405': 'Christianshavn',
  '1406': 'Christianshavn',
  '1407': 'Christianshavn',
  '1408': 'Christianshavn',
  '1409': 'Christianshavn',
  '1410': 'Christianshavn',
  '1411': 'Christianshavn',
  '1412': 'Christianshavn',
  '1413': 'Christianshavn',
  '1414': 'Christianshavn',
  '1415': 'Christianshavn',
  '1416': 'Christianshavn',
  '1417': 'Christianshavn',
  '1418': 'Christianshavn',
  '1419': 'Christianshavn',
  '1420': 'Christianshavn',
  '1421': 'Christianshavn',
  '1422': 'Christianshavn',
  '1423': 'Christianshavn',
  '1424': 'Christianshavn',
  '1425': 'Christianshavn',
  '1426': 'Christianshavn',
  '1427': 'Christianshavn',
  '1428': 'Christianshavn',
  '1429': 'Christianshavn',
  '1430': 'Christianshavn',
  '1431': 'Christianshavn',
  // København K - Refshaleøen (part of Christianshavn area)
  '1432': 'Refshaleøen',
  '1433': 'Refshaleøen',
  // København K - continued
  '1434': 'Christianshavn',
  '1435': 'Christianshavn',
  '1436': 'Christianshavn',
  '1437': 'Christianshavn',
  '1438': 'Christianshavn',
  '1439': 'Christianshavn',
  '1440': 'Christianshavn',
  '1441': 'Christianshavn',
  '1450': 'Indre By',
  '1500': 'Indre By',
  '1550': 'Indre By',
  // København V - Vesterbro
  '1600': 'Vesterbro',
  '1620': 'Vesterbro',
  '1650': 'Vesterbro',
  '1700': 'Vesterbro',
  '1704': 'Vesterbro',
  '1750': 'Vesterbro',
  '1799': 'Vesterbro', // Carlsberg area - officially København V
  // Frederiksberg C
  '1800': 'Frederiksberg',
  '1850': 'Frederiksberg',
  '1879': 'Frederiksberg',
  '1900': 'Frederiksberg',
  // Frederiksberg
  '2000': 'Frederiksberg',
  // København Ø - Østerbro
  '2100': 'Østerbro',
  // Nordhavn (part of Østerbro, newer development)
  '2150': 'Nordhavn',
  // København N - Nørrebro
  '2200': 'Nørrebro',
  // København S - Amager
  '2300': 'Amager',
  // København NV - Nordvest
  '2400': 'Nordvest',
  // København SV - Sydhavn
  '2450': 'Sydhavn',
  // Valby
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

// Hardcoded bakery data parsed from the enriched CSV with coordinates
export const bakeries: Bakery[] = [
  { name: "Leckerbaer", address: "Ryesgade 118, 2100 København Ø", neighbourhood: "Østerbro", rating: 4.6, reviewsCount: 241, url: "https://www.google.com/maps/place/Leckerbaer/data=!4m2!3m1!1s0x465252fc9a472a3b:0x1c69782f50b04f89", website: "http://leckerbaer.dk/", phone: "28 40 48 64", latitude: 55.697754, longitude: 12.5742417 },
  { name: "Andersen & Maillard (Nordhavn)", address: "Antwerpengade 10, 2150 København", neighbourhood: "Nordhavn", rating: 4.4, reviewsCount: 561, url: "https://www.google.com/maps/place/Andersen+%26+Maillard/data=!4m2!3m1!1s0x46525340d60ad511:0xb0f67808cae024e9", website: "https://www.andersenmaillard.dk/", phone: "33 32 23 22", latitude: 55.7072013, longitude: 12.5966835 },
  { name: "Collective Bakery", address: "Nørrebrogade 176, 2200 København", neighbourhood: "Nørrebro", rating: 4.3, reviewsCount: 141, url: "https://www.google.com/maps/place/Collective+Bakery/data=!4m2!3m1!1s0x4652537daeda7453:0x4b4a8ef15339e121", website: "https://www.collectivebakery.dk/", phone: "31 36 75 33", latitude: 55.6967659, longitude: 12.5455458 },
  { name: "Bageriet Benji", address: "Mjølnerparken 52, 2200 København N", neighbourhood: "Nørrebro", rating: 4.5, reviewsCount: 190, url: "https://www.google.com/maps/place/Bageriet+Benji/data=!4m2!3m1!1s0x465253a73dacd217:0x8f04631805fab283", website: "https://www.earnest-eats.dk/projects-1/benji", phone: null, latitude: 55.7038803, longitude: 12.5417881 },
  { name: "Sinne gas bageri", address: "Ryesgade 63, 2100 København", neighbourhood: "Østerbro", rating: 4.9, reviewsCount: 284, url: "https://www.google.com/maps/place/Sinne+gas+bageri/data=!4m2!3m1!1s0x465253e902130051:0x3f6f375e56801295", website: "https://sinnegasbageri.dk/", phone: null, latitude: 55.6945642, longitude: 12.5705826 },
  { name: "La Cabra", address: "Århusgade 118X, 2150 København", neighbourhood: "Nordhavn", rating: 4.5, reviewsCount: 43, url: "https://www.google.com/maps/place/La+Cabra/data=!4m2!3m1!1s0x46525314a7b7ede7:0x3a4a1e0f4b65854f", website: "https://lacabra.com/pages/nordhavn", phone: null, latitude: 55.707163, longitude: 12.5920549 },
  { name: "Skipper Bageri", address: "Østerbrogade 103, 2100 København", neighbourhood: "Østerbro", rating: 4.6, reviewsCount: 253, url: "https://www.google.com/maps/place/Skipper+Bageri/data=!4m2!3m1!1s0x465253da34838ac5:0xab3822dff8c8f5fa", website: "https://www.facebook.com/Skipper-bageri-107406865450827/", phone: "24 24 53 61", latitude: 55.7096286, longitude: 12.5772439 },
  { name: "DILLON", address: "Tåsingegade 51, 2100 København", neighbourhood: "Østerbro", rating: 4.7, reviewsCount: 73, url: "https://www.google.com/maps/place/DILLON/data=!4m2!3m1!1s0x46525306067ca7f5:0x47aaf7dcb857086f", website: "https://www.instagram.com/dillon.cph/", phone: "71 55 43 28", latitude: 55.7102606, longitude: 12.5663434 },
  { name: "Rug Bakery", address: "Tietgensgade 39, 1704 København", neighbourhood: "Vesterbro", rating: 4.5, reviewsCount: 1003, url: "https://www.google.com/maps/place/Rug+Bakery/data=!4m2!3m1!1s0x46525359463436c3:0x9c0a400a20eca83e", website: "https://rugbakery.com/", phone: "78 73 00 58", latitude: 55.6712708, longitude: 12.567272 },
  { name: "Perron", address: "Otto Busses Vej 45, 2450 København", neighbourhood: "Sydhavn", rating: 4.0, reviewsCount: 126, url: "https://www.google.com/maps/place/Perron/data=!4m2!3m1!1s0x46525374332fc119:0xb6a2e77f1147712e", website: "https://www.perroncph.dk/", phone: null, latitude: 55.6583954, longitude: 12.5427843 },
  { name: "Cakenhagen Vesterbrogade", address: "Vesterbrogade 1, 1620 København", neighbourhood: "Vesterbro", rating: 4.5, reviewsCount: 93, url: "https://www.google.com/maps/place/Cakenhagen+Vesterbrogade/data=!4m2!3m1!1s0x4652536a1363f95b:0x6e5ec14d6e846534", website: "https://www.nimb.dk/restaurant-bar/cakenhagen", phone: "88 70 00 00", latitude: 55.6751205, longitude: 12.5666843 },
  { name: "Det Franske Konditori", address: "H. C. Ørsteds Vej 44, 1879 Frederiksberg C", neighbourhood: "Frederiksberg", rating: 4.5, reviewsCount: 92, url: "https://www.google.com/maps/place/Det+Franske+Konditori/data=!4m2!3m1!1s0x465253a6f108ad7d:0xa951017679515b2f", website: "http://detfranskeconditori.dk/", phone: "35 35 15 46", latitude: 55.6810722, longitude: 12.5492381 },
  { name: "Hart (Nørrebro)", address: "Julius Bloms Gade 32, 2200 København", neighbourhood: "Nørrebro", rating: 4.2, reviewsCount: 85, url: "https://www.google.com/maps/place/Hart/data=!4m2!3m1!1s0x4652530030fd8f4f:0x990da25bc38605ec", website: "https://hartbageri.com/", phone: null, latitude: 55.6952807, longitude: 12.5440316 },
  { name: "Andersen Bakery (Amager)", address: "Thorshavnsgade 26, 2300 Amager Vest", neighbourhood: "Amager", rating: 4.6, reviewsCount: 2627, url: "https://www.google.com/maps/place/Andersen+Bakery/data=!4m2!3m1!1s0x4652530d731eb667:0x421b0fb5b128311", website: "https://andersen-bakery-eu.dk/", phone: "33 75 07 35", latitude: 55.6672402, longitude: 12.5785336 },
  { name: "Riviera", address: "Nansensgade 64, 1366 København K", neighbourhood: "Indre By", rating: 4.3, reviewsCount: 176, url: "https://www.google.com/maps/place/Riviera/data=!4m2!3m1!1s0x4652536bbaa4ac13:0x34e841e7c3cc40fb", website: null, phone: null, latitude: 55.6836487, longitude: 12.5654745 },
  { name: "Maison d'Angleterre", address: "Østergade 2, 1100 København K", neighbourhood: "Indre By", rating: 4.3, reviewsCount: 82, url: "https://www.google.com/maps/place/Maison+d'Angleterre/data=!4m2!3m1!1s0x46525300f88a9071:0x4b7db35f3b5ec14b", website: "https://www.dangleterre.com/en/maison-dangleterre", phone: "78 79 51 87", latitude: 55.6803408, longitude: 12.5847903 },
  { name: "Flere Fugle", address: "Rentemestervej 57, 2400 København", neighbourhood: "Nordvest", rating: 4.3, reviewsCount: 677, url: "https://www.google.com/maps/place/Flere+Fugle/data=!4m2!3m1!1s0x465253d689f1f72f:0xed86676cfdfeb8ff", website: "http://www.flerefugle.dk/", phone: "93 63 42 01", latitude: 55.7073855, longitude: 12.524697 },
  { name: "Rondo", address: "Sjællandsgade 7, 2200 København", neighbourhood: "Nørrebro", rating: 4.5, reviewsCount: 273, url: "https://www.google.com/maps/place/Rondo/data=!4m2!3m1!1s0x4652537ae0a512b3:0x72b66bc2215f7ca4", website: "http://www.rondo.dk/", phone: "55 55 09 90", latitude: 55.6932303, longitude: 12.5522123 },
  { name: "Hart (Refshaleøen)", address: "Refshalevej 159A, 1432 København", neighbourhood: "Refshaleøen", rating: 4.6, reviewsCount: 290, url: "https://www.google.com/maps/place/Hart/data=!4m2!3m1!1s0x465253b36c793463:0x34b60e6a98842084", website: "https://hartbageri.com/", phone: null, latitude: 55.6912475, longitude: 12.6114625 },
  { name: "Hart Bageri (Vesterbro)", address: "Istedgade 61, 1650 København", neighbourhood: "Vesterbro", rating: 4.6, reviewsCount: 140, url: "https://www.google.com/maps/place/Hart+Bageri/data=!4m2!3m1!1s0x46525390d674bd49:0x4ca2fd380ff2429d", website: "http://hartbageri.com/", phone: null, latitude: 55.6690567, longitude: 12.5532377 },
  { name: "Københavns Bageri", address: "Flaskehalsen 22, 1799 København", neighbourhood: "Vesterbro", rating: 4.6, reviewsCount: 247, url: "https://www.google.com/maps/place/K%C3%B8benhavns+Bageri/data=!4m2!3m1!1s0x4652532c32841b61:0x289933757748ada0", website: "https://www.earnest-eats.dk/projects-1/koebenhavnsbageri", phone: null, latitude: 55.6646938, longitude: 12.5354426 },
  { name: "Juno the bakery", address: "Århusgade 48, 2100 København", neighbourhood: "Østerbro", rating: 4.7, reviewsCount: 3644, url: "https://www.google.com/maps/place/Juno+the+bakery/data=!4m2!3m1!1s0x465252f035a89c17:0x11c1cda65903316", website: "https://www.junothebakery.com/", phone: null, latitude: 55.7061815, longitude: 12.5818152 },
  { name: "Alice Ice Cream & Coffee", address: "Markmandsgade 1, 2300 København", neighbourhood: "Amager", rating: 4.5, reviewsCount: 569, url: "https://www.google.com/maps/place/Alice+Ice+Cream+%26+Coffee/data=!4m2!3m1!1s0x4652533874b25553:0x24522c2aa3dffe0d", website: "https://www.earnest-eats.dk/projects-1/alice-63gjd", phone: null, latitude: 55.6684086, longitude: 12.5970575 },
  { name: "Andersen Bakery (Ørestad)", address: "Ørestads Blvd. 49A, 2300 København", neighbourhood: "Amager", rating: 4.7, reviewsCount: 420, url: "https://www.google.com/maps/place/Andersen+Bakery/data=!4m2!3m1!1s0x46525598ff0d609b:0x41a63611b0520691", website: "https://andersen-bakery-eu.dk/", phone: "33 75 07 35", latitude: 55.636663, longitude: 12.5828915 },
  { name: "Andersen & Maillard (Nørrebro)", address: "Nørrebrogade 62, 2200 København N", neighbourhood: "Nørrebro", rating: 4.4, reviewsCount: 1933, url: "https://www.google.com/maps/place/Andersen+%26+Maillard/data=!4m2!3m1!1s0x46525248586eef61:0x937ff35354fafcad", website: "https://www.andersenmaillard.dk/", phone: null, latitude: 55.6903659, longitude: 12.5551042 },
  { name: "Meyers Bageri", address: "Jægersborggade 9, 2200 København", neighbourhood: "Nørrebro", rating: 4.6, reviewsCount: 412, url: "https://www.google.com/maps/place/Meyers+Bageri/data=!4m2!3m1!1s0x465253ad95201c67:0x5a4372488f3002af", website: "https://meyers.dk/bageri/meyers-bagerier/meyers-bageri-jaegersborggade/", phone: "25 10 11 34", latitude: 55.691859, longitude: 12.5449609 },
  
  { name: "Ard Bakery", address: "Peter Bangs Vej 95, 2000 Frederiksberg", neighbourhood: "Frederiksberg", rating: 4.4, reviewsCount: 223, url: "https://www.google.com/maps/place/Ard+Bakery/data=!4m2!3m1!1s0x465253c30d306aa7:0x96cdb8507c16e76c", website: "http://www.ardbakery.dk/", phone: "31 31 38 24", latitude: 55.678465, longitude: 12.501709 },
];