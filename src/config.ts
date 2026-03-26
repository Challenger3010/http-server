import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  fileserverHits: number;
  port: number;
  platform: string;
};

type DBConfig = {
  url: string;
  migrationsConfig: MigrationConfig;
};

process.loadEnvFile(".env");

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
  api: {
    fileserverHits: 0,
    port: Number(getEnv("PORT")),
    platform: getEnv("PLATFORM"),
  },
  db: {
    url: getEnv("DB_URL"),
    migrationsConfig: migrationConfig,
  },
};

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env variable: ${key}`);
  return value;
}
