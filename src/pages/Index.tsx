import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BakeryTable from '@/components/BakeryTable';
import BakeryMap from '@/components/BakeryMap';
import { bakeries } from '@/data/bakeries';
import { filtersToSearchParams, searchParamsToFilters } from '@/lib/urlFilters';

const Index = () => {
  const [selectedBakeryName, setSelectedBakeryName] = useState<string | null>(null);
  const mapSectionRef = useRef<HTMLDivElement | null>(null);

  // Read URL parameters and initialize filter state
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilters = useMemo(
    () => searchParamsToFilters(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Only run on mount
  );

  const [selectedFoodTags, setSelectedFoodTags] = useState<string[]>(initialFilters.food);
  const [selectedMoodTags, setSelectedMoodTags] = useState<string[]>(initialFilters.mood);
  const [selectedHoodTags, setSelectedHoodTags] = useState<string[]>(initialFilters.hood);

  const filteredBakeries = useMemo(() => {
    return bakeries.filter((bakery) => {
      const matchesFood =
        selectedFoodTags.length === 0 ||
        bakery.foodTags.some((t) =>
          selectedFoodTags.some((s) => s.toLowerCase() === t.toLowerCase()),
        );

      const matchesMood =
        selectedMoodTags.length === 0 ||
        bakery.moodTags.some((t) =>
          selectedMoodTags.some((s) => s.toLowerCase() === t.toLowerCase()),
        );

      const matchesHood =
        selectedHoodTags.length === 0 ||
        selectedHoodTags.some((s) => s.toLowerCase() === bakery.neighbourhood.toLowerCase());

      return matchesFood && matchesMood && matchesHood;
    });
  }, [selectedFoodTags, selectedMoodTags, selectedHoodTags]);

  // Sync filter state to URL (without page reload)
  useEffect(() => {
    const newParams = filtersToSearchParams(
      selectedFoodTags,
      selectedMoodTags,
      selectedHoodTags
    );

    // Only update if params actually changed (avoid infinite loops)
    const currentParams = searchParams.toString();
    const newParamsStr = newParams.toString();

    if (currentParams !== newParamsStr) {
      // Use replace to avoid cluttering browser history
      setSearchParams(newParams, { replace: true });
    }
  }, [selectedFoodTags, selectedMoodTags, selectedHoodTags, searchParams, setSearchParams]);

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
        <BakeryMap
          selectedBakeryName={selectedBakeryName}
          bakeries={filteredBakeries}
          initialFoodTags={selectedFoodTags}
          initialMoodTags={selectedMoodTags}
          initialHoodTags={selectedHoodTags}
          onSelectFoodTags={setSelectedFoodTags}
          onSelectMoodTags={setSelectedMoodTags}
          onSelectHoodTags={setSelectedHoodTags}
        />
      </section>

      <section className="mt-6" aria-label="Places list">
        <h2 className="m-0 mb-3 text-left">Places ({filteredBakeries.length})</h2>

        <BakeryTable
          bakeries={filteredBakeries}
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
            Only 5⭐ recommended places according to me, updated when I feel like it. Information was correct at the time of posting. No further promises.{' '}
            <Link to="/about" className="text-primary hover:text-accent">More about this website</Link>
          </em>
        </p>

        <p className="text-label mt-3">© 2026 CPH Food Files · Hanna Zoon</p>
      </footer>
    </main>
  );
};

export default Index;
