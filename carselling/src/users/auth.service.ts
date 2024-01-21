import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async signup(email: string, password: string) {
    const users = await this.userService.findByEmail(email);

    if (users.length) {
      throw new BadRequestException('this email is already in used');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash;
    const newUser = await this.userService.createUser(email, result);
    return newUser;
  }
  async signIn(email: string, password: string) {
    const [user] = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('user with this email is not found');
    }
    const [salt, storedHash] = user.password.split('.');
    const newHash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== newHash.toString('hex')) {
      throw new BadRequestException('the password is incorrect');
    }
    return user;
  }
}
