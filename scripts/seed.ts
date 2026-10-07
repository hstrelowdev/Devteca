import postgres from "postgres";
import type { Recurso, TipoRecurso } from "../lib/tipos";

const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("Falta POSTGRES_URL o DATABASE_URL en .env.local");

const sql = postgres(url, { ssl: "require" });

const tipos: TipoRecurso[] = [
  "framework",
  "herramienta",
  "practica",
  "ia",
  "sitio",
];

const recursos: Recurso[] = [
  // ── Frameworks ──
  {
    slug: "vuejs",
    nombre: "Vue.js",
    tipo: "framework",
    descripcion:
      "Framework progresivo de JavaScript para construir interfaces de usuario.",
    url: "https://vuejs.org",
  },
  {
    slug: "angular",
    nombre: "Angular",
    tipo: "framework",
    descripcion:
      "Framework de Google para aplicaciones web completas con TypeScript.",
    url: "https://angular.dev",
  },
  {
    slug: "svelte",
    nombre: "Svelte",
    tipo: "framework",
    descripcion:
      "Framework que compila tus componentes a JavaScript eficiente, con poco código repetitivo.",
    url: "https://svelte.dev",
  },
  {
    slug: "astro",
    nombre: "Astro",
    tipo: "framework",
    descripcion:
      "Framework para sitios centrados en contenido que envía poco JavaScript al navegador.",
    url: "https://astro.build",
  },
  {
    slug: "nestjs",
    nombre: "NestJS",
    tipo: "framework",
    descripcion:
      "Framework de Node.js con TypeScript para construir APIs y servidores escalables.",
    url: "https://nestjs.com",
  },
  {
    slug: "express",
    nombre: "Express",
    tipo: "framework",
    descripcion:
      "Framework minimalista y muy popular para crear servidores y APIs con Node.js.",
    url: "https://expressjs.com",
  },
  {
    slug: "django",
    nombre: "Django",
    tipo: "framework",
    descripcion:
      "Framework de Python para desarrollar aplicaciones web de forma rápida y ordenada.",
    url: "https://www.djangoproject.com",
  },
  {
    slug: "fastapi",
    nombre: "FastAPI",
    tipo: "framework",
    descripcion:
      "Framework de Python moderno y rápido para crear APIs, con documentación automática.",
    url: "https://fastapi.tiangolo.com",
  },

  // ── Herramientas ──
  {
    slug: "git",
    nombre: "Git",
    tipo: "herramienta",
    descripcion:
      "Sistema de control de versiones distribuido para seguir los cambios de tu código.",
    url: "https://git-scm.com",
  },
  {
    slug: "docker",
    nombre: "Docker",
    tipo: "herramienta",
    descripcion:
      "Plataforma para empaquetar y ejecutar aplicaciones en contenedores.",
    url: "https://www.docker.com",
  },
  {
    slug: "vscode",
    nombre: "Visual Studio Code",
    tipo: "herramienta",
    descripcion:
      "Editor de código gratuito de Microsoft con extensiones para casi cualquier lenguaje.",
    url: "https://code.visualstudio.com",
  },
  {
    slug: "postman",
    nombre: "Postman",
    tipo: "herramienta",
    descripcion:
      "Herramienta para probar, documentar y automatizar peticiones a APIs.",
    url: "https://www.postman.com",
  },
  {
    slug: "figma",
    nombre: "Figma",
    tipo: "herramienta",
    descripcion:
      "Herramienta de diseño colaborativo de interfaces y prototipos en el navegador.",
    url: "https://www.figma.com",
  },
  {
    slug: "typescript",
    nombre: "TypeScript",
    tipo: "herramienta",
    descripcion:
      "Superconjunto de JavaScript con tipos estáticos que ayuda a detectar errores antes de ejecutar.",
    url: "https://www.typescriptlang.org",
  },
  {
    slug: "supabase",
    nombre: "Supabase",
    tipo: "herramienta",
    descripcion:
      "Plataforma con base de datos PostgreSQL, autenticación y almacenamiento para tus proyectos.",
    url: "https://supabase.com",
  },
  {
    slug: "vercel",
    nombre: "Vercel",
    tipo: "herramienta",
    descripcion:
      "Plataforma para desplegar sitios y aplicaciones web, creadora de Next.js.",
    url: "https://vercel.com",
  },
  {
    slug: "regex101",
    nombre: "regex101",
    tipo: "herramienta",
    descripcion:
      "Probador de expresiones regulares con explicación paso a paso de cada parte.",
    url: "https://regex101.com",
  },
  {
    slug: "excalidraw",
    nombre: "Excalidraw",
    tipo: "herramienta",
    descripcion:
      "Pizarra virtual para dibujar diagramas y esquemas con aspecto de boceto a mano.",
    url: "https://excalidraw.com",
  },

  // ── Práctica ──
  {
    slug: "leetcode",
    nombre: "LeetCode",
    tipo: "practica",
    descripcion:
      "Problemas de algoritmos y estructuras de datos, muy usados para preparar entrevistas técnicas.",
    url: "https://leetcode.com",
  },
  {
    slug: "the-odin-project",
    nombre: "The Odin Project",
    tipo: "practica",
    descripcion:
      "Currículo gratuito y de código abierto para aprender desarrollo web full stack.",
    url: "https://www.theodinproject.com",
  },
  {
    slug: "javascript30",
    nombre: "JavaScript30",
    tipo: "practica",
    descripcion:
      "30 proyectos en 30 días para practicar JavaScript sin frameworks, con videos guiados.",
    url: "https://javascript30.com",
  },
  {
    slug: "flexbox-froggy",
    nombre: "Flexbox Froggy",
    tipo: "practica",
    descripcion:
      "Juego para aprender CSS Flexbox ayudando a unas ranas a llegar a sus hojas.",
    url: "https://flexboxfroggy.com",
  },
  {
    slug: "css-grid-garden",
    nombre: "CSS Grid Garden",
    tipo: "practica",
    descripcion:
      "Juego para aprender CSS Grid cultivando un jardín de zanahorias.",
    url: "https://cssgridgarden.com",
  },
  {
    slug: "learn-git-branching",
    nombre: "Learn Git Branching",
    tipo: "practica",
    descripcion:
      "Tutorial visual e interactivo para entender ramas y comandos de Git.",
    url: "https://learngitbranching.js.org",
  },
  {
    slug: "sqlbolt",
    nombre: "SQLBolt",
    tipo: "practica",
    descripcion: "Lecciones interactivas cortas para aprender SQL desde cero.",
    url: "https://sqlbolt.com",
  },

  // ── IA ──
  {
    slug: "claude",
    nombre: "Claude",
    tipo: "ia",
    descripcion:
      "Asistente de IA de Anthropic para escribir, explicar y depurar código.",
    url: "https://claude.ai",
  },
  {
    slug: "chatgpt",
    nombre: "ChatGPT",
    tipo: "ia",
    descripcion:
      "Asistente conversacional de OpenAI para programar, resumir y resolver dudas.",
    url: "https://chatgpt.com",
  },
  {
    slug: "gemini",
    nombre: "Gemini",
    tipo: "ia",
    descripcion:
      "Asistente de IA de Google para chat, análisis de documentos y código.",
    url: "https://gemini.google.com",
  },
  {
    slug: "cursor",
    nombre: "Cursor",
    tipo: "ia",
    descripcion:
      "Editor de código basado en VS Code con asistentes de IA integrados.",
    url: "https://cursor.com",
  },
  {
    slug: "hugging-face",
    nombre: "Hugging Face",
    tipo: "ia",
    descripcion:
      "Plataforma con modelos, datasets y demos de IA de código abierto.",
    url: "https://huggingface.co",
  },

  // ── Sitios ──
  {
    slug: "stack-overflow",
    nombre: "Stack Overflow",
    tipo: "sitio",
    descripcion: "Comunidad de preguntas y respuestas sobre programación.",
    url: "https://stackoverflow.com",
  },
  {
    slug: "github",
    nombre: "GitHub",
    tipo: "sitio",
    descripcion:
      "Plataforma para alojar repositorios Git, colaborar y publicar proyectos de código abierto.",
    url: "https://github.com",
  },
  {
    slug: "javascript-info",
    nombre: "JavaScript.info",
    tipo: "sitio",
    descripcion:
      "Tutorial moderno y detallado de JavaScript, desde lo básico hasta lo avanzado.",
    url: "https://javascript.info",
  },
  {
    slug: "web-dev",
    nombre: "web.dev",
    tipo: "sitio",
    descripcion:
      "Guías y buenas prácticas de Google sobre rendimiento, accesibilidad y desarrollo web.",
    url: "https://web.dev",
  },
  {
    slug: "css-tricks",
    nombre: "CSS-Tricks",
    tipo: "sitio",
    descripcion:
      "Artículos y guías de referencia sobre CSS y desarrollo frontend.",
    url: "https://css-tricks.com",
  },
  {
    slug: "refactoring-guru",
    nombre: "Refactoring.Guru",
    tipo: "sitio",
    descripcion:
      "Explicaciones ilustradas de patrones de diseño y refactorización de código.",
    url: "https://refactoring.guru",
  },
  {
    slug: "free-for-dev",
    nombre: "free-for.dev",
    tipo: "sitio",
    descripcion: "Lista de servicios con plan gratuito útiles para developers.",
    url: "https://free-for.dev",
  },
];

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS tipos (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL UNIQUE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS recursos (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      nombre TEXT NOT NULL,
      tipo_id INT NOT NULL REFERENCES tipos(id),
      descripcion TEXT NOT NULL,
      url TEXT NOT NULL,
      imagen_url TEXT,
      extra JSONB NOT NULL DEFAULT '{}',
      creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  for (const nombre of tipos) {
    await sql`
      INSERT INTO tipos (nombre) VALUES (${nombre})
      ON CONFLICT (nombre) DO NOTHING
    `;
  }

  for (const r of recursos) {
    await sql`
      INSERT INTO recursos (slug, nombre, tipo_id, descripcion, url, imagen_url, extra)
      VALUES (
        ${r.slug},
        ${r.nombre},
        (SELECT id FROM tipos WHERE nombre = ${r.tipo}),
        ${r.descripcion},
        ${r.url},
        ${r.imagenUrl ?? null},
        ${JSON.stringify(r.extra ?? {})}::jsonb
      )
      ON CONFLICT (slug) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        tipo_id = EXCLUDED.tipo_id,
        descripcion = EXCLUDED.descripcion,
        url = EXCLUDED.url,
        imagen_url = EXCLUDED.imagen_url,
        extra = EXCLUDED.extra
    `;
  }

  const [{ total }] = await sql`SELECT count(*)::int AS total FROM recursos`;
  console.log(`Listo: ${total} recursos en la base de datos.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
