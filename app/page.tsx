import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { categorias } from "@/lib/categorias";
import { listarRecursos } from "@/lib/recursos";

export const revalidate = 3600;
export default async function Home() {
  const recursos = await listarRecursos();

  return (
    <div className="mx-auto max-w-5xl">
      <section className="py-10">
        <h1 className="neon-gradient text-4xl font-bold tracking-tight">
          Devteca
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Biblioteca de recursos para developers: frameworks, herramientas,
          sitios y ejercicios para practicar, todo en un solo lugar.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(categorias).map(([clave, categoria]) => {
          const Icono = categoria.icono;
          const total = recursos.filter(
            (r) => r.tipo === categoria.tipo,
          ).length;

          return (
            <Link key={clave} href={`/${clave}`}>
              <Card className="neon-card h-full">
                <CardHeader>
                  <Icono className="size-6" />
                  <CardTitle>{categoria.titulo}</CardTitle>
                  <CardDescription>{categoria.descripcion}</CardDescription>
                  <p className="text-sm text-muted-foreground">
                    {total} {total === 1 ? "recurso" : "recursos"}
                  </p>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
