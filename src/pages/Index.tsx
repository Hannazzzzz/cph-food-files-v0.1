import '@fontsource/press-start-2p';
import BakeryTable from '@/components/BakeryTable';
import BakeryMap from '@/components/BakeryMap';
import { bakeries } from '@/data/bakeries';

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
      
      <BakeryTable />
      
      <h2 style={{ fontSize: '18px', fontWeight: 'normal', marginTop: '30px', marginBottom: '15px' }}>
        Map
      </h2>
      
      <BakeryMap />
      
      <hr style={{ margin: '30px 0' }} />
      
      <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
        <em>
          CPH Food Files | My answers to 'Hanna, where do you go for ...?'<br />
          Only 5/5 recommended places according to me, updated when I feel like it. Information was correct at the time of posting. No further promises
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
