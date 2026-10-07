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
import { proponer, type EstadoForm } from "@/app/proponer/actions";
import { TIPOS, etiquetasTipo } from "@/lib/tipos";

const inicial: EstadoForm = { ok: false, mensaje: "" };

export function ProponerForm() {
  const [estado, accion, pendiente] = useActionState(proponer, inicial);
  const error = (campo: string) => estado.errores?.[campo]?.[0];

  return (
    <form action={accion} className="mt-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" required />
        {error("nombre") && (
          <p className="text-sm text-destructive">{error("nombre")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input id="url" name="url" type="url" placeholder="https://" required />
        {error("url") && (
          <p className="text-sm text-destructive">{error("url")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo</Label>
        <Select name="tipo">
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
        <Textarea id="descripcion" name="descripcion" rows={3} required />
        {error("descripcion") && (
          <p className="text-sm text-destructive">{error("descripcion")}</p>
        )}
      </div>

      {/* Campo trampa anti-spam */}
      <input
        name="web"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <Button type="submit" disabled={pendiente}>
        {pendiente ? "Enviando..." : "Proponer recurso"}
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
