# Nákupní seznam - React aplikace

Aplikace pro správu nákupních seznamů vytvořená v React s React Router.

## Požadavky

- **Node.js**: verze 22.12.0 nebo vyšší
- **npm**: verze 10.9.0 nebo vyšší

Ověření verzí:
```bash
node --version
npm --version
```

## Spuštění aplikace

### Instalace závislostí

```bash
npm install
```

### Spuštění vývojového serveru

```bash
npm run dev
```

Aplikace bude dostupná na `http://localhost:5173`

### Build pro produkci

```bash
npm run build
```

## Struktura projektu

```
src/
├── components/
│   ├── Button.jsx                  # Znovupoužitelná komponenta tlačítka
│   ├── Button.css
│   ├── ShoppingListOverview.jsx    # Přehled všech seznamů
│   ├── ShoppingListOverview.css
│   ├── ShoppingListDetail.jsx      # Detail seznamu s business logikou
│   └── ShoppingListDetail.css
├── data/
│   └── initialData.js              # Počáteční data (konstanty)
├── App.jsx                         # Hlavní komponenta s routingem
├── App.css                         # Globální styly
└── main.jsx                        # Entry point

```

## Technologie

- React 18
- React Router 6
- Vite (build tool)
- CSS3

## Komponenty

### Button
Znovupoužitelná komponenta pro tlačítka s následujícími props:
- `text` - text tlačítka
- `color` - barva tlačítka (primary, success, danger, edit, cancel, filter)
- `action` - funkce volaná při kliknutí
- `type` - typ tlačítka (button, submit)
- `size` - velikost (normal, small, large)
- `disabled` - zakázání tlačítka
- `active` - aktivní stav (pro filter tlačítka)

Příklad použití:
```jsx
<Button
  text="Uložit"
  color="success"
  action={handleSave}
  type="submit"
/>
```

## Přepínání mezi uživateli

Aplikace simuluje přihlášení uživatele. Pro otestování různých oprávnění můžete přepnout přihlášeného uživatele:

1. Otevřete soubor `src/data/initialData.js`
2. Na řádku 42 změňte hodnotu konstanty `CURRENT_USER`:

```javascript
// Dostupní uživatelé:
export const CURRENT_USER = 'user1';  // Jan Novák (vlastník seznamů 1 a 3)
// export const CURRENT_USER = 'user2';  // Marie Svobodová (vlastník seznamu 2)
// export const CURRENT_USER = 'user3';  // Petr Dvořák (člen seznamů 2 a 3)
```

3. Uložte soubor a stránka se automaticky znovu načte (hot reload)

**Tipy pro testování:**
- `user1` (Jan Novák) - může upravovat a mazat seznamy "Týdenní nákup" a "Dovolená"
- `user2` (Marie Svobodová) - může upravovat a mazat seznam "Oslava narozenin"
- `user3` (Petr Dvořák) - nemůže upravovat názvy seznamů, ale může odejít ze seznamů

## Poznámky

- Data jsou uložena v konstantách (reloadem stránky se vrací do výchozího stavu)
- Simulace přihlášeného uživatele (aktuálně: user3 - Petr Dvořák)
- Všechny požadavky ze zadání jsou implementovány
- Všechna tlačítka v aplikaci používají znovupoužitelnou Button komponentu