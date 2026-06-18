import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDir, "..");
const outputDir = resolve(appRoot, "public", "esquemas");

mkdirSync(outputDir, { recursive: true });

const headingFont = "Georgia, 'Times New Roman', serif";
const bodyFont = "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const baseColors = {
  bg: "#f7f4ee",
  paper: "#fffdf8",
  ink: "#172033",
  muted: "#5b667a",
  line: "#d8d2c4",
};

const accents = {
  emerald: { strong: "#1f6f5f", soft: "#dff1ea", border: "#add5c7" },
  coral: { strong: "#9c4d44", soft: "#f7e0db", border: "#e8beb6" },
  amber: { strong: "#9a6515", soft: "#f8e8c9", border: "#e7c982" },
};

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) {
        lines.push(current);
      }
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function renderLineText({ x, y, lines, fontSize = 20, lineHeight = 28, fill = baseColors.ink, fontWeight = 500 }) {
  return `
    <text x="${x}" y="${y}" fill="${fill}" font-family="${bodyFont}" font-size="${fontSize}" font-weight="${fontWeight}">
      ${lines
        .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
        .join("")}
    </text>
  `;
}

function renderBullets({
  x,
  y,
  items,
  maxChars = 44,
  fontSize = 19,
  lineHeight = 27,
  bulletGap = 24,
  fill = baseColors.ink,
  bulletColor = baseColors.ink,
}) {
  let cursorY = y;
  const chunks = [];

  for (const item of items) {
    const wrapped = wrapText(item, maxChars);
    chunks.push(`<circle cx="${x + 7}" cy="${cursorY - 7}" r="5.2" fill="${bulletColor}" />`);
    chunks.push(
      renderLineText({
        x: x + bulletGap,
        y: cursorY,
        lines: wrapped,
        fontSize,
        lineHeight,
        fill,
      }),
    );
    cursorY += wrapped.length * lineHeight + 18;
  }

  return { svg: chunks.join("\n"), bottomY: cursorY };
}

function card({
  x,
  y,
  w,
  h,
  accent,
  eyebrow,
  title,
  items = [],
  note = "",
  maxChars = 44,
  customSvg = "",
}) {
  const palette = accents[accent];
  const noteLines = note ? wrapText(note, maxChars + 4) : [];
  const notesSvg =
    noteLines.length > 0
      ? renderLineText({
          x: x + 34,
          y: y + 118,
          lines: noteLines,
          fontSize: 18,
          lineHeight: 25,
          fill: baseColors.muted,
          fontWeight: 500,
        })
      : "";
  const bulletsStartY = noteLines.length > 0 ? y + 118 + noteLines.length * 25 + 24 : y + 118;
  const bullets = renderBullets({
    x: x + 34,
    y: bulletsStartY,
    items,
    maxChars,
    bulletColor: palette.strong,
  });

  return `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="28" fill="${baseColors.paper}" stroke="${palette.border}" stroke-width="2" />
      <rect x="${x}" y="${y}" width="${w}" height="16" rx="28" fill="${palette.soft}" />
      <text x="${x + 34}" y="${y + 46}" fill="${palette.strong}" font-family="${bodyFont}" font-size="17" font-weight="800" letter-spacing="3.5">${escapeXml(
        eyebrow.toUpperCase(),
      )}</text>
      <text x="${x + 34}" y="${y + 84}" fill="${baseColors.ink}" font-family="${headingFont}" font-size="34" font-weight="700">${escapeXml(
        title,
      )}</text>
      ${notesSvg}
      ${bullets.svg}
      ${customSvg}
    </g>
  `;
}

function hero({ code, title, subtitle, accent, height = 150 }) {
  const palette = accents[accent];
  return `
    <g>
      <rect x="56" y="54" width="1488" height="${height}" rx="34" fill="${baseColors.paper}" stroke="${baseColors.line}" stroke-width="2" />
      <rect x="56" y="54" width="18" height="${height}" rx="34" fill="${palette.strong}" />
      <text x="102" y="104" fill="${palette.strong}" font-family="${bodyFont}" font-size="20" font-weight="800" letter-spacing="4">${escapeXml(
        code,
      )}</text>
      <text x="102" y="154" fill="${baseColors.ink}" font-family="${headingFont}" font-size="52" font-weight="700">${escapeXml(
        title,
      )}</text>
      <text x="102" y="190" fill="${baseColors.muted}" font-family="${bodyFont}" font-size="24" font-weight="500">${escapeXml(
        subtitle,
      )}</text>
    </g>
  `;
}

function timelineCard({ x, y, w, h, accent, title, subtitle, items }) {
  const palette = accents[accent];
  const spacing = (w - 140) / (items.length - 1);
  const nodes = items
    .map((item, index) => {
      const nodeX = x + 70 + spacing * index;
      return `
        ${index < items.length - 1 ? `<line x1="${nodeX}" y1="${y + 128}" x2="${nodeX + spacing}" y2="${y + 128}" stroke="${palette.border}" stroke-width="6" />` : ""}
        <circle cx="${nodeX}" cy="${y + 128}" r="22" fill="${palette.strong}" />
        <text x="${nodeX}" y="${y + 135}" text-anchor="middle" fill="#ffffff" font-family="${bodyFont}" font-size="16" font-weight="800">${index + 1}</text>
        <text x="${nodeX}" y="${y + 182}" text-anchor="middle" fill="${palette.strong}" font-family="${bodyFont}" font-size="18" font-weight="800">${escapeXml(
          item.date,
        )}</text>
        <text x="${nodeX}" y="${y + 214}" text-anchor="middle" fill="${baseColors.ink}" font-family="${bodyFont}" font-size="18" font-weight="600">
          ${wrapText(item.label, 18)
            .map((line, lineIndex) => `<tspan x="${nodeX}" dy="${lineIndex === 0 ? 0 : 22}">${escapeXml(line)}</tspan>`)
            .join("")}
        </text>
      `;
    })
    .join("");

  return `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="30" fill="${baseColors.paper}" stroke="${palette.border}" stroke-width="2" />
      <text x="${x + 34}" y="${y + 48}" fill="${palette.strong}" font-family="${bodyFont}" font-size="17" font-weight="800" letter-spacing="3.5">CRONOLOGÍA CLAVE</text>
      <text x="${x + 34}" y="${y + 88}" fill="${baseColors.ink}" font-family="${headingFont}" font-size="34" font-weight="700">${escapeXml(
        title,
      )}</text>
      <text x="${x + 34}" y="${y + 120}" fill="${baseColors.muted}" font-family="${bodyFont}" font-size="20" font-weight="500">${escapeXml(
        subtitle,
      )}</text>
      ${nodes}
    </g>
  `;
}

function flowBanner({ x, y, w, h, accent, title, items }) {
  const palette = accents[accent];
  const segmentWidth = (w - 120) / items.length;
  const blocks = items
    .map((label, index) => {
      const blockX = x + 40 + segmentWidth * index;
      return `
        <rect x="${blockX}" y="${y + 86}" width="${segmentWidth - 18}" height="84" rx="20" fill="${index % 2 === 0 ? palette.soft : "#f0ece2"}" stroke="${palette.border}" stroke-width="2" />
        <text x="${blockX + (segmentWidth - 18) / 2}" y="${y + 122}" text-anchor="middle" fill="${baseColors.ink}" font-family="${bodyFont}" font-size="19" font-weight="800">
          ${wrapText(label, 17)
            .map((line, lineIndex) => `<tspan x="${blockX + (segmentWidth - 18) / 2}" dy="${lineIndex === 0 ? 0 : 22}">${escapeXml(line)}</tspan>`)
            .join("")}
        </text>
        ${
          index < items.length - 1
            ? `<path d="M ${blockX + segmentWidth - 6} ${y + 128} L ${blockX + segmentWidth + 16} ${y + 128}" stroke="${palette.strong}" stroke-width="5" stroke-linecap="round" />
               <path d="M ${blockX + segmentWidth + 4} ${y + 116} L ${blockX + segmentWidth + 18} ${y + 128} L ${blockX + segmentWidth + 4} ${y + 140}" fill="none" stroke="${palette.strong}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />`
            : ""
        }
      `;
    })
    .join("");

  return `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="30" fill="${baseColors.paper}" stroke="${palette.border}" stroke-width="2" />
      <text x="${x + 34}" y="${y + 48}" fill="${palette.strong}" font-family="${bodyFont}" font-size="17" font-weight="800" letter-spacing="3.5">FLUJO DE ESTUDIO</text>
      <text x="${x + 34}" y="${y + 86}" fill="${baseColors.ink}" font-family="${headingFont}" font-size="34" font-weight="700">${escapeXml(
        title,
      )}</text>
      ${blocks}
    </g>
  `;
}

function scaffold({ width, height, body }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title>Esquema visual de estudio</title>
  <desc>Esquema resumido para copiar en cuaderno y repasar rápidamente.</desc>
  <rect width="${width}" height="${height}" fill="${baseColors.bg}" />
  ${body}
</svg>
`;
}

function renderB1() {
  return scaffold({
    width: 1600,
    height: 2310,
    body: `
      ${hero({
        code: "B1T1",
        title: "Constitución Española de 1978",
        subtitle: "Estructura, derechos, garantías y Corona en un mapa visual para repasar.",
        accent: "emerald",
      })}
      ${timelineCard({
        x: 80,
        y: 232,
        w: 1440,
        h: 250,
        accent: "emerald",
        title: "Secuencia constitucional que conviene memorizar",
        subtitle: "Del proceso constituyente a la entrada en vigor.",
        items: [
          { date: "15/06/1977", label: "Elecciones generales" },
          { date: "22/07/1977", label: "Constitución de las Cortes" },
          { date: "31/10/1978", label: "Aprobación del texto" },
          { date: "06/12/1978", label: "Referéndum" },
          { date: "27/12/1978", label: "Sanción real" },
          { date: "29/12/1978", label: "BOE y vigencia" },
        ],
      })}
      ${card({
        x: 80,
        y: 516,
        w: 680,
        h: 336,
        accent: "emerald",
        eyebrow: "Idea fuerza",
        title: "Características",
        maxChars: 43,
        items: [
          "Escrita y codificada; extensa: 169 artículos.",
          "Rígida: reforma por procedimiento especial.",
          "Cuatro reformas que debes ubicar: arts. 13.2, 135, 49 y 69.",
          "Democrática y monárquica: Estado social y democrático de Derecho + Monarquía parlamentaria.",
          "Constitución de consenso y con derechos garantizados.",
          "Norma suprema del ordenamiento.",
        ],
      })}
      ${card({
        x: 840,
        y: 516,
        w: 680,
        h: 336,
        accent: "emerald",
        eyebrow: "Arquitectura",
        title: "Estructura",
        maxChars: 43,
        items: [
          "Preámbulo: declaración política de fundamento.",
          "Parte dogmática: Título Preliminar + Título I.",
          "Parte orgánica: Títulos II a X.",
          "169 artículos, 4 adicionales, 9 transitorias, 1 derogatoria y 1 final.",
          "11 bloques en total: Preliminar + 10 títulos.",
          "Capítulo II del Título I se divide en dos secciones.",
        ],
      })}
      ${card({
        x: 80,
        y: 884,
        w: 680,
        h: 612,
        accent: "emerald",
        eyebrow: "Arts. 1 a 9",
        title: "Título Preliminar",
        maxChars: 43,
        items: [
          "Art. 1: libertad, justicia, igualdad y pluralismo político; soberanía popular; Monarquía parlamentaria.",
          "Art. 2: unidad de España + autonomía + solidaridad.",
          "Art. 3: castellano oficial; demás lenguas, cooficiales según Estatutos.",
          "Art. 4 y 5: bandera del Estado y capital en Madrid.",
          "Art. 6 y 7: partidos, sindicatos y asociaciones empresariales con funcionamiento democrático.",
          "Art. 8: misión de las Fuerzas Armadas.",
          "Art. 9: sujeción a la CE y garantías jurídicas básicas.",
        ],
      })}
      ${card({
        x: 840,
        y: 884,
        w: 680,
        h: 612,
        accent: "emerald",
        eyebrow: "Arts. 10 a 55",
        title: "Título I · Derechos y deberes",
        maxChars: 43,
        items: [
          "Art. 10: dignidad, libre desarrollo y lectura conforme a DDHH.",
          "Cap. I (11-13): nacionalidad, mayoría de edad y estatuto de los extranjeros.",
          "Cap. II Sección 1ª (14-29): igualdad, vida, libertad, intimidad, expresión, reunión, asociación, participación y tutela.",
          "Cap. II Sección 2ª (30-38): deberes ciudadanos, trabajo, propiedad y negociación colectiva.",
          "Cap. III (39-52): principios rectores de política social y económica.",
          "Cap. IV y V (53-55): garantías, Defensor del Pueblo y suspensión.",
        ],
      })}
      ${card({
        x: 80,
        y: 1528,
        w: 680,
        h: 336,
        accent: "emerald",
        eyebrow: "Para examinarte",
        title: "Derechos que más se cruzan",
        maxChars: 43,
        items: [
          "Igualdad; vida e integridad; libertad y seguridad + habeas corpus.",
          "Honor, intimidad, domicilio y secreto de las comunicaciones.",
          "Expresión e información; reunión; asociación; participación del art. 23.",
          "Tutela judicial, legalidad sancionadora y educación.",
        ],
      })}
      ${card({
        x: 840,
        y: 1528,
        w: 680,
        h: 336,
        accent: "emerald",
        eyebrow: "Arts. 53 a 55",
        title: "Garantía y suspensión",
        maxChars: 43,
        items: [
          "Tutela ordinaria y amparo constitucional para art. 14 a 29 y objeción del 30.2.",
          "Los principios rectores orientan leyes y actuación pública.",
          "Defensor del Pueblo: alto comisionado de las Cortes.",
          "Excepción o sitio: se suspenden 17, 18.2-3, 19, 20, 21, 28.2 y 37.2.",
        ],
      })}
      ${card({
        x: 80,
        y: 1896,
        w: 1440,
        h: 334,
        accent: "emerald",
        eyebrow: "Arts. 56 a 65",
        title: "Corona, Jefatura del Estado y funciones del Rey",
        maxChars: 104,
        items: [
          "Art. 56: Jefe del Estado, símbolo de unidad y permanencia; arbitra y modera; inviolable; actos con refrendo.",
          "Arts. 57 a 61: sucesión, Príncipe de Asturias, Regencia, tutela y juramento.",
          "Art. 62: leyes, Cortes, elecciones, referéndum, Presidente, Gobierno, decretos, FFAA, gracia y Academias.",
          "Arts. 63 a 65: representación exterior, tratados, guerra y paz, refrendo y Casa del Rey.",
        ],
      })}
    `,
  });
}

function renderB3T1() {
  const palette = accents.coral;
  return scaffold({
    width: 1600,
    height: 2280,
    body: `
      ${hero({
        code: "B3T1",
        title: "Modelo Entidad-Relación",
        subtitle: "Diseño conceptual de datos con foco en entidades, atributos, relaciones y validación.",
        accent: "coral",
      })}
      ${flowBanner({
        x: 80,
        y: 232,
        w: 1440,
        h: 214,
        accent: "coral",
        title: "Qué persigue el tema",
        items: ["Mundo real", "Esquema conceptual", "Modelo E-R extendido", "Datos sin redundancia ni incoherencias"],
      })}
      ${card({
        x: 80,
        y: 480,
        w: 680,
        h: 344,
        accent: "coral",
        eyebrow: "Marco general",
        title: "Objetivo y beneficios",
        maxChars: 43,
        items: [
          "Modelar los datos de un sistema de información con enfoque estructurado.",
          "El resultado es el esquema conceptual: primera aproximación del mundo real.",
          "Ventajas: comprender la organización, separar del entorno físico, detectar errores pronto y mejorar el mantenimiento.",
        ],
      })}
      <g>
        ${card({
          x: 840,
          y: 480,
          w: 680,
          h: 344,
          accent: "coral",
          eyebrow: "Piezas y símbolos",
          title: "Dominio y notación",
          note: "Cada atributo toma valores de un dominio. El dominio existe con independencia de la entidad y de la relación.",
          maxChars: 42,
          items: ["Entidad -> rectángulo", "Atributo -> elipse", "Relación -> rombo", "Jerarquía -> triángulo invertido"],
          customSvg: `
            <rect x="980" y="666" width="116" height="58" rx="10" fill="${palette.soft}" stroke="${palette.strong}" stroke-width="2.5" />
            <text x="1038" y="703" text-anchor="middle" fill="${baseColors.ink}" font-family="${bodyFont}" font-size="20" font-weight="800">Entidad</text>
            <ellipse cx="1228" cy="694" rx="74" ry="34" fill="${palette.soft}" stroke="${palette.strong}" stroke-width="2.5" />
            <text x="1228" y="701" text-anchor="middle" fill="${baseColors.ink}" font-family="${bodyFont}" font-size="20" font-weight="800">Atributo</text>
            <polygon points="1378,660 1446,694 1378,728 1310,694" fill="${palette.soft}" stroke="${palette.strong}" stroke-width="2.5" />
            <text x="1378" y="701" text-anchor="middle" fill="${baseColors.ink}" font-family="${bodyFont}" font-size="19" font-weight="800">Relación</text>
          `,
        })}
      </g>
      ${card({
        x: 80,
        y: 856,
        w: 680,
        h: 462,
        accent: "coral",
        eyebrow: "Concepto 1",
        title: "Entidad",
        maxChars: 42,
        items: [
          "Objeto real o abstracto del que interesa almacenar información.",
          "Tipo de entidad = intención; conjunto de ocurrencias = extensión.",
          "Regulares: existen por sí mismas.",
          "Débiles: dependen de otra entidad.",
          "Reglas: existencia propia, ocurrencias distinguibles y mismos atributos.",
        ],
      })}
      ${card({
        x: 840,
        y: 856,
        w: 680,
        h: 462,
        accent: "coral",
        eyebrow: "Concepto 2",
        title: "Atributo",
        maxChars: 42,
        items: [
          "Propiedad que identifica o describe la entidad y se define sobre un dominio.",
          "Debe existir un identificador principal o clave primaria.",
          "Si hay varias claves posibles, una es primaria y las demás son candidatas o alternativas.",
          "Superclave = conjunto no mínimo que identifica unívocamente.",
          "Tipos: simple, compuesto, multivaluado, obligatorio y derivado.",
        ],
      })}
      ${card({
        x: 80,
        y: 1334,
        w: 1440,
        h: 404,
        accent: "coral",
        eyebrow: "Concepto 3",
        title: "Relación",
        maxChars: 91,
        items: [
          "Asociación entre entidades. Puede ser regular, débil o exclusiva. En dependencia por identificación: clave de la débil = clave de la fuerte + clave propia.",
          "Se caracteriza por nombre, grado, tipo de correspondencia y cardinalidad.",
          "Grado: unaria (reflexiva), binaria, ternaria o n-aria.",
          "Tipo de correspondencia: 1:1, 1:N o N:M.",
          "Cardinalidad: obligatoria (1,max) u opcional (0,max). Puede haber atributos propios y roles.",
        ],
      })}
      ${card({
        x: 80,
        y: 1770,
        w: 680,
        h: 430,
        accent: "coral",
        eyebrow: "Abstracción",
        title: "Extensiones del modelo E-R",
        maxChars: 42,
        items: [
          "Generalización: varios subtipos -> un supertipo.",
          "Especialización: un supertipo -> varios subtipos.",
          "Categorías: subtipo unión de varios supertipos.",
          "Agregación: tratar una composición como entidad nueva.",
          "Jerarquías: total/parcial y disjunta/solapada.",
        ],
      })}
      ${card({
        x: 840,
        y: 1770,
        w: 680,
        h: 430,
        accent: "coral",
        eyebrow: "Método",
        title: "Construcción y validación",
        maxChars: 42,
        items: [
          "1. Identificar entidades del sistema.",
          "2. Fijar identificadores principales.",
          "3. Establecer relaciones, grados y cardinalidades.",
          "4. Dibujar el modelo.",
          "5. Añadir y describir atributos.",
          "6. Verificar redundancias de atributos y relaciones.",
        ],
      })}
    `,
  });
}

function renderB3T2() {
  return scaffold({
    width: 1600,
    height: 2450,
    body: `
      ${hero({
        code: "B3T2",
        title: "Diseño de Bases de Datos",
        subtitle: "Paso del modelo conceptual al relacional y al físico, con normalización e integridad.",
        accent: "amber",
      })}
      ${flowBanner({
        x: 80,
        y: 232,
        w: 1440,
        h: 220,
        accent: "amber",
        title: "Recorrido del tema",
        items: ["Modelo conceptual (E-R)", "Modelo lógico (relacional)", "Modelo físico (SGBD)", "Comprobación: integridad + normalización"],
      })}
      ${card({
        x: 80,
        y: 486,
        w: 680,
        h: 418,
        accent: "amber",
        eyebrow: "Base teórica",
        title: "Diseño de BD e independencia",
        maxChars: 43,
        items: [
          "El diseño abstrae un problema real hasta volverlo tratable por ordenador.",
          "La arquitectura ANSI/X3/SPARC separa nivel externo, conceptual e interno.",
          "Independencia lógica: cambiar el esquema conceptual sin romper vistas y programas.",
          "Independencia física: cambiar almacenamiento sin tocar esquema conceptual.",
        ],
      })}
      ${card({
        x: 840,
        y: 486,
        w: 680,
        h: 418,
        accent: "amber",
        eyebrow: "Fase 1",
        title: "Diseño lógico",
        maxChars: 43,
        items: [
          "Convierte el esquema conceptual al modelo soportado por el SGBD.",
          "Primero se ajusta el conceptual: eliminar atributos compuestos, multivalorados y relaciones redundantes.",
          "Después se transforman dominios, entidades, atributos, relaciones y jerarquías.",
          "La normalización valida que el esquema relacional no arrastre anomalías.",
        ],
      })}
      ${card({
        x: 80,
        y: 936,
        w: 680,
        h: 628,
        accent: "amber",
        eyebrow: "Paso E-R -> relacional",
        title: "Transformaciones principales",
        maxChars: 43,
        items: [
          "Dominio -> dominio equivalente o tipo primitivo + restricciones.",
          "Entidad -> tabla; clave principal -> PRIMARY KEY.",
          "Atributos convencionales -> columnas; candidatas -> UNIQUE.",
          "Relación 1:1 -> analizar mínimos; a veces tabla nueva.",
          "Relación 1:N -> propagar la clave del lado 1 al lado N.",
          "Relación N:M o ternaria -> tabla nueva con claves propagadas.",
          "Reflexivas -> propagación de clave renombrada.",
          "Jerarquías -> supertipo/subtipos o tabla única con discriminante.",
        ],
      })}
      ${card({
        x: 840,
        y: 936,
        w: 680,
        h: 628,
        accent: "amber",
        eyebrow: "Fase 2",
        title: "Diseño físico",
        maxChars: 43,
        items: [
          "Traducir el esquema lógico al SGBD concreto: claves, nulos, dominios, restricciones y tablas.",
          "Diseñar representación física: espacio, tiempos de respuesta y productividad de transacciones.",
          "Pensar índices: primarias, foráneas y accesos frecuentes; evitar tablas pequeñas y atributos poco selectivos.",
          "Valorar desnormalización solo si compensa en rendimiento.",
          "Diseñar seguridad mediante vistas y reglas de acceso.",
          "Monitorizar y afinar el sistema después de implantarlo.",
        ],
      })}
      ${card({
        x: 80,
        y: 1598,
        w: 680,
        h: 452,
        accent: "amber",
        eyebrow: "Modelo lógico relacional",
        title: "Qué debes memorizar",
        maxChars: 43,
        items: [
          "Las tablas tienen filas de un solo tipo y sin duplicados.",
          "Cada columna tiene nombre propio y valores de un dominio.",
          "El orden de filas y columnas es indiferente.",
          "Reglas de integridad: semántica + estados permitidos por el SGBD.",
          "Operadores clave: selección, proyección, unión, diferencia y join.",
        ],
      })}
      ${card({
        x: 840,
        y: 1598,
        w: 680,
        h: 452,
        accent: "amber",
        eyebrow: "Dependencias",
        title: "Antes de normalizar",
        maxChars: 43,
        items: [
          "Dependencia funcional: X -> Y.",
          "Dependencia funcional completa: Y depende de toda la clave.",
          "Dependencia transitiva: X -> Y -> Z.",
          "Objetivo: evitar redundancias y anomalías de actualización.",
          "Cuanto mayor sea la forma normal, menor vulnerabilidad a inconsistencias.",
        ],
      })}
      <g>
        <rect x="80" y="2114" width="1440" height="304" rx="30" fill="${baseColors.paper}" stroke="${accents.amber.border}" stroke-width="2" />
        <text x="114" y="2162" fill="${accents.amber.strong}" font-family="${bodyFont}" font-size="17" font-weight="800" letter-spacing="3.5">ESCALERA DE NORMALIZACIÓN</text>
        <text x="114" y="2200" fill="${baseColors.ink}" font-family="${headingFont}" font-size="34" font-weight="700">De 1FN a 5FN</text>
        <text x="114" y="2232" fill="${baseColors.muted}" font-family="${bodyFont}" font-size="20" font-weight="500">Piensa cada peldaño como una anomalía que se elimina.</text>
        <g transform="translate(114 2270)">
          <rect x="0" y="0" width="360" height="54" rx="16" fill="${accents.amber.soft}" stroke="${accents.amber.border}" stroke-width="2" />
          <text x="180" y="35" text-anchor="middle" fill="${baseColors.ink}" font-family="${bodyFont}" font-size="21" font-weight="800">1FN · sin grupos repetidos</text>
          <rect x="388" y="0" width="360" height="54" rx="16" fill="${accents.amber.soft}" stroke="${accents.amber.border}" stroke-width="2" />
          <text x="568" y="35" text-anchor="middle" fill="${baseColors.ink}" font-family="${bodyFont}" font-size="21" font-weight="800">2FN · sin dependencias parciales</text>
          <rect x="776" y="0" width="360" height="54" rx="16" fill="${accents.amber.soft}" stroke="${accents.amber.border}" stroke-width="2" />
          <text x="956" y="35" text-anchor="middle" fill="${baseColors.ink}" font-family="${bodyFont}" font-size="21" font-weight="800">3FN · sin transitivas</text>
          <rect x="0" y="74" width="360" height="54" rx="16" fill="${accents.amber.soft}" stroke="${accents.amber.border}" stroke-width="2" />
          <text x="180" y="109" text-anchor="middle" fill="${baseColors.ink}" font-family="${bodyFont}" font-size="20" font-weight="800">FNBC · todo determinante es clave</text>
          <rect x="388" y="74" width="360" height="54" rx="16" fill="${accents.amber.soft}" stroke="${accents.amber.border}" stroke-width="2" />
          <text x="568" y="109" text-anchor="middle" fill="${baseColors.ink}" font-family="${bodyFont}" font-size="20" font-weight="800">4FN · sin dependencias multivaluadas</text>
          <rect x="776" y="74" width="360" height="54" rx="16" fill="${accents.amber.soft}" stroke="${accents.amber.border}" stroke-width="2" />
          <text x="956" y="109" text-anchor="middle" fill="${baseColors.ink}" font-family="${bodyFont}" font-size="20" font-weight="800">5FN · sin pérdidas en combinaciones</text>
        </g>
      </g>
    `,
  });
}

const outputs = [
  ["b1t1-constitucion-esquema.svg", renderB1()],
  ["b3t1-modelo-er-esquema.svg", renderB3T1()],
  ["b3t2-diseno-bd-esquema.svg", renderB3T2()],
];

for (const [fileName, contents] of outputs) {
  writeFileSync(resolve(outputDir, fileName), contents, "utf8");
}

console.log(`[visual-summaries] Generados ${outputs.length} esquemas en ${outputDir}`);
