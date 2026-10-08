"use server";

<<<<<<< ours
import { z } from "zod";
import { proponerRecurso } from "@/lib/recursos";
=======
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import {
  actualizarRecurso,
  crearRecurso,
  eliminarRecurso,
} from "@/lib/recursos";
>>>>>>> theirs
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

<<<<<<< ours
export async function proponer(
  _anterior: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  // Campo trampa: los humanos no lo ven; los bots suelen rellenarlo
  if (formData.get("web")) {
    return { ok: true, mensaje: "¡Gracias! Revisaré tu propuesta pronto." };
  }
=======
export async function guardarRecurso(
  _anterior: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const session = await auth();
  if (!session) return { ok: false, mensaje: "No autorizado." };
>>>>>>> theirs

  const resultado = esquema.safeParse(Object.fromEntries(formData));
  if (!resultado.success) {
    return {
      ok: false,
      mensaje: "Revisa los campos marcados.",
      errores: resultado.error.flatten().fieldErrors,
    };
  }

  try {
<<<<<<< ours
    const { ok } = await proponerRecurso(resultado.data);
=======
    const { ok } = await crearRecurso(resultado.data);
>>>>>>> theirs
    if (!ok) {
      return {
        ok: false,
        mensaje: "Ya existe un recurso con un nombre muy parecido.",
      };
    }
<<<<<<< ours
    return { ok: true, mensaje: "¡Gracias! Revisaré tu propuesta pronto." };
=======
    revalidatePath("/", "layout");
    return { ok: true, mensaje: "Recurso publicado." };
>>>>>>> theirs
  } catch {
    return { ok: false, mensaje: "No se pudo guardar. Inténtalo más tarde." };
  }
}
<<<<<<< ours
=======

export async function editarRecurso(
  _anterior: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const session = await auth();
  if (!session) return { ok: false, mensaje: "No autorizado." };

  const slug = String(formData.get("slug") ?? "");
  const resultado = esquema.safeParse(Object.fromEntries(formData));
  if (!resultado.success) {
    return {
      ok: false,
      mensaje: "Revisa los campos marcados.",
      errores: resultado.error.flatten().fieldErrors,
    };
  }

  let encontrado = false;
  try {
    encontrado = (await actualizarRecurso(slug, resultado.data)).ok;
  } catch {
    return { ok: false, mensaje: "No se pudo guardar. Inténtalo más tarde." };
  }
  if (!encontrado) return { ok: false, mensaje: "El recurso ya no existe." };

  revalidatePath("/", "layout");
  redirect("/admin"); // fuera del try: redirect lanza una excepción interna
}

export async function eliminarRecursoAction(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("No autorizado");

  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  await eliminarRecurso(slug);
  revalidatePath("/", "layout");
}
>>>>>>> theirs
