# CPH Food Files

A curated guide to Copenhagen's best food spots, currently featuring bakeries serving fastelavnsboller for fastelavn 2026. The project combines manual curation with automated data enrichment to provide up-to-date information about restaurants and cafes in Copenhagen.

**Live site**: [cphfoodfiles.dk](https://www.cphfoodfiles.dk/)

## About This Project

CPH Food Files is an interactive web application that helps people discover the best food spots in Copenhagen. The current focus is on bakeries serving fastelavnsboller (a traditional Danish Carnival pastry), but the architecture is designed to be extensible for other food categories.

The site features:
- Interactive map showing all locations using Leaflet
- Detailed information about each bakery including addresses, opening hours, and ratings
- Automatic data enrichment from Google Maps
- Responsive design that works on all devices
- Fast performance with modern web technologies

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn-ui** - High-quality, accessible UI components
- **React Leaflet** - Interactive maps
- **Lucide React** - Icon library
- **TanStack Query** - Data fetching and caching

### Data Pipeline
- **Python 3** - Scraper scripting
- **Google Maps API** - Restaurant data source
- **CSV** - Simple, version-controllable data format

## Getting Started

### Prerequisites
- Node.js 18+ and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Python 3.7+ (only needed if you want to run the data scraper)

### Installation

1. Clone the repository:
```sh
git clone https://github.com/Hannazzzzz/cph-food-files-v0.1.git
cd cph-food-files-v0.1
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

The site will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Vitest

## Project Structure

```
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── pages/           # Page components
│   └── main.tsx         # Application entry point
├── scripts/             # Data scraper scripts
│   ├── harvest_restaurants.py
│   ├── test_run.py
│   └── requirements.txt
├── docs/                # Documentation files
├── public/              # Static assets
├── Fastelavnsbolle.csv  # Source data (manually curated)
└── Favorite places_enriched.csv  # Enriched data (auto-generated)
```

## Data Pipeline & Scraper

The project uses a two-stage data pipeline:

1. **Manual Curation** (`Fastelavnsbolle.csv`)
   Hand-picked restaurants are added to this CSV with basic information: name, Google Maps URL, and optional tags/comments.

2. **Automated Enrichment** (`Favorite places_enriched.csv`)
   A Python scraper fetches additional details from Google Maps including:
   - Full address and postal code
   - Neighborhood/district (e.g., "Nørrebro", "Vesterbro")
   - Opening hours
   - Star rating and review count
   - Google Maps Place ID
   - Geographic coordinates for map display

### Running the Scraper

**Prerequisites:**
```sh
pip3 install -r scripts/requirements.txt
```

**Usage:**
```sh
# Test run (processes only 3 restaurants for quick verification)
python3 scripts/test_run.py Fastelavnsbolle.csv

# Full scraper (processes all restaurants)
python3 scripts/harvest_restaurants.py Fastelavnsbolle.csv
```

The scraper generates `Favorite places_enriched.csv` which is automatically loaded by the website on the next build or page refresh.

**Important:** Always run scraper commands from the repository root directory.

### Scraper Architecture

The scraper is designed with several key features:
- **Tag preservation** - Manually added tags in the source CSV are preserved during enrichment
- **Idempotent operation** - Can be run multiple times safely; only updates changed data
- **Error handling** - Continues processing even if individual restaurants fail
- **Test mode** - Quick validation with `test_run.py` before running the full scraper

**Scraper files:**
- `scripts/harvest_restaurants.py` - Main scraper implementation
- `scripts/test_run.py` - Quick test with 3 restaurants
- `scripts/test_tag_logic.py` - Unit tests for tag preservation
- `scripts/RUN_ME.sh` - Convenience wrapper script
- `scripts/requirements.txt` - Python dependencies
- `scripts/HOW_TO_RUN.txt` - Detailed usage instructions

**Reference materials:**
- `docs/PostalcodesEnglish.pdf` - Copenhagen postal code mappings for neighborhood detection

## Contributing

**Technical contributions are welcome!** This project benefits from community input on code quality, performance, and features. However, the selection and curation of restaurants is maintained as a personal editorial decision.

### What You Can Contribute

**✅ Code improvements:**
- Bug fixes and error handling
- Performance optimizations
- UI/UX enhancements
- Accessibility improvements
- Test coverage
- Documentation updates

**✅ New features:**
- Filters and search functionality
- Favorites/bookmarking system
- Social sharing features
- Mobile app development
- Progressive Web App (PWA) features

**✅ Scraper improvements:**
- Support for additional data sources
- Better error handling and retry logic
- Rate limiting improvements
- Support for other food categories
- Geographic features (distance calculations, route planning)

**❌ Restaurant curation:**
The selection of which restaurants to include is a personal editorial decision. Pull requests adding restaurants will not be accepted.

### How to Contribute

1. **Open an issue first** - For significant changes, please open an issue to discuss your idea before investing time in implementation. This helps ensure your contribution aligns with the project direction.

2. **Fork and create a branch**:
   ```sh
   git clone https://github.com/YOUR_USERNAME/cph-food-files-v0.1.git
   cd cph-food-files-v0.1
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** - Follow the existing code style and patterns.

4. **Test thoroughly** - Run `npm run lint` and `npm test` to ensure your changes don't break anything.

5. **Submit a pull request** - Provide a clear description of what your changes do and why they're valuable.

### Architecture Overview

Understanding these key aspects will help you contribute effectively:

**Frontend (src/):**
- React 18 with TypeScript for type safety
- Tailwind CSS for styling (utility-first approach)
- shadcn-ui components for accessible, customizable UI elements
- React Leaflet for map functionality
- TanStack Query for data fetching and caching

**Data Pipeline (scripts/):**
- Source data: `Fastelavnsbolle.csv` (manually curated)
- Enriched data: `Favorite places_enriched.csv` (auto-generated from Google Maps)
- Python scraper that preserves manual tags while adding location data, hours, ratings, etc.
- Idempotent design - can be run multiple times safely

**Key files:**
- `src/components/` - Reusable React components
- `src/pages/` - Page-level components
- `scripts/harvest_restaurants.py` - Main data enrichment scraper
- `Fastelavnsbolle.csv` - Source of truth for restaurant list

## License

This project is open source and available for anyone to use, modify, and contribute to.

## Credits

Created and curated by [Hanna Zoon](https://hannazoonwordpress.com).

Built with Lovable.dev, Claude.ai and a lot of love for Copenhagen's food scene.
