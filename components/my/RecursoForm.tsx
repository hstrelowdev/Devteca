"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  editarRecurso,
  guardarRecurso,
  type EstadoForm,
} from "@/app/admin/actions";
import { TIPOS, etiquetasTipo, type Recurso } from "@/lib/tipos";

const inicial: EstadoForm = { ok: false, mensaje: "" };

export function RecursoForm({ recurso }: { recurso?: Recurso }) {
  const [estado, accion, pendiente] = useActionState(
    recurso ? editarRecurso : guardarRecurso,
    inicial,
  );
  const error = (campo: string) => estado.errores?.[campo]?.[0];

  return (
    <form action={accion} className="mt-6 space-y-4">
      {/* Al editar, el slug identifica el recurso y no se modifica */}
      {recurso && <input type="hidden" name="slug" value={recurso.slug} />}

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          defaultValue={recurso?.nombre}
          required
        />
        {error("nombre") && (
          <p className="text-sm text-destructive">{error("nombre")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://"
          defaultValue={recurso?.url}
          required
        />
        {error("url") && (
          <p className="text-sm text-destructive">{error("url")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo</Label>
        <Select name="tipo" defaultValue={recurso?.tipo}>
          <SelectTrigger id="tipo" className="w-full">
            <SelectValue placeholder="Elige un tipo" />
          </SelectTrigger>
          <SelectContent>
            {TIPOS.map((t) => (
              <SelectItem key={t} value={t}>
                {etiquetasTipo[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error("tipo") && (
          <p className="text-sm text-destructive">{error("tipo")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          defaultValue={recurso?.descripcion}
          required
        />
        {error("descripcion") && (
          <p className="text-sm text-destructive">{error("descripcion")}</p>
        )}
      </div>

      <Button type="submit" disabled={pendiente}>
        {pendiente
          ? "Guardando..."
          : recurso
            ? "Guardar cambios"
            : "Crear recurso"}
      </Button>

      {estado.mensaje && (
        <p
          role="status"
          className={estado.ok ? "text-primary" : "text-destructive"}
        >
          {estado.mensaje}
        </p>
      )}
    </form>
  );
}
