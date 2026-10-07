import { getRecursosPorTipo } from "@/lib/recursos";

export default async function FrameworksPage() {
  const recursos = await getRecursosPorTipo("framework");

  return (
    <div>
      <h1 className="text-2xl font-bold">Frameworks</h1>
      <ul className="mt-4 space-y-2">
        {recursos.map((r) => (
          <li key={r.slug}>
            <a href={r.url} className="font-medium underline">
              {r.nombre}
            </a>
            <p className="text-sm text-muted-foreground">{r.descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
