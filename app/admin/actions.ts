"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import {
  actualizarRecurso,
  crearRecurso,
  eliminarRecurso,
} from "@/lib/recursos";
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

// Las Server Actions son endpoints públicos: cada una valida la sesión.
async function haySesion() {
  return Boolean((await auth())?.user);
}

export async function guardarRecurso(
  _anterior: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  if (!(await haySesion())) return { ok: false, mensaje: "No autorizado." };

  const resultado = esquema.safeParse(Object.fromEntries(formData));
  if (!resultado.success) {
    return {
      ok: false,
      mensaje: "Revisa los campos marcados.",
      errores: resultado.error.flatten().fieldErrors,
    };
  }

  try {
    const { ok } = await crearRecurso(resultado.data);
    if (!ok) {
      return { ok: false, mensaje: "Ya existe un recurso con ese nombre." };
    }
  } catch {
    return { ok: false, mensaje: "No se pudo guardar. Inténtalo más tarde." };
  }
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function editarRecurso(
  _anterior: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  if (!(await haySesion())) return { ok: false, mensaje: "No autorizado." };

  const slug = String(formData.get("slug") ?? "");
  const resultado = esquema.safeParse(Object.fromEntries(formData));
  if (!slug || !resultado.success) {
    return {
      ok: false,
      mensaje: "Revisa los campos marcados.",
      errores: resultado.success
        ? undefined
        : resultado.error.flatten().fieldErrors,
    };
  }

  try {
    const { ok } = await actualizarRecurso(slug, resultado.data);
    if (!ok) return { ok: false, mensaje: "El recurso ya no existe." };
  } catch {
    return { ok: false, mensaje: "No se pudo guardar. Inténtalo más tarde." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function eliminarRecursoAction(formData: FormData) {
  if (!(await haySesion())) return;

  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  await eliminarRecurso(slug);
  revalidatePath("/", "layout");
  redirect("/admin");
}
