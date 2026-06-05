# AprobarApp

Aplicación de estudio en Astro para preparar la oposición TAI con temarios por PDF y tests específicos tipo autoescuela.

## Qué hace ahora mismo

- Detecta automáticamente los PDF que metas en `../Temario`.
- Copia esos PDF a `public/temario` durante `dev` y `build`.
- Crea una ficha por tema con resumen, visor PDF y tests asociados.
- Guarda en el navegador el estado visual de cada test:
  - `0` fallos: verde
  - `1-3` fallos: amarillo
  - `>3` fallos: rojo

## Temas ya cargados

- `B1T1` Constitución Española
- `B2T3` Estructuras de datos

## Comandos

```bash
npm install
npm run dev
npm run build
```

Para una build orientada a GitHub Pages:

```bash
npm run build:github
```

## Estructura útil

- `scripts/sync-temario.mjs`: sincroniza PDFs desde `../Temario`.
- `src/data/topic-overrides.ts`: títulos, resúmenes y presets de tests por tema.
- `src/data/question-banks/`: bancos de preguntas base por código de tema.
- `src/pages/temarios/`: páginas de tema y páginas de test.

## Cómo añadir más temario

1. Copia el PDF a la carpeta `Temario` del nivel superior.
2. Arranca `npm run dev` o ejecuta `npm run build`.
3. La app detectará el nuevo PDF y creará su ficha automáticamente.
4. Cuando quieras tests de ese tema, añade su banco de preguntas en `src/data/question-banks/` y enlázalo en `src/data/question-banks/index.ts`.

## Despliegue

Hay un workflow preparado en `.github/workflows/deploy-pages.yml` para publicar la carpeta `App` en GitHub Pages.
