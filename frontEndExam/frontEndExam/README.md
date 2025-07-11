# Monster Energy Collection 🥤⚡

Una web app React per gestire e visualizzare la mia personale collezione di monster

## 🚀 Funzionalità Principali

- **Catalogo Completo**: Visualizza oltre 66 lattine con filtri avanzati
- **Sistema di Autenticazione**: Login/Registrazione con ruoli utente e admin
- **Admin Panel**: Gestione CRUD completa delle lattine (solo admin)
- **Recensioni e Rating**: Sistema completo di valutazione prodotti
- **Newsletter**: Iscrizione con preferenze personalizzate
- **Carosello Interattivo**: Homepage con slider automatico delle lattine
- **Timer Collezione**: Conta il tempo dall'inizio della collezione (1 aprile 2018)

## 🛠️ Tecnologie Utilizzate

- **React** 19.1.0 - Framework UI
- **Redux** + **Redux Thunk** - State management
- **React Router DOM** - Routing SPA
- **JSON Server** - Mock REST API
- **React Slick** - Carosello componenti
- **CSS3** - Styling con animazioni custom

## 👤 Credenziali di Test

**Admin:**
- Email: `admin@monster.it`
- Password: `admin123`

**Utente normale:**
- Registra un nuovo account dalla pagina di registrazione

## 📱 Pagine Principali

1. **Home** (`/`) - Dashboard con carosello e timer
2. **Prodotti** (`/prodotti`) - Catalogo completo con filtri
3. **Dettaglio Lattina** (`/cans/:id`) - Info dettagliate, commenti e rating
4. **Promozioni** (`/promo`) - Offerte e newsletter
5. **Recensioni** (`/recensioni`) - Sistema recensioni utenti
6. **Contatti** (`/contatti`) - Form di contatto validato
7. **Admin Panel** (`/admin`) - Gestione lattine (solo admin)

## 🎨 Features Speciali

- **Design Monster Energy**: Tema nero/verde con animazioni
- **Responsive Design**: Ottimizzato per mobile/tablet/desktop
- **Filtri Avanzati**: Per categoria, anno, paese e ricerca testuale
- **Paginazione**: Per gestire grandi quantità di dati
- **Validazione Form**: In tempo reale con feedback visivo
- **Protected Routes**: Accesso limitato per ruolo utente

## 📂 Struttura Progetto

```
monster-energy-collection/
├── src/
│   ├── components/          # Componenti riutilizzabili
│   ├── pages/              # Pagine dell'app
│   ├── redux/              # Store, actions, reducers
│   │   ├── actions/
│   │   ├── reducers/
│   │   └── store.js
│   ├── assets/             # Immagini e risorse
│   └── App.jsx             # Componente principale
├── public/
│   └── lattine/            # Immagini delle lattine
├── db.json                 # Database JSON Server
└── package.json
```

## 🔐 Sicurezza

- Autenticazione simulata con token fittizi
- Protezione route basata su ruoli
- Validazione input lato client


**Nota**: Questo progetto è stato sviluppato a scopo educativo e non è affiliato con Monster Energy Company.