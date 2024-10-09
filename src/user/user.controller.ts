import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserRegisterDto } from '../common/dto/user-register.dto';
import { User } from '../common/entities/user.entity';
import { UserService } from './user.service';
import { UserLoginDto } from '../common/dto/user-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  private logger: Logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @Post('register')
  register(@Body() userData: UserRegisterDto): Promise<Partial<User>> {
    this.logger.log('Received POST request on user/register');
    return this.userService.register(userData);
  }

  @Post('login')
  login(
      @Body() userData: UserLoginDto,
  ): Promise<{ access_token: string; userId: string }> {
    this.logger.log('Received POST request on user/login' + JSON.stringify(userData));
    return this.userService.login(userData);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string): Promise<Partial<User>> {
    this.logger.log('Received GET request on user/' + id);
    return this.userService.getUser(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() productData: Partial<User>,
  ): Promise<Partial<User>> {
    this.logger.log('Received PUT request on user/' + id);
    return this.userService.update(id, productData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<void> {
    this.logger.log('Received DELETE request on user/' + id);
    return this.userService.remove(id);
  }
}
