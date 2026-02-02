# Guida all'avvio del sito

## Prerequisiti

- **Node.js** (versione 18 o superiore)
- **npm** (incluso con Node.js)

## Installazione

1. Entra nella cartella del progetto:
   ```bash
   cd frontEndExam/frontEndExam
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

## Avvio

### Avvio completo (frontend + backend)

Avvia sia il frontend React che il server JSON con un solo comando:

```bash
npm run start
```

Questo comando avvia in parallelo:
- **Frontend Vite**: http://localhost:5173
- **JSON Server (API)**: http://localhost:3001

### Avvio separato

Se preferisci avviare i servizi separatamente, apri due terminali:

**Terminale 1 - Backend (JSON Server):**
```bash
npm run server
```
API disponibile su http://localhost:3001

**Terminale 2 - Frontend (Vite):**
```bash
npm run dev
```
Sito disponibile su http://localhost:5173

## Altri comandi utili

| Comando | Descrizione |
|---------|-------------|
| `npm run build` | Crea la build di produzione |
| `npm run preview` | Anteprima della build di produzione |
| `npm run lint` | Esegue il linting del codice |

## Credenziali di test

**Admin:**
- Email: `admin@monster.it`
- Password: `admin123`

**Utente normale:**
- Registra un nuovo account dalla pagina di registrazione
