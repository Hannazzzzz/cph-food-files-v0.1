import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { execSync } from "child_process";

// Date the restaurant data was last changed (falls back to today, e.g. fresh checkouts)
function dataLastUpdated(): string {
  try {
    const iso = execSync('git log -1 --format=%cs -- "Favorite places_enriched.csv"', {
      encoding: "utf-8",
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  } catch {
    /* ignore */
  }
  return new Date().toISOString().slice(0, 10);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    __DATA_LAST_UPDATED__: JSON.stringify(dataLastUpdated()),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
