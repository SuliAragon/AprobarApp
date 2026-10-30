export const workspaceLinks = [
  { id: "home", path: "", label: "Inicio", icon: "home", group: "Estudio" },
  { id: "temarios", path: "temarios/", label: "Temarios", icon: "book", group: "Estudio" },
  { id: "tests", path: "tests/", label: "Tests", icon: "check", group: "Estudio" },
  { id: "custom", path: "test-a-medida/", label: "A medida", icon: "sliders", group: "Estudio" },
  { id: "simulacros", path: "simulacros/", label: "Simulacros", icon: "timer", group: "Estudio" },
  { id: "cuaderno", path: "cuaderno/", label: "Cuaderno", icon: "notebook", group: "Organización" },
  { id: "progreso", path: "progreso/", label: "Progreso", icon: "chart", group: "Organización" },
  { id: "calendario", path: "calendario/", label: "Calendario", icon: "calendar", group: "Organización" },
];

export function getWorkspaceContext(pathname, base = "/") {
  const normalizedBase = `/${base.split("/").filter(Boolean).join("/")}/`.replace(/^\/\/$/, "/");
  const path = (pathname.startsWith(normalizedBase) ? pathname.slice(normalizedBase.length) : pathname.replace(/^\//, "")).replace(/\/$/, "");
  if (/^temarios\/.+\/(tests|oficiales)\//.test(path)) return { active: "tests", label: "Sesión de estudio", kind: "quiz" };
  const link = workspaceLinks.find((item) => item.path && (path === item.path.slice(0, -1) || path.startsWith(item.path))) ?? workspaceLinks[0];
  const quiz = link.id === "simulacros" && path.includes("/");
  return { active: link.id, label: quiz ? "Sesión de examen" : link.label, kind: quiz ? "quiz" : link.id };
}
