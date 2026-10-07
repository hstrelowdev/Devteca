import postgres from "postgres";
import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("Falta POSTGRES_URL o DATABASE_URL");

const sql = postgres(url, { ssl: "require", prepare: false });

const rl = createInterface({ input, output });
const usuario = (await rl.question("Usuario: ")).trim().toLowerCase();
const password = await rl.question("Contraseña (mínimo 12 caracteres): ");
rl.close();

if (usuario.length < 3 || password.length < 12) {
  console.error("Usuario de 3+ caracteres y contraseña de 12+ caracteres.");
  await sql.end();
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

await sql`
  INSERT INTO usuarios (usuario, password_hash, rol)
  VALUES (${usuario}, ${hash}, 'admin')
  ON CONFLICT (usuario) DO UPDATE SET password_hash = EXCLUDED.password_hash
`;

console.log(`Usuario admin «${usuario}» listo.`);
await sql.end();
