# Cristalli d'Artista

Portfolio e-commerce per una collezione di opere d'arte uniche: bottiglie di liquori in frantumi, composte artisticamente all'interno di una cornice, preservate e sigillate con resina. Ogni opera ha prezzo fisso di **100€**.

## Tecnologie

| Layer | Stack |
|-------|-------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Flask (Python) |
| Database | MongoDB (produzione) / In-memory (preview) |
| Container | Docker & docker-compose |

## Struttura del progetto

```
sito-web-opere-d-arte/
├── backend/
│   ├── preview_app.py      # Server di preview con dati in memoria
│   ├── app.py               # Entry point produzione (MongoDB)
│   ├── models.py            # Modelli MongoDB
│   ├── routes.py            # Endpoint REST produzione
│   ├── seed.py              # Popola il database
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Navbar con link Login dinamico
│   │   │   ├── Hero.jsx       # Sezione hero
│   │   │   ├── Gallery.jsx    # Portfolio puro (no acquisti)
│   │   │   ├── Shop.jsx       # Negozio con pulsante Buy Now
│   │   │   ├── Cart.jsx       # Carrello con checkout e spedizione
│   │   │   ├── UserPanel.jsx  # Login, registrazione, ordini
│   │   │   ├── AdminPanel.jsx # Pannello admin (CRUD opere)
│   │   │   ├── Footer.jsx
│   │   │   └── LanguageSwitcher.jsx
│   │   ├── contexts/
│   │   │   └── LanguageContext.jsx  # Toggle EN/IT
│   │   └── i18n/
│   │       ├── en.json
│   │       └── it.json
│   ├── public/images/       # Immagini delle opere
│   └── Dockerfile
└── docker-compose.yml
```

## Come eseguire

### Preview locale (consigliata per sviluppo)

**Backend (API + frontend servito insieme):**
```bash
cd backend
pip install -r requirements.txt
python preview_app.py
```
Apri `http://localhost:5000` nel browser. Il backend serve sia l'API che i file statici del frontend.

### Preview separata (solo backend API + frontend dev)

Avvia backend:
```bash
cd backend
pip install -r requirements.txt
python preview_app.py
```

In un altro terminale, avvia frontend con hot-reload:
```bash
cd frontend
npm install
npm run dev
```
Frontend su `http://localhost:5173`, backend su `http://localhost:5000`.

### Docker (produzione)

```bash
docker-compose up --build
```
Frontend su `http://localhost`, backend API su `http://localhost:5000`.

## API Endpoint

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/artworks` | Lista tutte le opere |
| GET | `/api/artworks/:id` | Dettaglio opera |
| PATCH | `/api/artworks/:id/sell` | Segna opera come venduta |
| POST | `/api/orders` | Crea un ordine |
| GET | `/api/orders` | Lista ordini |
| GET | `/api/orders/user/:user_id` | Ordini di un utente |
| PATCH | `/api/orders/:id/status` | Aggiorna stato ordine |
| POST | `/api/users/register` | Registrazione utente |
| POST | `/api/users/login` | Login utente |
| POST | `/api/admin/login` | Login admin |
| POST | `/api/admin/artworks` | Aggiungi opera (admin) |
| DELETE | `/api/admin/artworks/:id` | Rimuovi opera (admin) |

## Funzionalità

### Galleria
- Portfolio visivo senza pulsanti di acquisto
- Overlay "Sold" sulle opere vendute
- Placeholder gradient per immagini mancanti

### Negozio
- Elenco opere disponibili con prezzo fisso (100€)
- Pulsante "Buy Now" per aggiungere al carrello
- Opere già nel carrello evidenziate

### Carrello e Checkout
- Riepilogo articoli prima dell'acquisto
- Spedizione Standard (6,90€) o Express (12,90€)
- Tempi di consegna in giorni lavorativi (localizzati)
- Modulo di spedizione con auto-compilazione dai dati utente loggato
- Prezzi con simbolo € dopo il numero (es. 100€)

### Account Utente
- Registrazione con nome, cognome, indirizzo, username, password
- Login persistente (localStorage)
- Dashboard con cronologia ordini
- I dati utente vengono auto-inseriti nel form di checkout

### Pannello Admin
- Accesso con credenziali `admin` / `password` dalla schermata di login
- Aggiunta nuove opere con titolo (EN/IT), descrizione (EN/IT), prezzo, immagine, categoria
- Rimozione opere esistenti
- Le modifiche si riflettono subito in galleria e negozio

### Lingue
- Toggle Italiano / Inglese nella navbar
- Traduzioni complete per tutte le sezioni
- Persiste la preferenza di lingua

## Aggiungere le immagini

Le opere vengono referenziate con percorsi come `/images/nome-file.jpeg`. Inserisci i file immagine reali in `frontend/public/images/`.

Nella preview con `preview_app.py`, le immagini vengono servite dalla cartella `frontend/dist/images/`. Dopo aver aggiunto le immagini, esegui `npm run build` nella cartella `frontend/` per copiarle nel `dist`.
