# Shopping List Backend API

Backend aplikace pro správu nákupních seznamů vytvořená pomocí Node.js a Express.js s MongoDB databází.

## Požadavky

- **Node.js**: verze 22.12.0 nebo vyšší
- **npm**: verze 10.9.0 nebo vyšší
- **Docker a Docker Compose**: pro spuštění MongoDB (doporučeno)

Ověření verzí:
```bash
node --version
npm --version
docker --version
docker-compose --version
```

## Instalace a spuštění

### 1. Nainstalujte závislosti

```bash
cd backend
npm install
```

### 2. Spusťte MongoDB pomocí Docker Compose

Docker Compose automaticky nastartuje MongoDB i Mongo Express (webové rozhraní pro správu databáze).

```bash
docker-compose up -d
```

Služby:
- **MongoDB**: běží na `localhost:27017`
- **Mongo Express**: dostupné na `http://localhost:8081` (username: `admin`, password: `admin123`)

### 3. Zkopírujte a upravte environment variables

```bash
cp .env.example .env
```

Soubor `.env` je již přednastavený pro lokální vývoj s Docker Compose:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin123@localhost:27017/shopping_list?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### 4. Naplňte databázi dummy daty

Backend obsahuje seed script, který naplní databázi testovacími uživateli a nákupními seznamy:

```bash
npm run seed
```

Po spuštění seed scriptu budou v databázi:
- **3 testovací uživatelé** (všichni s heslem `password123`)
- **4 nákupní seznamy**
- **17 položek** v různých seznamech

### 5. Spusťte server

Pro development režim s auto-reloadem:
```bash
npm run dev
```

Pro produkční režim:
```bash
npm start
```

Server poběží na `http://localhost:3000`

## Rychlý start (vše najednou)

```bash
# 1. Nainstalujte závislosti
npm install

# 2. Spusťte MongoDB
docker-compose up -d

# 3. Počkejte pár sekund, než se MongoDB nastartuje
sleep 5

# 4. Naplňte databázi dummy daty
npm run seed

# 5. Spusťte server
npm run dev
```

## Testovací uživatelé

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

## Nákupní seznamy (po seedu)

1. **Weekly Groceries** (Owner: John, Member: Jane) - 5 položek
2. **Birthday Party Supplies** (Owner: Jane, Members: John, Bob) - 6 položek
3. **Home Improvement** (Owner: Bob) - 4 položky
4. **Old Shopping List** (Owner: John, Archived) - 2 položky

