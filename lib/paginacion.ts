export const OPCIONES_POR_PAGINA = [6, 12, 24, 48] as const;
export const POR_PAGINA_DEFECTO = 12;

export function leerPaginacion(params: { page?: string; por?: string }) {
  const por =
    OPCIONES_POR_PAGINA.find((o) => String(o) === params.por) ??
    POR_PAGINA_DEFECTO;
  const pagina = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  return { pagina, por };
}

export function paginar<T>(items: T[], pagina: number, por: number) {
  const total = items.length;
  const totalPaginas = Math.max(1, Math.ceil(total / por));
  const actual = Math.min(pagina, totalPaginas);
  const inicio = (actual - 1) * por;

  return {
    items: items.slice(inicio, inicio + por),
    total,
    pagina: actual,
    totalPaginas,
    por,
  };
}
