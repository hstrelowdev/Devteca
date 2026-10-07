import { sql } from "./db";
import type { Recurso, TipoRecurso } from "./tipos";

type Fila = {
  slug: string;
  nombre: string;
  tipo: TipoRecurso;
  descripcion: string;
  url: string;
  imagen_url: string | null;
  extra: Record<string, unknown>;
};

function aRecurso(f: Fila): Recurso {
  return {
    slug: f.slug,
    nombre: f.nombre,
    tipo: f.tipo,
    descripcion: f.descripcion,
    url: f.url,
    imagenUrl: f.imagen_url,
    extra: f.extra,
  };
}

export async function getRecursos(): Promise<Recurso[]> {
  const filas = await sql<Fila[]>`
    SELECT r.slug, r.nombre, t.nombre AS tipo, r.descripcion, r.url,
           r.imagen_url, r.extra
    FROM recursos r
    JOIN tipos t ON t.id = r.tipo_id
    WHERE r.estado = 'aprobado'
    ORDER BY r.nombre
  `;
  return filas.map(aRecurso);
}

export async function getRecursosPorTipo(
  tipo: TipoRecurso,
): Promise<Recurso[]> {
  const filas = await sql<Fila[]>`
    SELECT r.slug, r.nombre, t.nombre AS tipo, r.descripcion, r.url,
           r.imagen_url, r.extra
    FROM recursos r
    JOIN tipos t ON t.id = r.tipo_id
    WHERE t.nombre = ${tipo} AND r.estado = 'aprobado'
    ORDER BY r.nombre
  `;
  return filas.map(aRecurso);
}

export async function getRecursoPorSlug(
  slug: string,
): Promise<Recurso | undefined> {
  const filas = await sql<Fila[]>`
    SELECT r.slug, r.nombre, t.nombre AS tipo, r.descripcion, r.url,
           r.imagen_url, r.extra
    FROM recursos r
    JOIN tipos t ON t.id = r.tipo_id
    WHERE r.slug = ${slug} AND r.estado = 'aprobado'
    LIMIT 1
  `;
  return filas[0] ? aRecurso(filas[0]) : undefined;
}

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function crearSlug(texto: string) {
  return normalizar(texto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function buscarRecursos(consulta: string): Promise<Recurso[]> {
  const q = normalizar(consulta.trim());
  if (!q) return [];
  const todos = await getRecursos();
  return todos.filter((r) =>
    normalizar(`${r.nombre} ${r.descripcion}`).includes(q),
  );
}

export async function proponerRecurso(datos: {
  nombre: string;
  url: string;
  tipo: TipoRecurso;
  descripcion: string;
}): Promise<{ ok: boolean }> {
  const slug = crearSlug(datos.nombre);
  if (!slug) return { ok: false };

  const filas = await sql`
    INSERT INTO recursos (slug, nombre, tipo_id, descripcion, url, estado)
    VALUES (
      ${slug},
      ${datos.nombre},
      (SELECT id FROM tipos WHERE nombre = ${datos.tipo}),
      ${datos.descripcion},
      ${datos.url},
      'pendiente'
    )
    ON CONFLICT (slug) DO NOTHING
    RETURNING id
  `;
  return { ok: filas.length > 0 };
}
