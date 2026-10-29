# AprobarApp

Aplicación de estudio en Astro para preparar TAI con temarios por PDF y práctica personalizada.

## Estudio y Examen

- Los tests de práctica, oficiales, simulacros y tests a medida usan el mismo motor.
- Estudio corrige al responder; Examen permite cambiar respuestas y corregir al entregar.
- El tiempo y la resta por fallo son configurables para practicar; no sustituyen las reglas de la convocatoria.
- El cronómetro usa una fecha límite persistida y entrega al agotarse, también al volver a una pestaña cerrada.
- Se guarda cada respuesta y cada duda. Los enlaces de Progreso recuperan el intento concreto.
- Los tests oficiales conservan el texto, la numeración, las opciones y las letras de la plantilla. Nunca se mezclan sus opciones.
- Los ejercicios de programación muestran el código también en A medida y en el Cuaderno.

## Progreso y Cuaderno

La portada muestra intentos abiertos, respuestas de hoy, repasos pendientes y tareas del calendario.
Progreso añade evolución, resultados por tema y apartado, historial y copia global.

El Cuaderno reúne fallos, blancos y dudas. Un error se programa al día siguiente; los aciertos sin duda
espacian el repaso a 3, 7, 14 y 30 días. Las dudas siguen pendientes hasta un repaso sin duda.
Tras tres aciertos sin duda en intentos distintos la pregunta sale del repaso de fallos.
Esta planificación es orientativa y no es una medida de dominio del temario.

Los tests nuevos priorizan preguntas menos practicadas. A medida también permite solo no respondidas.
Cada pregunta conserva un identificador estable; cambiar el orden no se cuenta como añadir preguntas.

## Datos y copias

Todo permanece en el navegador. No hay cuentas, servidor de progreso ni sincronización automática.
La copia global de Progreso incluye calendario, resultados antiguos, intentos, respuestas, dudas y ajustes.
Importar valida el archivo, combina intentos por identificador y respuestas por fecha, y no duplica eventos.
Antes de importar se descarga un respaldo del estado actual. Las tareas actuales prevalecen en conflictos
de calendario; un intento terminado prevalece sobre una copia antigua todavía abierta.
Si no se puede completar la escritura, se intenta restaurar el estado anterior.

Se conservan hasta 500 resultados y las diez últimas hojas de respuestas completas.
Los intentos abiertos no se compactan. Las métricas y las preguntas pendientes del Cuaderno se conservan.
Al faltar espacio o bloquearse el almacenamiento se muestra un aviso: Rescatar sesión exporta también
lo que siga en memoria. No cierres la pestaña antes de obtener esa copia.
La versión antigua solo guardaba el último resultado por test; no se inventa un historial previo.

## Comandos

```bash
npm install
npm test
npm run dev
npm run build
npm run build:github
```

Las pruebas que extraen PDFs necesitan `pdftotext` (Poppler).
`dev` y `build` sincronizan los materiales de `../Temario`. `build:github` utiliza los manifiestos existentes.

## Estructura

- `scripts/sync-temario.mjs`: materiales y manifiestos.
- `src/data/topic-overrides.ts`: títulos y enfoques de práctica.
- `src/data/question-banks/`: bancos originales; `scenario-questions.mjs` añade supuestos independientes.
- `src/lib/study-state.mjs`: respuestas, entregas, cuaderno y validación.
- `src/lib/quiz-client.mjs`: interacción compartida.
- `src/lib/progress-backup.mjs`: exportación, validación y combinación de copias.
- `src/pages/progreso/` y `src/pages/cuaderno/`: seguimiento personal.

GitHub Pages se despliega desde `main` con `.github/workflows/deploy-pages.yml`.
