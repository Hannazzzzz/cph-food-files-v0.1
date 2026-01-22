import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BakeryTable from '@/components/BakeryTable';
import BakeryMap from '@/components/BakeryMap';
import { bakeries } from '@/data/bakeries';

const Index = () => {
  const [selectedBakeryName, setSelectedBakeryName] = useState<string | null>(null);
  const mapSectionRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className="w-full px-5 py-6">
      <header className="flex items-start justify-between gap-6">
        <h1 className="site-title m-0 text-left leading-tight">CPH Food Files</h1>

        <div className="text-right">
          <p className="m-0">
            <strong>Last updated:</strong> January 2026
            <br />
            <strong>Curated by:</strong> Hanna
          </p>
        </div>
      </header>

      {/* Full-window-width map */}
      <section
        ref={mapSectionRef}
        aria-label="Map"
        className="mt-5 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
      >
        <BakeryMap selectedBakeryName={selectedBakeryName} />
      </section>

      <section className="mt-6" aria-label="Places list">
        <h2 className="m-0 mb-3 text-left">Places ({bakeries.length})</h2>

        <BakeryTable
          onSelectBakery={(name) => {
            setSelectedBakeryName(name);
            mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
      </section>

      <footer className="mt-10">
        <p className="text-meta m-0" style={{ color: 'hsl(0 0% 40%)' }}>
          <em>
            CPH Food Files | My answers to 'Hanna, where do you go for ...?'<br />
            Only 5/5 recommended places according to me, updated when I feel like it. Information was correct at the time of posting. No further promises.{' '}
            <Link to="/about">More about this website</Link>
          </em>
        </p>

        <p className="text-label mt-3">© 2026 CPH Food Files · Hanna Zoon</p>
      </footer>
    </main>
  );
};

export default Index;
