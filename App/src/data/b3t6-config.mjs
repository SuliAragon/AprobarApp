const directory = "Bloque 3/Tema 6/";

export const b3t6Documents = [
  { slug: "plataformas", title: "Jakarta EE y .NET", filename: "B3T6_Java_.NET.pdf", sections: [
    ["jakarta", "Jakarta EE: arquitectura y componentes"], ["persistencia", "Persistencia y transacciones"],
    ["servicios", "Servicios, seguridad y despliegue"], ["net", ".NET: CLR, tipos y bibliotecas"],
    ["net-datos", ".NET: datos, seguridad e interfaces"],
  ] },
  { slug: "c", title: "C", filename: "B3T6_Resumen_C.pdf", sections: [
    ["tipos", "Tipos y operadores"], ["control", "Control de flujo"], ["memoria", "Arrays, cadenas y punteros"],
    ["funciones", "Funciones, estructuras y enumeraciones"], ["io", "Entrada/salida y preprocesador"],
  ] },
  { slug: "csharp", title: "C#", filename: "B3T6_Resumen_C_.pdf", sections: [
    ["tipos", "Tipos y operadores"], ["control", "Control de flujo, arrays y cadenas"], ["clases", "Clases, propiedades y genericos"],
    ["herencia", "Herencia e interfaces"], ["excepciones", "Excepciones, espacios de nombres y E/S"],
  ] },
  { slug: "cpp", title: "C++", filename: "B3T6_Resumen_C__.pdf", sections: [
    ["tipos", "Extensiones de C y ambitos"], ["funciones", "Referencias, funciones y sobrecarga"],
    ["memoria", "Memoria, clases y construccion"], ["herencia", "Herencia y polimorfismo"], ["plantillas", "Plantillas y flujos de E/S"],
  ] },
  { slug: "java", title: "Java", filename: "B3T6_Resumen_Java.pdf", sections: [
    ["tipos", "Tipos, operadores y variables"], ["control", "Control de flujo y arrays"], ["clases", "Clases, metodos y paquetes"],
    ["herencia", "Herencia e interfaces"], ["excepciones", "Excepciones, E/S e interfaces de usuario"],
  ] },
].map((doc) => ({ ...doc, sourceFilename: directory + doc.filename }));

export const b3t6PracticeGroups = b3t6Documents.map((doc) => ({
  slug: doc.slug,
  title: doc.title,
  description: `Diez tests exclusivos del documento ${doc.title}, con teoria y lectura de codigo.`,
  sourceFilename: doc.sourceFilename,
  testPresets: doc.sections.map(([slug, title], index) => ({
    slug, title: `Test ${index + 1} · ${title}`,
    description: `Repaso de ${title.toLowerCase()} dentro de ${doc.title}.`,
    focusSections: [`${doc.slug}-${slug}`], size: 50,
  })),
}));
