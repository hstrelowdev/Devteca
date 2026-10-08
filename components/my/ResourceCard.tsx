import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { etiquetasTipo, type Recurso } from "@/lib/tipos";

export function ResourceCard({ recurso }: { recurso: Recurso }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Badge variant="secondary" className="w-fit">
          {etiquetasTipo[recurso.tipo]}
        </Badge>
        <CardTitle>
          <Link href={`/recursos/${recurso.slug}`} className="hover:underline">
            {recurso.nombre}
          </Link>
        </CardTitle>
        <CardDescription>{recurso.descripcion}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1" />
      <CardFooter>
        <Button asChild variant="outline" size="sm">
          <a href={recurso.url} target="_blank" rel="noopener noreferrer">
            Visitar
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
            <ExternalLink aria-hidden="true" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
