"use server";

import { z } from "zod";
import { proponerRecurso } from "@/lib/recursos";
import { TIPOS } from "@/lib/tipos";

function esUrlHttp(valor: string) {
  try {
    const u = new URL(valor);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const esquema = z.object({
  nombre: z.string().trim().min(2, "Mínimo 2 caracteres").max(80, "Máximo 80"),
  url: z
    .string()
    .trim()
    .refine(esUrlHttp, "Escribe una URL válida que empiece con https://"),
  tipo: z.enum(TIPOS, { message: "Elige un tipo" }),
  descripcion: z
    .string()
    .trim()
    .min(10, "Mínimo 10 caracteres")
    .max(200, "Máximo 200"),
});

export type EstadoForm = {
  ok: boolean;
  mensaje: string;
  errores?: Record<string, string[] | undefined>;
};

export async function proponer(
  _anterior: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  // Campo trampa: los humanos no lo ven; los bots suelen rellenarlo
  if (formData.get("web")) {
    return { ok: true, mensaje: "¡Gracias! Revisaré tu propuesta pronto." };
  }

  const resultado = esquema.safeParse(Object.fromEntries(formData));
  if (!resultado.success) {
    return {
      ok: false,
      mensaje: "Revisa los campos marcados.",
      errores: resultado.error.flatten().fieldErrors,
    };
  }

  try {
    const { ok } = await proponerRecurso(resultado.data);
    if (!ok) {
      return {
        ok: false,
        mensaje: "Ya existe un recurso con un nombre muy parecido.",
      };
    }
    return { ok: true, mensaje: "¡Gracias! Revisaré tu propuesta pronto." };
  } catch {
    return { ok: false, mensaje: "No se pudo guardar. Inténtalo más tarde." };
  }
}
