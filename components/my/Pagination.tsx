import { Button } from "@/components/ui/button";
import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
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

export function Pagination({
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
  const esPrimera = pagina <= 1;
  const esUltima = pagina >= totalPaginas;

  return (
    <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-muted-foreground">
        Mostrando {desde}–{hasta} de {total}
      </p>

      <PaginationUI aria-label="Paginación" className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={href(base, extra, Math.max(1, pagina - 1), por)}
              text="Anterior"
              aria-disabled={esPrimera}
              tabIndex={esPrimera ? -1 : undefined}
              className={
                esPrimera ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>

          {rango(pagina, totalPaginas).map((n, i) => (
            <PaginationItem key={n === "…" ? `e${i}` : n}>
              {n === "…" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={href(base, extra, n, por)}
                  isActive={n === pagina}
                >
                  {n}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={href(base, extra, Math.min(totalPaginas, pagina + 1), por)}
              text="Siguiente"
              aria-disabled={esUltima}
              tabIndex={esUltima ? -1 : undefined}
              className={
                esUltima ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationUI>

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
