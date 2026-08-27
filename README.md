# Confronta Prezzi v1

Questa è la ripartenza pulita del progetto.

## Scelta tecnica

Abbiamo eliminato Next.js per l'MVP.

Stack:
- React
- Vite
- Supabase
- Vercel
- GitHub

Tutto utilizzabile con piani gratuiti per la fase iniziale.

## Perché questa versione evita i problemi precedenti

NON usa:
- Server Components
- Client Components di Next.js
- Server Actions
- API Routes
- alias di import
- `use server`
- `NEXT_PUBLIC_...`

Quindi vengono eliminati alla radice gli errori che avevamo incontrato.

## Funzioni già incluse

- Home responsive
- Ricerca per nome e marca
- Filtro categorie
- Elettronica e abbigliamento
- Prezzo totale = prodotto + spedizione
- Evidenziazione della migliore offerta
- Confronto reso
- Confronto garanzia
- Confronto spedizione
- Disponibilità
- Link diretto al sito del negozio
- Tracking dei click
- Modalità demo se Supabase non è ancora configurato
- Database protetto con Row Level Security
- I visitatori NON possono leggere la tabella dei click

## PASSO 1 - GitHub

Crea un repository nuovo, ad esempio:

`confronta-prezzi-v1`

Carica tutto il CONTENUTO di questa cartella.

Nella home del repository devi vedere direttamente:
- src
- sql
- data
- index.html
- package.json
- vite.config.js
- README.md

## PASSO 2 - Supabase

Apri:
Supabase → progetto → SQL Editor

Esegui nell'ordine:

1. `sql/01_schema.sql`
2. `sql/02_demo_data.sql`

## PASSO 3 - Vercel

Importa il nuovo repository GitHub.

Vercel dovrebbe riconoscere automaticamente Vite.

Se te lo chiede:

Build Command:
`npm run build`

Output Directory:
`dist`

## PASSO 4 - Variabili Vercel

In Vercel → Project → Settings → Environment Variables

Crea:

`VITE_SUPABASE_URL`

Valore:
il Project URL di Supabase.

Poi:

`VITE_SUPABASE_ANON_KEY`

Valore:
la chiave anon/public di Supabase.

IMPORTANTE:
questa nuova versione NON usa più i vecchi nomi `NEXT_PUBLIC_...`.

Dopo averle salvate fai un nuovo Deploy.

## PASSO 5 - Test

Controlla:
1. la Home;
2. ricerca;
3. filtro categoria;
4. pulsante Confronta;
5. migliore offerta;
6. reso/garanzia/spedizione;
7. Vai al negozio.

## Aggiungere dati in futuro

Per ora il modo più semplice è usare il Table Editor di Supabase.

Nella cartella `data` trovi anche file CSV di esempio.
