"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eliminarRecursoAction } from "@/app/admin/actions";

export function BotonEliminar({
  slug,
  nombre,
}: {
  slug: string;
  nombre: string;
}) {
  return (
    <form
      action={eliminarRecursoAction}
      onSubmit={(e) => {
        if (!confirm(`¿Eliminar «${nombre}»? No se puede deshacer.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <Button type="submit" size="sm" variant="destructive">
        <Trash2 aria-hidden="true" />
        Eliminar
      </Button>
    </form>
  );
}
