import '@fontsource/press-start-2p';

const bakeries = [
  { name: "Leckerbaer", url: "https://www.google.com/maps/place/Leckerbaer/data=!4m2!3m1!1s0x465252fc9a472a3b:0x1c69782f50b04f89" },
  { name: "Andersen & Maillard", url: "https://www.google.com/maps/place/Andersen+%26+Maillard/data=!4m2!3m1!1s0x46525340d60ad511:0xb0f67808cae024e9" },
  { name: "Collective Bakery", url: "https://www.google.com/maps/place/Collective+Bakery/data=!4m2!3m1!1s0x4652537daeda7453:0x4b4a8ef15339e121" },
  { name: "Bageriet Benji", url: "https://www.google.com/maps/place/Bageriet+Benji/data=!4m2!3m1!1s0x465253a73dacd217:0x8f04631805fab283" },
  { name: "Sinne gas bageri", url: "https://www.google.com/maps/place/Sinne+gas+bageri/data=!4m2!3m1!1s0x465253e902130051:0x3f6f375e56801295" },
  { name: "La Cabra", url: "https://www.google.com/maps/place/La+Cabra/data=!4m2!3m1!1s0x46525314a7b7ede7:0x3a4a1e0f4b65854f" },
  { name: "Skipper Bageri", url: "https://www.google.com/maps/place/Skipper+Bageri/data=!4m2!3m1!1s0x465253da34838ac5:0xab3822dff8c8f5fa" },
  { name: "DILLON", url: "https://www.google.com/maps/place/DILLON/data=!4m2!3m1!1s0x46525306067ca7f5:0x47aaf7dcb857086f" },
  { name: "Rug Bakery", url: "https://www.google.com/maps/place/Rug+Bakery/data=!4m2!3m1!1s0x46525359463436c3:0x9c0a400a20eca83e" },
  { name: "Perron", url: "https://www.google.com/maps/place/Perron/data=!4m2!3m1!1s0x46525374332fc119:0xb6a2e77f1147712e" },
  { name: "Cakenhagen Vesterbrogade", url: "https://www.google.com/maps/place/Cakenhagen+Vesterbrogade/data=!4m2!3m1!1s0x4652536a1363f95b:0x6e5ec14d6e846534" },
  { name: "Det Franske Konditori", url: "https://www.google.com/maps/place/Det+Franske+Konditori/data=!4m2!3m1!1s0x465253a6f108ad7d:0xa951017679515b2f" },
  { name: "Hart", url: "https://www.google.com/maps/place/Hart/data=!4m2!3m1!1s0x4652530030fd8f4f:0x990da25bc38605ec" },
  { name: "Andersen Bakery", url: "https://www.google.com/maps/place/Andersen+Bakery/data=!4m2!3m1!1s0x4652530d731eb667:0x421b0fb5b128311" },
  { name: "Riviera", url: "https://www.google.com/maps/place/Riviera/data=!4m2!3m1!1s0x4652536bbaa4ac13:0x34e841e7c3cc40fb" },
  { name: "Maison d'Angleterre", url: "https://www.google.com/maps/place/Maison+d'Angleterre/data=!4m2!3m1!1s0x46525300f88a9071:0x4b7db35f3b5ec14b" },
  { name: "Flere Fugle", url: "https://www.google.com/maps/place/Flere+Fugle/data=!4m2!3m1!1s0x465253d689f1f72f:0xed86676cfdfeb8ff" },
  { name: "Rondo", url: "https://www.google.com/maps/place/Rondo/data=!4m2!3m1!1s0x4652537ae0a512b3:0x72b66bc2215f7ca4" },
  { name: "Hart (Frederiksberg)", url: "https://www.google.com/maps/place/Hart/data=!4m2!3m1!1s0x465253b36c793463:0x34b60e6a98842084" },
  { name: "Hart Bageri", url: "https://www.google.com/maps/place/Hart+Bageri/data=!4m2!3m1!1s0x46525390d674bd49:0x4ca2fd380ff2429d" },
  { name: "Københavns Bageri", url: "https://www.google.com/maps/place/K%C3%B8benhavns+Bageri/data=!4m2!3m1!1s0x4652532c32841b61:0x289933757748ada0" },
  { name: "Juno the bakery", url: "https://www.google.com/maps/place/Juno+the+bakery/data=!4m2!3m1!1s0x465252f035a89c17:0x11c1cda65903316" },
  { name: "Alice Ice Cream & Coffee", url: "https://www.google.com/maps/place/Alice+Ice+Cream+%26+Coffee/data=!4m2!3m1!1s0x4652533874b25553:0x24522c2aa3dffe0d" },
  { name: "Andersen Bakery (Amager)", url: "https://www.google.com/maps/place/Andersen+Bakery/data=!4m2!3m1!1s0x46525598ff0d609b:0x41a63611b0520691" },
  { name: "Format Café", url: "https://www.google.com/maps/place/Format+Caf%C3%A9/data=!4m2!3m1!1s0x46525397450eeb39:0x1a000f3cecb71130" },
  { name: "Andersen & Maillard (Østerbro)", url: "https://www.google.com/maps/place/Andersen+%26+Maillard/data=!4m2!3m1!1s0x46525248586eef61:0x937ff35354fafcad" },
  { name: "Meyers Bageri", url: "https://www.google.com/maps/place/Meyers+Bageri/data=!4m2!3m1!1s0x465253ad95201c67:0x5a4372488f3002af" },
  { name: "Daniali & Schiøtz Bageri", url: "https://www.google.com/maps/place/Daniali+%26+Schi%C3%B8tz+Bageri/data=!4m2!3m1!1s0x465253bb0c39fbc9:0xd8893949ef4fd779" },
  { name: "Ard Bakery", url: "https://www.google.com/maps/place/Ard+Bakery/data=!4m2!3m1!1s0x465253c30d306aa7:0x96cdb8507c16e76c" },
];

const Index = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <hr style={{ borderColor: 'black', borderWidth: '2px' }} />
      <h1 
        className="pixel-font" 
        style={{ 
          fontSize: '24px', 
          fontWeight: 'normal', 
          marginBottom: '15px',
          marginTop: '15px',
          lineHeight: '1.8',
          color: 'hsl(350 80% 55%)'
        }}
      >
        CPH Food Files
      </h1>
      <p style={{ marginBottom: '20px', fontSize: '14px' }}>
        <em>✦ Fastelavnsboller i København ✦</em>
      </p>
      <hr style={{ borderColor: 'black', borderWidth: '2px' }} />
      
      <p style={{ margin: '20px 0' }}>
        <strong>Last updated:</strong> January 2026<br />
        <strong>Curated by:</strong> Hanna
      </p>
      
      <hr />
      
      <h2 style={{ fontSize: '18px', fontWeight: 'normal', marginTop: '20px', marginBottom: '15px' }}>
        Where to get the best Fastelavnsbolle ({bakeries.length} places)
      </h2>
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {bakeries.map((bakery, index) => (
          <li key={index} style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
            <a href={`https://www.google.com/search?q=${encodeURIComponent(bakery.name + ' copenhagen')}`} target="_blank" rel="noopener noreferrer">
              <strong>{bakery.name}</strong>
            </a>
          </li>
        ))}
      </ul>
      
      <hr style={{ margin: '30px 0' }} />
      
      <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
        <em>
          CPH Food Files — No accounts. No hassle.<br />
          Just Copenhagen's finest, ready when you need them.
        </em>
      </p>
      
      <hr />
      
      <p style={{ fontSize: '12px', marginTop: '10px' }}>
        © 2026 CPH Food Files · Hanna Zoon
      </p>
    </div>
  );
};

export default Index;
