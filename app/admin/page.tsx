import { RecursoForm } from "@/components/my/recurso-form";

export const metadata = { title: "Nuevo recurso" };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Nuevo recurso</h1>
      <p className="mt-1 text-muted-foreground">
        Añade un recurso para publicarlo en Devteca.
      </p>
      <RecursoForm />
    </div>
  );
}
