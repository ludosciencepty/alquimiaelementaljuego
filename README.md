# ⚗️ Compound TCG

Juego de cartas coleccionables con temática química. Construye tu grimorio, invoca compuestos y domina los elementos.

---

## 🚀 Publicar en GitHub Pages

### Paso 1 — Crea el repositorio

1. Ve a [github.com](https://github.com) → **New repository**
2. Nombre del repo: `compound-tcg` (o el que quieras)
3. Visibilidad: **Public** ← obligatorio para GitHub Pages gratis
4. **NO** marques "Initialize repository"
5. Clic en **Create repository**

### Paso 2 — Ajusta el nombre del repo en vite.config.js

Abre `vite.config.js` y cambia la línea `base`:

```js
// Si tu repo se llama "compound-tcg":
base: '/compound-tcg/',

// Si se llama "mi-juego-quimico":
base: '/mi-juego-quimico/',
```

> ⚠️ Debe coincidir **exactamente** con el nombre de tu repositorio en GitHub.

### Paso 3 — Sube el proyecto

```bash
cd compound-tcg
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/compound-tcg.git
git push -u origin main
```

### Paso 4 — Activa GitHub Pages

1. En tu repo → **Settings** → **Pages**
2. En **Source** selecciona: **GitHub Actions**
3. Guarda

### Paso 5 — El deploy es automático

Cada vez que hagas `git push` a `main`, el workflow en `.github/workflows/deploy.yml` construye y publica automáticamente.

Tu juego estará en: `https://TU_USUARIO.github.io/compound-tcg/`

---

## 📁 Estructura de archivos

```
compound-tcg/
├── public/
│   ├── personajes.csv       ← tus cartas (elementos, funciones, compuestos)
│   ├── especiales.csv       ← acciones y herramientas
│   ├── energias.csv         ← cartas de energía
│   ├── cards/               ← imágenes de las cartas (.webp, .png, .jpg)
│   │   ├── Metilo.webp
│   │   ├── image-mw49n-9LGuhx-ao97ACTj.webp
│   │   └── ...
│   └── estado/              ← íconos de estado de materia
│       ├── Gaseoso Oficial.png
│       ├── Sólido Oficial.png
│       ├── Líquido Oficial.png
│       ├── Acuoso Oficial.png
│       ├── Gaseoso.png
│       ├── Sólido.png
│       ├── Líquido.png
│       └── Acuoso.png
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── Card.jsx          ← componente de carta (layout exacto)
│   │   ├── CoinFlip.jsx      ← volado del destino
│   │   └── GameBoard.jsx     ← tablero de batalla
│   ├── pages/
│   │   ├── MainMenu.jsx
│   │   ├── DeckBuilder.jsx
│   │   └── DeckSelector.jsx
│   └── utils/
│       ├── cardUtils.js      ← carga CSV, lógica de invocación
│       └── gameEngine.js     ← motor del juego
├── .github/workflows/
│   └── deploy.yml           ← auto-deploy a GitHub Pages
├── vite.config.js           ← ⚠️ cambia base: '/tu-repo/'
├── package.json
└── index.html
```

---

## 🖥️ Desarrollo local

```bash
npm install
npm run dev
# Abre http://localhost:5173
```

---

## ⚗️ Reglas rápidas

| Acción | Descripción |
|--------|-------------|
| Elementos/Funciones | Se colocan directamente al campo |
| Compuestos/Mezclas | **Solo** se pueden invocar teniendo los elementos requeridos en campo o mano |
| Energías | Se colocan en zona de energías, se tapean para pagar costes |
| Daño | ATK > DEF → carta dañada (horizontal) |
| Destrucción | Carta ya dañada recibe mismo tipo de daño → descartada (+1 sello) |
| Victoria | 5 sellos, o el grimorio del rival queda vacío |
