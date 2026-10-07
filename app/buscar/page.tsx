import { ResourceCard } from "@/components/my/resource-card";
import { buscarRecursos } from "@/lib/recursos";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata = { robots: { index: false } };

export default async function BuscarPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const resultados = await buscarRecursos(q);

  return (
    <div>
      <h1 className="text-2xl font-bold">Buscar</h1>

      {!q.trim() ? (
        <p className="mt-4 text-muted-foreground">
          Escribe algo en el buscador para encontrar recursos.
        </p>
      ) : resultados.length === 0 ? (
        <p className="mt-4 text-muted-foreground">
          No encontré recursos para «{q}».
        </p>
      ) : (
        <>
          <p className="mt-1 text-muted-foreground">
            {resultados.length}{" "}
            {resultados.length === 1 ? "resultado" : "resultados"} para «{q}»
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resultados.map((r) => (
              <ResourceCard key={r.slug} recurso={r} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
