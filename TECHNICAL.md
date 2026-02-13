## Technical Documentation

This document describes the architecture and key components of the plugin (codename: CineVault / BoxOffice).

### Architecture

- **Plugin Core** (`src/main.ts`): manages the plugin lifecycle, loads settings, and registers the view and ribbon icon.
- **View Layer** (`src/views/pluginView.ts`): main UI, rendering the movie list, handling modals and interactions.
- **Service Layer** (`src/services/*`): persistence service (`libraryStorage.ts`) and OMDb integration (`omdbService.ts`).
- **Settings & UI Components**: the settings tab (`src/settings/settingsTab.ts`), modals, and reusable components in `src/ui/`.

### Data Model

Root object saved as JSON (simplified example):

```ts
interface CineVaultData {
  schemaVersion: number;
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
  libraryName: string;
  owner?: string;
  source?: string;
  movies: CineVaultMovie[];
}

interface CineVaultMovie {
  id: string;           // uuid
  imdbId: string;
  title: string;
  year: string;
  poster?: string;
  posterLocal?: string;
  plot?: string;
  ratings?: Array<{Source: string; Value: string}>;
  starRating: number;   // 0-5
  watched: boolean;
  notes?: string;
  // other OMDb fields when available
}
```

The default file is created via `createDefaultData()` in `libraryStorage.ts` and normalized with `normalizeData()`.

### `libraryStorage.ts`

Main functions:
  - `getDefaultPath(folder?)` — returns the default path `BoxOffice/libraryStorage.json`.
  - `createJsonFile(app, folder?)` — creates the library file in the vault; if a file exists, creates a new one with a timestamp suffix.
  - `loadLocalFile(app, file)` — reads and parses the JSON from the vault, validates the structure, and normalizes movies.
  - `saveLocalData(app, file, data)` — saves formatted JSON back to the vault.
  - `ensureFolder(app, folder?)` — ensures the folder exists in the vault.

These functions use the Obsidian API (`app.vault`) and throw clear errors when the format is invalid.

### `omdbService.ts`

- `searchOmdb(query, apiKey, type?, year?)` — calls `https://www.omdbapi.com/?apikey={key}&s={query}` and returns a simplified list of results.
- `getOmdbDetails(imdbId, apiKey)` — retrieves full details using `?i={imdbId}&plot=full&tomatoes=true` and implements a retry logic (up to 3 attempts).

Both functions return `null` or empty arrays if the `apiKey` is missing or on error.

### Plugin Settings

Plugin configuration is stored via Obsidian's `this.saveData()` (see `main.ts`). Known settings are:

```ts
interface PluginSettings {
  localJsonPath?: string | null; // path to the JSON file saved in settings (if set)
  omdbApiKey?: string;
  viewMode?: 'grid' | 'list';
  libraryFolder?: string; // folder in the vault where the JSON is saved
}
```

Settings are loaded and saved in `loadPluginData()` / `savePluginData()` in `main.ts`.

### Styling

SCSS styles live under `src/styles/` and are compiled to `styles.css`. Class names follow the `cinevault-` prefix convention.

### Build and Development

- `npm run dev`: runs `esbuild.config.mjs` in watch mode and `sass --watch` for styles.
- `npm run build`: runs `tsc` for type-checking and then esbuild for the production bundle; there is also a `prebuild` step to compile SCSS.

Relevant config files: `package.json`, `tsconfig.json`, `esbuild.config.mjs`.

### Dependencies

- `obsidian` (runtime API)
- `esbuild`, `typescript`, `sass` for development/build
- `concurrently` used in dev scripts

Node.js 22+ is recommended for compatibility with the scripts and used APIs.

### OMDb Integration Notes

- Main endpoints:
  - Search: `https://www.omdbapi.com/?apikey={key}&s={query}`
  - Details: `https://www.omdbapi.com/?apikey={key}&i={imdbId}&plot=full&tomatoes=true`
- The code handles non-True responses and logs errors to the console; `getOmdbDetails` retries up to three times on network errors.

### Testing and Debugging

- Run `npm run dev` and open Obsidian with the project folder in the vault to enable hot-reload.
- Use Obsidian console logs to debug OMDb requests and I/O operations.

### Contributing

- Open small, focused PRs and keep TypeScript consistency.
- Update `TECHNICAL.md` when changing the data model or persistence services.
