import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sql } from "@/lib/db";

const esquemaLogin = z.object({
  usuario: z.string().min(1),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { usuario: {}, password: {} },
      async authorize(credentials) {
        const parsed = esquemaLogin.safeParse(credentials);
        if (!parsed.success) return null;

        const { usuario, password } = parsed.data;
        const filas = await sql<
          { id: number; usuario: string; password_hash: string }[]
        >`
          SELECT id, usuario, password_hash
          FROM usuarios
          WHERE usuario = ${usuario.trim().toLowerCase()} AND rol = 'admin'
          LIMIT 1
        `;

        const u = filas[0];
        if (!u) return null;

        const coincide = await bcrypt.compare(password, u.password_hash);
        return coincide ? { id: String(u.id), name: u.usuario } : null;
      },
    }),
  ],
});
