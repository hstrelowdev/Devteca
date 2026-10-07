import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categorias } from "@/lib/categorias";
import { getRecursoPorSlug, getRecursos } from "@/lib/recursos";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  const recursos = await getRecursos();
  return recursos.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recurso = await getRecursoPorSlug(slug);
  if (!recurso) return {};
  return {
    title: `${recurso.nombre}`,
    description: recurso.descripcion,
  };
}

export default async function RecursoPage({ params }: Props) {
  const { slug } = await params;
  const recurso = await getRecursoPorSlug(slug);
  if (!recurso) notFound();

  const entrada = Object.entries(categorias).find(
    ([, c]) => c.tipo === recurso.tipo,
  );
  const claveCategoria = entrada?.[0];
  const categoria = entrada?.[1];

  return (
    <article className="mx-auto max-w-2xl">
      {categoria && (
        <Link
          href={`/${claveCategoria}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {categoria.titulo}
        </Link>
      )}

      <div className="mt-4 flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{recurso.nombre}</h1>
        {categoria && <Badge variant="secondary">{categoria.titulo}</Badge>}
      </div>

      <p className="mt-4 text-lg text-muted-foreground">
        {recurso.descripcion}
      </p>

      <Button asChild className="mt-6">
        <a href={recurso.url} target="_blank" rel="noopener noreferrer">
          Visitar sitio
          <ExternalLink />
        </a>
      </Button>
    </article>
  );
}
