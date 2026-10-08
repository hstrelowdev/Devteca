import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { Pencil, Plus } from "lucide-react";
import { auth, signIn, signOut } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BtnDelete } from "@/components/my/BtnDelete";
import { Pagination } from "@/components/my/Pagination";
import { leerPaginacion, paginar } from "@/lib/paginacion";
import { listarRecursosConEstado } from "@/lib/recursos";
import { etiquetasTipo } from "@/lib/tipos";

export const metadata = { title: "Administración" };

type Props = {
  searchParams: Promise<{ page?: string; por?: string; error?: string }>;
};

export default async function AdminPage({ searchParams }: Props) {
  const sp = await searchParams;
  const session = await auth();

  /* ---------- Sin sesión: formulario de acceso ---------- */
  if (!session?.user) {
    async function entrar(formData: FormData) {
      "use server";
      try {
        await signIn("credentials", {
          usuario: formData.get("usuario"),
          password: formData.get("password"),
          redirect: false,
        });
      } catch (e) {
        if (e instanceof AuthError) redirect("/admin?error=1");
        throw e;
      }
      redirect("/admin");
    }

    return (
      <div className="mx-auto max-w-sm">
        <h1 className="text-2xl font-bold">Administración</h1>
        <form action={entrar} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usuario">Usuario</Label>
            <Input
              id="usuario"
              name="usuario"
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {sp.error && (
            <p role="alert" className="text-sm text-destructive">
              Usuario o contraseña incorrectos.
            </p>
          )}
          <Button type="submit">Entrar</Button>
        </form>
      </div>
    );
  }

  /* ---------- Con sesión: lista de recursos ---------- */
  const recursos = await listarRecursosConEstado();
  const { pagina, por } = leerPaginacion(sp);
  const p = paginar(recursos, pagina, por);

  async function salir() {
    "use server";
    await signOut({ redirectTo: "/admin" });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Administración</h1>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/admin/nuevo">
              <Plus aria-hidden="true" />
              Nuevo
            </Link>
          </Button>
          <form action={salir}>
            <Button type="submit" size="sm" variant="outline">
              Salir
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="py-2 pr-4 font-medium">Nombre</th>
              <th className="py-2 pr-4 font-medium">Tipo</th>
              <th className="py-2 pr-4 font-medium">Estado</th>
              <th className="py-2 font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {p.items.map((r) => (
              <tr key={r.slug} className="border-b">
                <td className="py-2 pr-4">{r.nombre}</td>
                <td className="py-2 pr-4">{etiquetasTipo[r.tipo]}</td>
                <td className="py-2 pr-4">
                  <Badge variant="secondary">{r.estado}</Badge>
                </td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/editar/${r.slug}`}>
                        <Pencil aria-hidden="true" />
                        Editar
                      </Link>
                    </Button>
                    <BtnDelete slug={r.slug} nombre={r.nombre} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination base="/admin" {...p} />
    </div>
  );
}
