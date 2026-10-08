import { Pagination } from "@/components/my/Pagination";
import { ResourceCard } from "@/components/my/ResourceCard";
import { leerPaginacion, paginar } from "@/lib/paginacion";
import { buscarRecursos } from "@/lib/recursos";

type Props = {
  searchParams: Promise<{ q?: string; page?: string; por?: string }>;
};

export default async function BuscarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const resultados = await buscarRecursos(q);
  const { pagina, por } = leerPaginacion(sp);
  const p = paginar(resultados, pagina, por);

  return (
    <div>
      <h1 className="text-2xl font-bold">Buscar</h1>

      {!q.trim() ? (
        <p className="mt-4 text-muted-foreground">
          Escribe algo en el buscador para encontrar recursos.
        </p>
      ) : p.total === 0 ? (
        <p className="mt-4 text-muted-foreground">
          No encontré recursos para «{q}».
        </p>
      ) : (
        <>
          <p className="mt-1 text-muted-foreground">
            {p.total} {p.total === 1 ? "resultado" : "resultados"} para «{q}»
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.items.map((r) => (
              <ResourceCard key={r.slug} recurso={r} />
            ))}
          </div>
          <Pagination base="/buscar" extra={{ q }} {...p} />
        </>
      )}
    </div>
  );
}
