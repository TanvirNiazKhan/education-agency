import { registerAs } from '@nestjs/config';

function parseUrl(url: string) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: parseInt(u.port || '5432', 10),
    username: u.username,
    password: u.password,
    database: u.pathname.replace(/^\//, ''),
  };
}

export default registerAs('database', () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const fromUrl = process.env.DATABASE_URL ? parseUrl(process.env.DATABASE_URL) : null;

  return {
    type: 'postgres' as const,
    host: fromUrl?.host ?? process.env.DB_HOST ?? 'localhost',
    port: fromUrl?.port ?? parseInt(process.env.DB_PORT || '5432', 10),
    username: fromUrl?.username ?? process.env.DB_USERNAME ?? 'postgres',
    password: fromUrl?.password ?? process.env.DB_PASSWORD ?? 'postgres',
    database: fromUrl?.database ?? process.env.DB_DATABASE ?? 'education_agency',
    synchronize: !isProduction,
    logging: !isProduction,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
});
