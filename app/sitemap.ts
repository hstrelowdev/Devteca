import type { MetadataRoute } from "next";
import { categorias } from "@/lib/categorias";
import { getRecursos } from "@/lib/recursos";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recursos = await getRecursos();

  return [
    { url: siteUrl },
    ...Object.keys(categorias).map((clave) => ({ url: `${siteUrl}/${clave}` })),
    ...recursos.map((r) => ({ url: `${siteUrl}/recursos/${r.slug}` })),
  ];
}
