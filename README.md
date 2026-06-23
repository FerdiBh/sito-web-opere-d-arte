# Cristalli d'Artista

Portfolio e-commerce per una collezione di opere d'arte uniche: bottiglie di liquori in frantumi, composte artisticamente all'interno di una cornice, preservate e sigillate con resina. Ogni opera ha prezzo fisso di **100€**.

## Tecnologie

| Layer | Stack |
|-------|-------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Flask (Python) |
| Database | MongoDB (produzione) / In-memory (preview) |
| Container | Docker & docker-compose |

## Architettura

```
sito-web-opere-d-arte/
├── backend/
│   ├── preview_app.py      # Server preview — dati in memoria, nessun DB richiesto
│   ├── app.py               # Entry point produzione con MongoDB
│   ├── models.py            # Modelli MongoDB (Artwork, Order, User)
│   ├── routes.py            # Endpoint REST per produzione
│   ├── seed.py              # Popola MongoDB con dati iniziali
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigazione fissa con link Login dinamico
│   │   │   ├── Hero.jsx         # Sezione hero con CTA
│   │   │   ├── Gallery.jsx      # Portfolio puro — solo anteprime e stato venduto
│   │   │   ├── Shop.jsx         # Vetrina acquisti con pulsante Buy Now
│   │   │   ├── Cart.jsx         # Carrello con modulo spedizione e riepilogo ordine
│   │   │   ├── UserPanel.jsx    # Login, registrazione, cronologia ordini
│   │   │   ├── AdminPanel.jsx   # CRUD opere (solo admin)
│   │   │   ├── Footer.jsx
│   │   │   └── LanguageSwitcher.jsx
│   │   ├── contexts/
│   │   │   └── LanguageContext.jsx  # Gestione stato lingua (IT/EN)
│   │   └── i18n/
│   │       ├── en.json
│   │       └── it.json
│   ├── public/images/       # Immagini delle opere (collegate dal seed data)
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Componenti del frontend

### App.jsx (root)
- Gestisce lo stato globale: carrello, utente loggato, navigazione tra sezioni
- Persiste l'utente in `localStorage` per sessioni successive
- Passa `user` a Navbar, Cart e UserPanel per auto-compilazione dati

### Gallery
- Sezione portfolio: mostra tutte le opere in una griglia responsive
- Nessun pulsante d'acquisto — solo anteprime visive
- Overlay "Sold" per opere non più disponibili

### Shop
- Elenco opere acquistabili con prezzo (100€), descrizione e categoria
- Pulsante "Buy Now" per aggiungere al carrello
- Le opere già nel carrello vengono evidenziate

### Cart
- Riepilogo articoli, costi di spedizione e totale
- **Spedizione**: Standard 6,90€ (5-7 giorni lavorativi) / Express 12,90€ (2-3 giorni)
- Modulo con auto-compilazione dai dati utente loggato
- Etichette localizzate: "Nome e Cognome", "Indirizzo e Numero Civico"
- Tempi di consegna in "giorni lavorativi" in italiano, "business days" in inglese

### UserPanel
- Schermata di login/registrazione
- Registrazione: nome, cognome, indirizzo, username, password
- Dashboard personale con cronologia ordini
- Accesso admin tramite credenziali dedicate

### AdminPanel
- CRUD completo sulle opere
- Aggiunta con titolo e descrizione bilingue (IT/EN)
- Rimozione con conferma
- Accesso riservato con autenticazione separata

## Backend (preview_app.py)

Server Flask in-memory con tutti i dati necessari per lo sviluppo:
- **6 opere** precaricate con dati bilingue, tutte a 100€
- Gestione utenti: registrazione, login, profilo
- Gestione ordini: creazione, lettura, associazione utente
- Amministrazione: login admin, CRUD opere
- Il frontend buildato viene servito come static files dallo stesso server

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
| POST | `/api/users/login` | Login utente, restituisce profilo (senza password) |
| POST | `/api/admin/login` | Login admin |
| POST | `/api/admin/artworks` | Aggiungi opera (admin) |
| DELETE | `/api/admin/artworks/:id` | Rimuovi opera (admin) |

## Dati

### Opera
```
{
  id: string,
  title: { en: string, it: string },
  description: { en: string, it: string },
  price: number (100),
  image: string (percorso relativo),
  category: string,
  available: boolean
}
```

### Utente
```
{
  id: string,
  username: string,
  password: string (solo in memoria, mai esposta),
  name: string,
  surname: string,
  address: string
}
```

### Ordine
```
{
  id: string,
  status: string,
  items: [{ artwork_id, title, price }],
  total: number,
  shipping: { name, surname, address, city, postal, country, shipping, notes },
  user_id: string | null,
  language: string
}
```

## Localizzazione

L'intero sito supporta Italiano e Inglese. Il toggle nella navbar commuta istantaneamente tutte le etichette. Le traduzioni sono definite in file JSON separati (`en.json`, `it.json`) e caricate tramite `LanguageContext`. La preferenza lingua è persistente.

## Immagini

Le opere referenziano immagini con percorsi come `/images/nome-file.jpeg`. I file vanno inseriti in `frontend/public/images/`. Per la preview, dopo aver aggiunto le immagini, esegui `npm run build` in `frontend/` per copiarle nella cartella `dist/`.
