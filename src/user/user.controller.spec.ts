import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRegisterDto } from '../common/dto/user-register.dto';
import { UserLoginDto } from '../common/dto/user-login.dto';
import { User } from '../common/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

jest.mock('./user.service');

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        UserService,
        JwtAuthGuard,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData: UserRegisterDto = {
        username: 'testUser',
        email: 'test@example.com',
        password: 'testPassword',
      };

      const expectedResponse: Partial<User> = {
        username: 'testUser',
        email: 'test@example.com',
        password: 'testPassword',
      };

      userService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(userData);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('should login and return access token', async () => {
      const userData: UserLoginDto = {
        username: 'testUser',
        password: 'testPassword',
      };

      const expectedResponse: { access_token: string; userId: string } = {
        access_token: 'mockedAccessToken',
        userId: '1',
      };

      userService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(userData);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getUser', () => {
    it('should get user by ID', async () => {
      const userId = 'mockedUserId';

      const expectedResponse: Partial<User> = {
        username: 'testUser',
        email: 'test@example.com',
      };

      userService.getUser.mockResolvedValue(expectedResponse);

      const result = await controller.getUser(userId);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('update', () => {
    it('should update user by ID', async () => {
      const userId = 'mockedUserId';

      const updateUser: Partial<User> = {
        username: 'testUser',
        email: 'test@example.com',
      };

      const expectedResponse: User = {
        age: 0,
        bestScore: 0,
        name: "",
        player: undefined,
        role: undefined,
        id: '',
        password: '',
        salt: '',
        username: 'testUser',
        email: 'test@example.com'
      };

      userService.update.mockResolvedValue(expectedResponse);

      const result = await controller.update(userId, updateUser);

      delete expectedResponse.password;
      delete expectedResponse.salt;
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('remove', () => {
    it('should remove user by ID', async () => {
      const userId = 'mockedUserId';

      userService.remove.mockResolvedValue(null);

      const result = await controller.remove(userId);

      expect(result).toBeNull();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
