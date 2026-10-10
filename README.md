# CANVAULT

La mia collezione personale di lattine Monster, iniziata il 1° aprile 2018. Chi visita il sito può sfogliarla; solo io, dopo l'accesso, do un voto da 1 a 10 a ogni lattina.

## Avvio

```bash
npm install
npm run dev
```

- Sito: http://localhost:5173
- API: http://localhost:3001 (Vite inoltra già `/api` all'API)

Serve Node 22.13 o successivo, perché il database usa il modulo `node:sqlite` incluso in Node.

Per la versione di produzione: `npm run build && npm start`. In questo caso un solo server su http://localhost:3001 serve sia il sito sia l'API.

## Account

C'è un solo account, il proprietario, creato al primo avvio con `ADMIN_EMAIL` e `ADMIN_PASSWORD`. In locale, se non le imposti, vengono usate le credenziali di sviluppo scritte in `server/db.js`; in produzione sono obbligatorie (password di almeno 12 caratteri). Si entra da "Area riservata" in fondo alla pagina (`/accedi`). Non c'è registrazione.

## Pubblicazione

Il sito gira come un unico servizio Node che serve sia le pagine sia l'API, e ha bisogno di un disco permanente per il database. `render.yaml` lo configura su Render:

1. Su Render: New → Blueprint, e scegli questo repository.
2. Inserisci `ADMIN_EMAIL` e `ADMIN_PASSWORD` quando li chiede.
3. Il database sta sul disco montato in `/var/data` (variabile `DATA_DIR`), quindi voti e sessioni restano tra un deploy e l'altro.

Su un altro host Node basta: build `npm ci && npm run build`, avvio `npm start`, Node 22.13 o successivo, `DATA_DIR` puntata a un disco permanente.

Le foto dei retro vengono da [Open Food Facts](https://world.openfoodfacts.org) (CC BY-SA); il credito è nel footer.

## Come funziona

**Frontend** (`src/`): React 19 e React Router.
- `pages/`: Home, Collezione (ricerca, filtro per linea, ordinamento), scheda della lattina con il mio voto, la mia Classifica, Accesso.
- `lib/`: client delle API, contesto di autenticazione, colori di ogni linea.

**Backend** (`server/`): Hono su Node.
- Database SQLite in `server/data/canvault.db` (o in `DATA_DIR`), sincronizzato con `db.json` a ogni avvio: le lattine nuove vengono aggiunte, voti e utenti restano.
- Le password sono cifrate con scrypt.
- La sessione usa un cookie httpOnly; sul server è salvato solo l'hash del token.
- Solo il proprietario può votare: un voto per lattina, che può cambiare o togliere.

| Metodo | Endpoint | |
|---|---|---|
| POST | `/api/auth/login` · `/logout` | accesso del proprietario |
| GET | `/api/auth/me` | utente corrente |
| GET | `/api/cans` · `/api/cans/:id` | lattine con il mio voto |
| PUT / DELETE | `/api/cans/:id/vote` | do o tolgo il voto (1–10), solo proprietario |

Per ripartire da zero basta cancellare `server/data/`.
