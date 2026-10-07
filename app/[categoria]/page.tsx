import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceCard } from "@/components/my/resource-card";
import { categorias } from "@/lib/categorias";
import { getRecursosPorTipo } from "@/lib/recursos";

type Props = { params: Promise<{ categoria: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(categorias).map((categoria) => ({ categoria }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const config = categorias[categoria];
  return config ? { title: `${config.titulo} | Devteca` } : {};
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const config = categorias[categoria];
  if (!config) notFound();

  const recursos = await getRecursosPorTipo(config.tipo);

  return (
    <div>
      <h1 className="text-2xl font-bold">{config.titulo}</h1>
      <p className="mt-1 text-muted-foreground">{config.descripcion}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recursos.map((r) => (
          <ResourceCard key={r.slug} recurso={r} />
        ))}
      </div>
    </div>
  );
}
