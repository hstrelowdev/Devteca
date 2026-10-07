import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceCard } from "@/components/my/resource-card";
import { categorias } from "@/lib/categorias";
import { getRecursosPorTipo } from "@/lib/recursos";
import { Paginador } from "@/components/my/paginador";
import { leerPaginacion, paginar } from "@/lib/paginacion";

type Props = {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<{ page?: string; por?: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(categorias).map((categoria) => ({ categoria }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const config = categorias[categoria];
  return config ? { title: `${config.titulo} | Devteca` } : {};
}
export default async function CategoriaPage({ params, searchParams }: Props) {
  const { categoria } = await params;
  const sp = await searchParams;
  const config = categorias[categoria];
  if (!config) notFound();

  const todos = await getRecursosPorTipo(config.tipo);
  const { pagina, por } = leerPaginacion(sp);
  const p = paginar(todos, pagina, por);

  return (
    <div>
      <h1 className="text-2xl font-bold">{config.titulo}</h1>
      <p className="mt-1 text-muted-foreground">{config.descripcion}</p>

      {p.total === 0 ? (
        <p className="mt-6 text-muted-foreground">
          Aún no hay recursos en esta categoría. ¡Pronto habrá más!
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.items.map((r) => (
              <ResourceCard key={r.slug} recurso={r} />
            ))}
          </div>
          <Paginador base={`/${categoria}`} {...p} />
        </>
      )}
    </div>
  );
}
