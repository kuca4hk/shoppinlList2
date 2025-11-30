# Nákupní seznam - React aplikace

Moderní webová aplikace pro správu nákupních seznamů vytvořená v React s autentizací a real-time synchronizací přes REST API.

## Požadavky

- **Node.js**: verze 22.12.0 nebo vyšší
- **npm**: verze 10.9.0 nebo vyšší
- **Docker a Docker Compose**: pro spuštění backendu (MongoDB)

Ověření verzí:
```bash
node --version
npm --version
```

## Struktura projektu

Projekt se skládá ze dvou částí:
```
shoppinlList2/
├── backend/           # Backend API (Express.js + MongoDB)
├── src/              # Frontend (React + Vite)
├── package.json      # Frontend dependencies
└── README.md         # Tento soubor
```

## Kompletní instalace a spuštění

### 1. Spuštění backendu (API + databáze)

**Backend je nezbytný pro běh aplikace!** Frontend se na něj připojuje přes API.

```bash
# Přejděte do složky backend
cd backend

# Nainstalujte závislosti
npm install

# Spusťte MongoDB v Dockeru
docker-compose up -d

# Počkejte pár sekund, než se MongoDB nastartuje
sleep 5

# Naplňte databázi testovacími daty
npm run seed

# Spusťte backend server (běží na http://localhost:3000)
npm run dev
```

Backend nyní běží na `http://localhost:3000` a je připravený přijímat požadavky z frontendu.

**Poznámka:** Podrobné informace o backendu najdete v `backend/README.md`

### 2. Spuštění frontendu (React aplikace)

Otevřete **nový terminál** (backend musí stále běžet) a spusťte:

```bash
# Vraťte se do root složky projektu
cd ..

# Nainstalujte frontend závislosti
npm install

# Spusťte vývojový server (běží na http://localhost:5173)
npm run dev
```

Aplikace bude dostupná na `http://localhost:5173`

## Rychlý start (vše najednou)

Pro pohodlné spuštění celého projektu můžete použít dva terminály:

**Terminál 1 - Backend:**
```bash
cd backend && npm install && docker-compose up -d && sleep 5 && npm run seed && npm run dev
```

**Terminál 2 - Frontend:**
```bash
npm install && npm run dev
```

## Testovací přihlašovací údaje

Po naplnění databáze (`npm run seed` v backend složce) můžete použít tyto testovací účty:

Všichni uživatelé mají heslo: `password123`

1. **John Doe** - `john@example.com`
   - Vlastník seznamů: Weekly Groceries, Old Shopping List
   - Člen seznamu: Birthday Party Supplies

2. **Jane Smith** - `jane@example.com`
   - Vlastník seznamu: Birthday Party Supplies
   - Člen seznamu: Weekly Groceries

3. **Bob Johnson** - `bob@example.com`
   - Vlastník seznamu: Home Improvement
   - Člen seznamu: Birthday Party Supplies
