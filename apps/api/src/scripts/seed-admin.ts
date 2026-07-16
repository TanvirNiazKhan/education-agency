import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User, UserRole } from '../modules/users/entities/user.entity';

dotenv.config();

const dbConfig = process.env.DATABASE_URL
  ? {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      entities: [User],
      synchronize: false,
    }
  : {
      type: 'postgres' as const,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'education_agency',
      entities: [User],
      synchronize: false,
    };

const dataSource = new DataSource(dbConfig);

async function seed() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);

  const email = process.env.SUPER_ADMIN_EMAIL || 'admin@meridian.com';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'Admin123!';

  const existing = await userRepo.findOne({ where: { email } });
  const hashed = await bcrypt.hash(password, 12);

  if (!existing) {
    const admin = userRepo.create({
      first_name: process.env.SUPER_ADMIN_FIRST_NAME || 'Super',
      last_name: process.env.SUPER_ADMIN_LAST_NAME || 'Admin',
      email,
      phone: '',
      password: hashed,
      role: UserRole.SUPER_ADMIN,
    });
    await userRepo.save(admin);
    console.log(`Super admin created: ${email}`);
  } else {
    existing.role = UserRole.SUPER_ADMIN;
    existing.password = hashed;
    await userRepo.save(existing);
    console.log(`Existing user updated to SUPER_ADMIN: ${email}`);
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
