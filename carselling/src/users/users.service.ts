import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}
  createUser(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }
  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne({ where: { id } });
  }
  findAll() {
    return this.repo.find();
  }
  findByEmail(email: string) {
    return this.repo.find({ where: { email } });
  }
  async update(id: number, attrs: Partial<UserEntity>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('the user with this id does not exist');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(
        'the user you are trying to delete does not exist',
      );
    }
    return this.repo.remove(user);
  }
}
