import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRegisterDto } from '../common/dto/user-register.dto';
import { Repository } from 'typeorm';
import { User } from '../common/entities/user.entity';
//import * as bcrypt from 'bcrypt';
import { UserLoginDto } from '../common/dto/user-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(userData: UserRegisterDto): Promise<Partial<User>> {
    const user = this.userRepository.create({
      ...userData,
    });

    // had to fix bcrypt problem
    //user.password = await bcrypt.hash(user.password, 10);

    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new Error(e);
    }

    delete userData.password;
    return userData;
  }

  async login(
    userData: UserLoginDto,
  ): Promise<{ access_token: string; userId: string }> {
    const user = await this.userRepository.findOneBy({
      username: userData.username,
    });

    if (!user) {
      throw new NotFoundException('wrong username or password');
    }

    // had to fix bcrypt problem
    /*if (!(await bcrypt.compare(userData.password, user.password))) {
      throw new NotFoundException('wrong username or password');
    }*/
    if (userData.password !== user.password) {
      throw new NotFoundException('wrong username or password');
    }

    const payload = {
      username: userData.username,
      email: user.email,
    };
    const jwt = this.jwtService.sign(payload);
    return {
      access_token: jwt,
      userId: user.id,
    };
  }

  async getUser(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart.cartItems.product', 'reviews'],
    });

    if (!user) {
      throw new NotFoundException('id not found');
    }

    delete user.salt;
    delete user.password;
    return user;
  }

  async update(
    id: string,
    userData: Partial<User>,
  ): Promise<Partial<User>> {
    const oldData = await this.userRepository.findOneBy({ id: id });
    const newData = { ...oldData, ...userData };

    await this.userRepository.update(id, newData);

    delete newData.password;
    delete newData.salt;
    return newData;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
