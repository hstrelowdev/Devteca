import { ProponerForm } from "@/components/my/proponer-form";

export const metadata = { title: "Proponer un recurso" };

export default function ProponerPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Proponer un recurso</h1>
      <p className="mt-1 text-muted-foreground">
        ¿Conoces algo útil para developers? Envíalo y lo reviso antes de
        publicarlo.
      </p>
      <ProponerForm />
    </div>
  );
}
