export type TipoRecurso =
  | "framework"
  | "herramienta"
  | "practica"
  | "ia"
  | "sitio";

export type Recurso = {
  slug: string;
  nombre: string;
  tipo: TipoRecurso;
  descripcion: string;
  url: string;
  imagenUrl?: string | null;
  extra?: Record<string, unknown>;
};

const recursos: Recurso[] = [
  {
    slug: "react",
    nombre: "React",
    tipo: "framework",
    descripcion:
      "Librería de JavaScript para construir interfaces con componentes.",
    url: "https://react.dev",
  },
  {
    slug: "vite",
    nombre: "Vite",
    tipo: "herramienta",
    descripcion:
      "Herramienta de desarrollo rápida para proyectos web modernos.",
    url: "https://vite.dev",
  },
  {
    slug: "caniuse",
    nombre: "Can I use",
    tipo: "herramienta",
    descripcion: "Consulta qué navegadores soportan cada función de la web.",
    url: "https://caniuse.com",
  },
  {
    slug: "mdn",
    nombre: "MDN Web Docs",
    tipo: "sitio",
    descripcion: "Documentación de referencia para HTML, CSS y JavaScript.",
    url: "https://developer.mozilla.org",
  },
  {
    slug: "freecodecamp",
    nombre: "freeCodeCamp",
    tipo: "practica",
    descripcion: "Cursos y proyectos gratuitos para aprender a programar.",
    url: "https://www.freecodecamp.org",
  },
  {
    slug: "codewars",
    nombre: "Codewars",
    tipo: "practica",
    descripcion:
      "Retos de código (katas) para mejorar tu lógica y tu lenguaje.",
    url: "https://www.codewars.com",
  },
  {
    slug: "ollama",
    nombre: "Ollama",
    tipo: "ia",
    descripcion: "Ejecuta modelos de lenguaje en tu propio equipo.",
    url: "https://ollama.com",
  },
  {
    slug: "github-copilot",
    nombre: "GitHub Copilot",
    tipo: "ia",
    descripcion: "Asistente de IA que sugiere código dentro de tu editor.",
    url: "https://github.com/features/copilot",
  },
];

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export async function buscarRecursos(consulta: string): Promise<Recurso[]> {
  const q = normalizar(consulta.trim());
  if (!q) return [];
  return recursos.filter((r) =>
    normalizar(`${r.nombre} ${r.descripcion}`).includes(q),
  );
}

export async function getRecursos(): Promise<Recurso[]> {
  return recursos;
}

export async function getRecursosPorTipo(
  tipo: TipoRecurso,
): Promise<Recurso[]> {
  return recursos.filter((r) => r.tipo === tipo);
}

export async function getRecursoPorSlug(
  slug: string,
): Promise<Recurso | undefined> {
  return recursos.find((r) => r.slug === slug);
}
