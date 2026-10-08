import { notFound } from "next/navigation";
import { RecursoForm } from "@/components/my/recurso-form";
import { exigirAdmin } from "@/lib/admin";
import { obtenerRecursoConEstado } from "@/lib/recursos";

export const metadata = { title: "Editar recurso" };

export default async function EditarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await exigirAdmin();
  const { slug } = await params;
  const recurso = await obtenerRecursoConEstado(slug);
  if (!recurso) notFound();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Editar recurso</h1>
      <RecursoForm recurso={recurso} />
    </div>
  );
}
