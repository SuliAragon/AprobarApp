export function withBase(path = "") {
  const normalizedPath = path.replace(/^\/+/, "");
  const base = import.meta.env.BASE_URL ?? "/";
  return normalizedPath ? `${base}${normalizedPath}` : base;
}
