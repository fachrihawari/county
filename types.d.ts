
declare module "bun" {
  interface Env {
    DB_PATH: string;
    BUN_ENV: string;
  }
}
