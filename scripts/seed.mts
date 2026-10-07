import postgres from "postgres";
import { TIPOS } from "../lib/tipos.ts";
import { recursos } from "../data/recurso.ts";

const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("Falta POSTGRES_URL o DATABASE_URL");

const sql = postgres(url, { ssl: "require", prepare: false });

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS tipos (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL UNIQUE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS recursos (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      nombre TEXT NOT NULL,
      tipo_id INT NOT NULL REFERENCES tipos(id),
      descripcion TEXT NOT NULL,
      url TEXT NOT NULL,
      imagen_url TEXT,
      extra JSONB NOT NULL DEFAULT '{}',
      creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  // Moderación: las filas que ya existían quedan como 'aprobado'
  await sql`
    ALTER TABLE recursos
    ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'aprobado'
    CHECK (estado IN ('pendiente', 'aprobado', 'rechazado'))
  `;

  await sql`CREATE INDEX IF NOT EXISTS recursos_estado_idx ON recursos (estado)`;
  await sql`CREATE INDEX IF NOT EXISTS recursos_tipo_idx ON recursos (tipo_id)`;

  for (const nombre of TIPOS) {
    await sql`
      INSERT INTO tipos (nombre) VALUES (${nombre})
      ON CONFLICT (nombre) DO NOTHING
    `;
  }

  for (const r of recursos) {
    await sql`
      INSERT INTO recursos (slug, nombre, tipo_id, descripcion, url, imagen_url, extra)
      VALUES (
        ${r.slug},
        ${r.nombre},
        (SELECT id FROM tipos WHERE nombre = ${r.tipo}),
        ${r.descripcion},
        ${r.url},
        ${r.imagenUrl ?? null},
        ${JSON.stringify(r.extra ?? {})}::jsonb
      )
      ON CONFLICT (slug) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        tipo_id = EXCLUDED.tipo_id,
        descripcion = EXCLUDED.descripcion,
        url = EXCLUDED.url,
        imagen_url = EXCLUDED.imagen_url,
        extra = EXCLUDED.extra
    `;
  }

  const [{ total }] = await sql`SELECT count(*)::int AS total FROM recursos`;
  console.log(`Listo: ${total} recursos en la base de datos.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
