import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { serializeDecorator } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { createUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from 'src/user.entity';
import { AuthenticationGuard } from 'src/guards/authenticationGuard';

@Controller('auth')
@serializeDecorator(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthenticationGuard)
  whoAmI(@CurrentUser() user: UserEntity) {
    return user.email;
  }
  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }
  @Post('/signup')
  async createUser(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);

    session.userId = user.id;
    return user;
  }
  @Post('/signin')
  async signInUser(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);

    session.userId = user.id;
    return user;
  }
  @Get('/users')
  findAll() {
    return this.userService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException(
        `the user you are looking for with id ${id} does not exist`,
      );
    }
    return user;
  }
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
