export interface DatabaseRunResult {
  changes: number;
  lastInsertRowid: number | bigint;
}

export interface DatabaseAdapter {
  exec(sql: string): void;

  run(
    sql: string,
    ...params: unknown[]
  ): DatabaseRunResult;

  get<T = unknown>(
    sql: string,
    ...params: unknown[]
  ): T | undefined;

  all<T = unknown>(
    sql: string,
    ...params: unknown[]
  ): T[];

  transaction<T>(callback: () => T): T;

  close(): void;
}
