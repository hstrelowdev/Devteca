import { sql } from "@/lib/db";

// El cron llama a este endpoint una vez al día. Supabase pausa los proyectos
// del plan gratis cuando detecta poca actividad durante 7 días, así que hacemos
// varias consultas reales por ejecución para reiniciar el contador.
const PINGS_PER_RUN = 3;

// Evita que Next.js prerenderice la ruta en build: debe ejecutarse en cada llamada.
export const dynamic = "force-dynamic";
// postgres.js necesita el runtime de Node (sockets TCP).
export const runtime = "nodejs";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  // Vercel Cron envía `Authorization: Bearer <CRON_SECRET>`.
  // Si la variable no está definida, omitimos la comprobación (útil en local).
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    for (let i = 0; i < PINGS_PER_RUN; i++) {
      await sql`SELECT 1`;
    }

    return Response.json({
      ok: true,
      pings: PINGS_PER_RUN,
      at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[keep-alive] Error al consultar la base de datos:", error);
    return Response.json(
      { ok: false, error: "No se pudo contactar con la base de datos" },
      { status: 500 },
    );
  }
}
