import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OPCIONES_POR_PAGINA, POR_PAGINA_DEFECTO } from "@/lib/paginacion";

type Props = {
  base: string;
  extra?: Record<string, string | undefined>;
  pagina: number;
  totalPaginas: number;
  por: number;
  total: number;
};

function href(
  base: string,
  extra: Record<string, string | undefined>,
  pagina: number,
  por: number,
) {
  const params = new URLSearchParams();
  for (const [clave, valor] of Object.entries(extra)) {
    if (valor) params.set(clave, valor);
  }
  if (por !== POR_PAGINA_DEFECTO) params.set("por", String(por));
  if (pagina > 1) params.set("page", String(pagina));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

// Ejemplo: 1 … 4 5 6 … 20
function rango(actual: number, total: number): (number | "…")[] {
  const paginas = new Set([1, total, actual - 1, actual, actual + 1]);
  const orden = [...paginas]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const resultado: (number | "…")[] = [];
  orden.forEach((n, i) => {
    if (i > 0 && n - orden[i - 1] > 1) resultado.push("…");
    resultado.push(n);
  });
  return resultado;
}

export function Paginador({
  base,
  extra = {},
  pagina,
  totalPaginas,
  por,
  total,
}: Props) {
  if (total <= OPCIONES_POR_PAGINA[0]) return null;

  const desde = (pagina - 1) * por + 1;
  const hasta = Math.min(pagina * por, total);

  return (
    <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-muted-foreground">
        Mostrando {desde}–{hasta} de {total}
      </p>

      <nav
        aria-label="Paginación"
        className="flex flex-wrap items-center gap-1"
      >
        {pagina > 1 ? (
          <Button asChild variant="outline" size="sm">
            <Link href={href(base, extra, pagina - 1, por)}>
              <ChevronLeft />
              Anterior
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft />
            Anterior
          </Button>
        )}

        {rango(pagina, totalPaginas).map((n, i) =>
          n === "…" ? (
            <span key={`e${i}`} className="px-2 text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={n}
              asChild
              size="sm"
              variant={n === pagina ? "default" : "ghost"}
            >
              <Link
                href={href(base, extra, n, por)}
                aria-current={n === pagina ? "page" : undefined}
              >
                {n}
              </Link>
            </Button>
          ),
        )}

        {pagina < totalPaginas ? (
          <Button asChild variant="outline" size="sm">
            <Link href={href(base, extra, pagina + 1, por)}>
              Siguiente
              <ChevronRight />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Siguiente
            <ChevronRight />
          </Button>
        )}
      </nav>

      <div className="flex items-center gap-1 text-sm">
        <span className="mr-1 text-muted-foreground">Por página:</span>
        {OPCIONES_POR_PAGINA.map((o) => (
          <Button
            key={o}
            asChild
            size="sm"
            variant={o === por ? "secondary" : "ghost"}
          >
            <Link href={href(base, extra, 1, o)}>{o}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
