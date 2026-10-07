import "server-only";
import postgres from "postgres";

const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("Falta POSTGRES_URL o DATABASE_URL");

const globalForDb = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>;
};

export const sql =
  globalForDb.sql ?? postgres(url, { ssl: "require", prepare: false, max: 5 });

if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;
