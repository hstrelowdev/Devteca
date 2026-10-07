import {
  Code2,
  Dumbbell,
  Globe,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { TipoRecurso } from "@/lib/tipos";

export type Categoria = {
  tipo: TipoRecurso;
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
};

export const categorias: Record<string, Categoria> = {
  frameworks: {
    tipo: "framework",
    titulo: "Frameworks",
    descripcion: "Frameworks y librerías para construir aplicaciones.",
    icono: Code2,
  },
  herramientas: {
    tipo: "herramienta",
    titulo: "Herramientas",
    descripcion: "Herramientas que facilitan el día a día de un developer.",
    icono: Wrench,
  },
  practicar: {
    tipo: "practica",
    titulo: "Para practicar",
    descripcion: "Ejercicios y retos para afianzar lo que aprendes.",
    icono: Dumbbell,
  },
  sitios: {
    tipo: "sitio",
    titulo: "Sitios",
    descripcion: "Sitios web con documentación, guías y rutas de aprendizaje.",
    icono: Globe,
  },
  ia: {
    tipo: "ia",
    titulo: "IA",
    descripcion: "Herramientas de inteligencia artificial para developers.",
    icono: Sparkles,
  },
};
