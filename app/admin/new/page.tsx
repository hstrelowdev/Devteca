import { RecursoForm } from "@/components/my/recurso-form";
import { exigirAdmin } from "@/lib/admin";

export const metadata = { title: "Nuevo recurso" };

export default async function NuevoPage() {
  await exigirAdmin();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Nuevo recurso</h1>
      <RecursoForm />
    </div>
  );
}
