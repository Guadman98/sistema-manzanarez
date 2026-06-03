import { Injectable, ConflictException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  async seedAdmin() {
    const adminDoc = 'admin100';
    const adminExists = await this.userRepository.findOne({ where: { documento_identidad: adminDoc } });

    if (!adminExists) {
      const passwordHash = await bcrypt.hash('AdminLiceo2026!', 10);
      const admin = this.userRepository.create({
        documento_identidad: adminDoc,
        password_hash: passwordHash,
        nombre: 'Administrador',
        apellidos: 'Liceo Manzanarez',
        email: 'admin@liceomanzanarez.edu.co',
        telefono: '3001234567',
        role: Role.ADMIN,
        isActive: true,
      });
      await this.userRepository.save(admin);
      console.log('✅ Administrador semilla creado correctamente (admin100)');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { documento_identidad, password, ...rest } = createUserDto;

    const exists = await this.userRepository.findOne({ where: { documento_identidad } });
    if (exists) {
      throw new ConflictException(`El usuario con documento '${documento_identidad}' ya está registrado.`);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      ...rest,
      documento_identidad,
      password_hash: passwordHash,
    });

    const savedUser = await this.userRepository.save(user);
    const result = { ...savedUser };
    delete (result as any).password_hash;
    return result;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      order: { apellidos: 'ASC', nombre: 'ASC' },
    });
    return users.map(user => {
      const u = { ...user };
      delete (u as any).password_hash;
      return u;
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
    }
    const result = { ...user };
    delete (result as any).password_hash;
    return result;
  }

  async findByDocument(documento_identidad: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { documento_identidad } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
    }
    const { password, ...rest } = updateUserDto;

    if (password) {
      user.password_hash = await bcrypt.hash(password, 10);
    }

    Object.assign(user, rest);
    const updatedUser = await this.userRepository.save(user);
    const result = { ...updatedUser };
    delete (result as any).password_hash;
    return result;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
    }
    user.isActive = false; // Borrado lógico
    await this.userRepository.save(user);
  }
}
