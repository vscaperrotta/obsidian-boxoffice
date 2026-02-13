## Documentazione tecnica

Questa documentazione descrive l'architettura e i componenti principali del plugin (codename: CineVault / BoxOffice).

### Architettura

- **Plugin Core** (`src/main.ts`): gestione del lifecycle del plugin, caricamento impostazioni, registrazione della view e icon ribbon.
- **View Layer** (`src/views/pluginView.ts`): UI principale, rendering della lista film, gestione modali e interazioni.
- **Service Layer** (`src/services/*`): servizi per persistenza (`libraryStorage.ts`) e integrazione OMDb (`omdbService.ts`).
- **Settings & UI Components**: tab impostazioni (`src/settings/settingsTab.ts`), modali e componenti riutilizzabili in `src/ui/`.

### Modello dati

Oggetto radice salvato in JSON (esempio semplificato):

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
  // altri campi OMDb quando disponibili
}
```

Il file di default viene creato tramite `createDefaultData()` in `libraryStorage.ts` e normalizzato con `normalizeData()`.

### `libraryStorage.ts`

- Funzioni principali:
  - `getDefaultPath(folder?)` — percorso predefinito `BoxOffice/libraryStorage.json`.
  - `createJsonFile(app, folder?)` — crea il file di libreria nel vault; se esiste crea un file con suffisso timestamp.
  - `loadLocalFile(app, file)` — legge e parsifica il JSON dal vault, valida la struttura e normalizza i movie.
  - `saveLocalData(app, file, data)` — salva il JSON formattato nel vault.
  - `ensureFolder(app, folder?)` — si assicura che la cartella esista nel vault.

Queste funzioni usano l'API di Obsidian (`app.vault`) e lanciano errori chiari in caso di formato non valido.

### `omdbService.ts`

- `searchOmdb(query, apiKey, type?, year?)` — esegue la chiamata a `https://www.omdbapi.com/?apikey={key}&s={query}` e ritorna una lista di risultati semplificati.
- `getOmdbDetails(imdbId, apiKey)` — recupera i dettagli completi `?i={imdbId}&plot=full&tomatoes=true` e implementa una logica di retry (fino a 3 tentativi).

Entrambe le funzioni ritornano `null` o array vuoti se manca la `apiKey` o in caso di errore.

### Impostazioni plugin

I dati di configurazione del plugin sono salvati via `this.saveData()` di Obsidian (vedi `main.ts`). Le impostazioni note sono ad oggi:

```ts
interface PluginSettings {
  localJsonPath?: string | null; // percorso file JSON salvato nelle impostazioni (se impostato)
  omdbApiKey?: string;
  viewMode?: 'grid' | 'list';
  libraryFolder?: string; // cartella nel vault dove salvare il JSON
}
```

Le impostazioni vengono caricate e salvate in `loadPluginData()` / `savePluginData()` in `main.ts`.

### Styling

Gli stili SCSS sono sotto `src/styles/` e compilati in `styles.css`. La convenzione di classi segue il prefisso `cinevault-`.

### Build e sviluppo

- `npm run dev`: esegue `esbuild.config.mjs` in modalità watch e `sass --watch` per gli stili.
- `npm run build`: esegue `tsc` per il controllo tipi e poi esbuild per la build di produzione; c'è anche uno step `prebuild` per compilare gli SCSS.

File di configurazione rilevanti: `package.json`, `tsconfig.json`, `esbuild.config.mjs`.

### Dipendenze

- `obsidian` (API runtime)
- `esbuild`, `typescript`, `sass` per lo sviluppo/build
- `concurrently` usato negli script dev

Node.js 22+ è raccomandato per compatibilità con gli script e le API usate.

### Note di integrazione OMDb

- Endpoint principali:
  - Search: `https://www.omdbapi.com/?apikey={key}&s={query}`
  - Details: `https://www.omdbapi.com/?apikey={key}&i={imdbId}&plot=full&tomatoes=true`
- Il codice gestisce risposta non-True e stampa errori su console; la funzione `getOmdbDetails` ritenta fino a tre volte in caso di errore di rete.

### Test e debugging

- Esegui `npm run dev` e apri Obsidian con la cartella del progetto nel vault per avere hot-reload.
- Usa i log in console di Obsidian per debug di richieste OMDb e operazioni di I/O file.

### Contribuire

- Apri PR piccole e mirate, mantieni coerenza TypeScript.
- Aggiorna `TECHNICAL.md` quando modifichi il modello dati o i servizi di persistenza.
