export const TIPOS = [
  "framework",
  "herramienta",
  "practica",
  "ia",
  "sitio",
] as const;

export type TipoRecurso = (typeof TIPOS)[number];

export const etiquetasTipo: Record<TipoRecurso, string> = {
  framework: "Framework",
  herramienta: "Herramienta",
  practica: "Práctica",
  ia: "IA",
  sitio: "Sitio",
};

export type Recurso = {
  slug: string;
  nombre: string;
  tipo: TipoRecurso;
  descripcion: string;
  url: string;
  imagenUrl?: string | null;
  extra?: Record<string, unknown>;
};
