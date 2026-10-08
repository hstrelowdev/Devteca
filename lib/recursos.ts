import { sql } from "./db";
import type { Recurso, TipoRecurso } from "./tipos";

export type EstadoRecurso = "pendiente" | "aprobado" | "rechazado";

export type DatosRecurso = {
  nombre: string;
  url: string;
  tipo: TipoRecurso;
  descripcion: string;
};

export type RecursoConEstado = Recurso & { estado: EstadoRecurso };

type Fila = {
  slug: string;
  nombre: string;
  tipo: TipoRecurso;
  descripcion: string;
  url: string;
  imagen_url: string | null;
  extra: Record<string, unknown>;
};

type FilaConEstado = Fila & { estado: EstadoRecurso };

function convertirFilaEnRecurso(fila: Fila): Recurso {
  return {
    slug: fila.slug,
    nombre: fila.nombre,
    tipo: fila.tipo,
    descripcion: fila.descripcion,
    url: fila.url,
    imagenUrl: fila.imagen_url,
    extra: fila.extra,
  };
}

function convertirFilaEnRecursoConEstado(
  fila: FilaConEstado,
): RecursoConEstado {
  return { ...convertirFilaEnRecurso(fila), estado: fila.estado };
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

/* ---------- Lectura pública (solo recursos aprobados) ---------- */

export async function listarRecursos(): Promise<Recurso[]> {
  const filas = await sql<Fila[]>`
    SELECT r.slug, r.nombre, t.nombre AS tipo, r.descripcion, r.url,
           r.imagen_url, r.extra
    FROM recursos r
    JOIN tipos t ON t.id = r.tipo_id
    WHERE r.estado = 'aprobado'
    ORDER BY r.nombre
  `;
  return filas.map(convertirFilaEnRecurso);
}

export async function listarRecursosPorTipo(
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
  return filas.map(convertirFilaEnRecurso);
}

export async function obtenerRecurso(
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
  return filas[0] ? convertirFilaEnRecurso(filas[0]) : undefined;
}

export async function buscarRecursos(consulta: string): Promise<Recurso[]> {
  const q = normalizar(consulta.trim());
  if (!q) return [];
  const todos = await listarRecursos();
  return todos.filter((r) =>
    normalizar(`${r.nombre} ${r.descripcion}`).includes(q),
  );
}

/* ---------- Lectura del panel (todos los estados) ---------- */

export async function listarRecursosConEstado(): Promise<RecursoConEstado[]> {
  const filas = await sql<FilaConEstado[]>`
    SELECT r.slug, r.nombre, t.nombre AS tipo, r.descripcion, r.url,
           r.imagen_url, r.extra, r.estado
    FROM recursos r
    JOIN tipos t ON t.id = r.tipo_id
    ORDER BY r.nombre
  `;
  return filas.map(convertirFilaEnRecursoConEstado);
}

export async function obtenerRecursoConEstado(
  slug: string,
): Promise<RecursoConEstado | undefined> {
  const filas = await sql<FilaConEstado[]>`
    SELECT r.slug, r.nombre, t.nombre AS tipo, r.descripcion, r.url,
           r.imagen_url, r.extra, r.estado
    FROM recursos r
    JOIN tipos t ON t.id = r.tipo_id
    WHERE r.slug = ${slug}
    LIMIT 1
  `;
  return filas[0] ? convertirFilaEnRecursoConEstado(filas[0]) : undefined;
}

/* ---------- Escritura ---------- */

export async function crearRecurso(
  datos: DatosRecurso,
  estado: EstadoRecurso = "aprobado",
): Promise<{ ok: boolean }> {
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
      ${estado}
    )
    ON CONFLICT (slug) DO NOTHING
    RETURNING id
  `;
  return { ok: filas.length > 0 };
}

// El slug no cambia al editar, para no romper enlaces existentes.
export async function actualizarRecurso(
  slug: string,
  datos: DatosRecurso,
): Promise<{ ok: boolean }> {
  const filas = await sql`
    UPDATE recursos SET
      nombre = ${datos.nombre},
      tipo_id = (SELECT id FROM tipos WHERE nombre = ${datos.tipo}),
      descripcion = ${datos.descripcion},
      url = ${datos.url}
    WHERE slug = ${slug}
    RETURNING id
  `;
  return { ok: filas.length > 0 };
}

export async function eliminarRecurso(slug: string): Promise<void> {
  await sql`DELETE FROM recursos WHERE slug = ${slug}`;
}
