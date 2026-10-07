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
  imagenUrl?: string;
  extra?: Record<string, unknown>;
};

const recursos: Recurso[] = [
  {
    slug: "nextjs",
    nombre: "Next.js",
    tipo: "framework",
    descripcion: "Framework de React para construir sitios y aplicaciones web.",
    url: "https://nextjs.org",
  },
  {
    slug: "tailwindcss",
    nombre: "Tailwind CSS",
    tipo: "herramienta",
    descripcion: "Framework de CSS basado en clases utilitarias.",
    url: "https://tailwindcss.com",
  },
  {
    slug: "shadcn-ui",
    nombre: "shadcn/ui",
    tipo: "herramienta",
    descripcion:
      "Componentes de interfaz que copias a tu proyecto y personalizas.",
    url: "https://ui.shadcn.com",
  },
  {
    slug: "roadmap-sh",
    nombre: "roadmap.sh",
    tipo: "sitio",
    descripcion:
      "Rutas visuales de aprendizaje para distintas áreas del desarrollo.",
    url: "https://roadmap.sh",
  },
  {
    slug: "devdocs",
    nombre: "DevDocs",
    tipo: "sitio",
    descripcion:
      "Documentación de muchas tecnologías en un solo lugar con buscador.",
    url: "https://devdocs.io",
  },
  {
    slug: "exercism",
    nombre: "Exercism",
    tipo: "practica",
    descripcion:
      "Ejercicios de programación en muchos lenguajes, con mentoría.",
    url: "https://exercism.org",
  },
  {
    slug: "frontend-mentor",
    nombre: "Frontend Mentor",
    tipo: "practica",
    descripcion: "Retos de frontend basados en diseños reales para practicar.",
    url: "https://www.frontendmentor.io",
  },
];

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
