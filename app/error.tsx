"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold">Algo salió mal</h1>
      <p className="mt-2 text-muted-foreground">
        No pude cargar los recursos. Inténtalo de nuevo.
      </p>
      <Button className="mt-6" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
