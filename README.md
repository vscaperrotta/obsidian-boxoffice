# BoxOffice — Obsidian Movie Library

BoxOffice è un plugin per Obsidian che trasforma il tuo vault in una piccola libreria personale di film e serie TV. Permette di cercare dati da OMDb, salvare una libreria locale in formato JSON, e gestire watchlist e valutazioni direttamente dentro Obsidian.

## Panoramica

- Ricerca film/serie via OMDb e recupero dettagli (plot, poster, ratings).
- Libreria locale con stato "da vedere" / "visto" e valutazioni personali a stelle.
- Aggiunta/ rimozione veloce dei film con sincronizzazione dei metadati.
- Salvataggio in-vault come file JSON (cartella predefinita `BoxOffice/libraryStorage.json`).
- UI reattiva con vista a griglia o lista e modali per dettagli/azioni.

## Requisiti

- Node.js >= 22.16.0 (per gli script di sviluppo/build)
- Obsidian minimo: 0.15.0

## Installazione

1. Scarica l'ultima release o copia i file compilati nella cartella del tuo vault: `.obsidian/plugins/boxoffice/` (il nome della cartella può variare, usa l'`id` del `manifest.json`).
2. Ricarica Obsidian.
3. Abilita il plugin in Impostazioni → Community Plugins.

Nota: durante lo sviluppo usa la cartella del repository nel vault per avere hot-reload.

## Sviluppo

Comandi principali (root del progetto):

```bash
npm install
npm run dev       # modalità sviluppo (esbuild + watch sass)
npm run build     # build per produzione
```

Gli script e la configurazione di build si trovano in `package.json` ed `esbuild.config.mjs`.

## Configurazione

### OMDb API Key

Per usare la ricerca e ottenere dettagli completi è necessario un API key OMDb:

1. Richiedi una chiave su https://www.omdbapi.com/apikey.aspx
2. Apri Impostazioni → BoxOffice e incolla la tua chiave in `OMDb API Key`.

Il plugin non richiede di inserire una chiave per funzioni locali (visualizzazione libreria), ma la ricerca OMDb non funzionerà senza key.

### Cartella e file libreria

Per impostazione predefinita la libreria viene salvata nella cartella `BoxOffice` dentro il vault come `libraryStorage.json`. Puoi creare più file (vengono creati come `boxoffice-<timestamp>.json`) e il plugin offre funzioni per creare/caricare/salvare il JSON.

## Uso rapido

1. Clicca l'icona a forma di clapperboard nella ribbon di Obsidian per aprire la vista di BoxOffice.
2. Cerca un titolo nella barra di ricerca.
3. Clicca su un risultato per aprire il dettaglio, quindi usa le azioni per aggiungere, segnarlo come visto o votarlo.

## Struttura del progetto (sintesi)

```
src/
├── main.ts                    # Entrypoint del plugin (lifecycle, settings, view)
├── constants.ts               # Costanti condivise (es. VIEW_TYPE)
├── CineVault.ts               # Logica principale / helper (se presente)
├── services/
│   ├── libraryStorage.ts      # Funzioni per creazione/caricamento/salvataggio JSON
│   └── omdbService.ts         # Wrapper per richieste OMDb (search, details)
├── settings/
│   └── settingsTab.ts         # UI tab delle impostazioni
├── ui/                        # Componenti UI, modali, suggerimenti
└── views/
    └── pluginView.ts          # Vista principale dell'interfaccia
```

Per dettagli tecnici e modelli dati vedi `TECHNICAL.md`.

## Supporto, contributi e licenza

- Contribuzioni benvenute: segui lo stile esistente e aggiorna i tipi TypeScript.
- Bug e richieste: apri un issue nel repository.
- Licenza: MIT — vedi il file `LICENSE`.

---

**Versione**: 1.0.0
**Minimum Obsidian Version**: 0.15.0

**Autore**: Vittorio Scaperrotta — https://vittorioscaperrotta.me/

Se vuoi supportare lo sviluppo: https://ko-fi.com/vittorioscaperrotta
