# Cristalli d'Artista

Portfolio e-commerce per una collezione di opere d'arte uniche: bottiglie di liquori in frantumi, composte artisticamente all'interno di una cornice, preservate e sigillate con resina.

## Tecnologie

| Layer | Stack |
|-------|-------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Flask (Python) |
| Database | MongoDB |
| Container | Docker & docker-compose |

## Struttura del progetto

```
sito-web-opere-d-arte/
├── backend/              # API Flask
│   ├── app.py            # Entry point
│   ├── models.py         # Modelli MongoDB
│   ├── routes.py         # Endpoint REST
│   ├── seed.py           # Popola il database
│   └── Dockerfile
├── frontend/             # App React
│   ├── src/
│   │   ├── components/   # Navbar, Hero, Gallery, Shop, Cart, Footer
│   │   ├── contexts/     # LanguageContext (EN/IT)
│   │   └── i18n/         # Traduzioni JSON (en.json, it.json)
│   ├── public/images/    # Metti qui le immagini delle opere
│   └── Dockerfile
└── docker-compose.yml    # Orchestra mongo + backend + frontend
```

## Come eseguire

### Con Docker (consigliato)

```bash
docker-compose up --build
```

- Frontend: `http://localhost`
- Backend API: `http://localhost:5000/api/artworks`

### Sviluppo locale

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python seed.py
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoint

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/artworks` | Lista tutte le opere |
| GET | `/api/artworks/:id` | Dettaglio opera |
| POST | `/api/orders` | Crea un ordine |
| GET | `/api/orders` | Lista ordini |
| PATCH | `/api/orders/:id/status` | Aggiorna stato ordine |

## Aggiungere le immagini

Le opere vengono referenziate nel seed data (`backend/seed.py`) con percorsi come `/images/nome-file.jpeg`. Inserisci i file immagine reali in `frontend/public/images/`.

## Lingue

L'interfaccia supporta **Italiano** e **Inglese**. Il toggle nella navbar commuta all'istante tutte le etichette grazie al `LanguageContext` con traduzioni definite in `frontend/src/i18n/`.
