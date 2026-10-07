"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = e.target.value.trim();
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      if (!valor && pathname !== "/buscar") return;

      const url = valor ? `/buscar?q=${encodeURIComponent(valor)}` : "/buscar";
      if (pathname === "/buscar") router.replace(url);
      else router.push(url);
    }, 300);
  }

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        aria-label="Buscar recursos"
        placeholder="Buscar recursos..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={handleChange}
        className="pl-8"
      />
    </div>
  );
}