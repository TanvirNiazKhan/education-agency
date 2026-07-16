import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findAllAdmins(): Promise<User[]> {
    return this.userRepository.findByRoles([
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
    ]);
  }

  async create(data: Partial<User>): Promise<User> {
    return this.userRepository.create(data);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.userRepository.update(id, data) as Promise<User>;
  }

  async activate(id: string): Promise<User> {
    const user = await this.findById(id);
    return this.userRepository.setActive(user.id, true) as Promise<User>;
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findById(id);
    return this.userRepository.setActive(user.id, false) as Promise<User>;
  }
}
