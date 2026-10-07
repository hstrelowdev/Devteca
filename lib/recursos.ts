import type { Recurso, TipoRecurso } from "./tipos";
import { recursos } from "@/data/recurso";

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
