import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BakeryTable from '@/components/BakeryTable';
import BakeryMap from '@/components/BakeryMap';
import { bakeries } from '@/data/bakeries';

const Index = () => {
  const [selectedBakeryName, setSelectedBakeryName] = useState<string | null>(null);
  const mapSectionRef = useRef<HTMLDivElement | null>(null);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <hr style={{ borderColor: 'black', borderWidth: '2px' }} />
      <h1 
        className="site-title" 
        style={{ 
          marginBottom: '15px',
          marginTop: '15px',
          lineHeight: '1.4'
        }}
      >
        CPH Food Files
      </h1>
      <p className="text-meta" style={{ marginBottom: '20px' }}>
        <em>✦ Fastelavnsboller i København ✦</em>
      </p>
      <hr style={{ borderColor: 'black', borderWidth: '2px' }} />
      
      <p style={{ margin: '20px 0' }}>
        <strong>Last updated:</strong> January 2026<br />
        <strong>Curated by:</strong> Hanna<br />
        <Link to="/about">About this website</Link>
      </p>
      
      <hr />
      
      <h2 style={{ marginTop: '20px', marginBottom: '15px' }}>
        Where to get the best Fastelavnsbolle ({bakeries.length} places)
      </h2>
      
      <BakeryTable
        onSelectBakery={(name) => {
          setSelectedBakeryName(name);
          mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
      
      
      <div ref={mapSectionRef} style={{ marginTop: '30px' }}>
        <BakeryMap selectedBakeryName={selectedBakeryName} />
      </div>
      
      <hr style={{ margin: '30px 0' }} />
      
      <p className="text-meta" style={{ marginTop: '20px', color: 'hsl(0 0% 40%)' }}>
        <em>
          CPH Food Files | My answers to 'Hanna, where do you go for ...?'<br />
          Only 5/5 recommended places according to me, updated when I feel like it. Information was correct at the time of posting. No further promises
        </em>
      </p>
      
      <hr />
      
      <p className="text-label" style={{ marginTop: '10px' }}>
        © 2026 CPH Food Files · Hanna Zoon
      </p>
    </div>
  );
};

export default Index;
