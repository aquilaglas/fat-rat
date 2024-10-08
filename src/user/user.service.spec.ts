import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { UserEntity } from '../common/entities/user.entity';
import { UserRegisterDto } from '../common/dto/user-register.dto';
import { UserLoginDto } from '../common/dto/user-login.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<Repository<UserEntity>>;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepositoryMock = module.get(getRepositoryToken(UserEntity));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jwtServiceMock = module.get<JwtService>(JwtService);
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

      //const hashedPassword = 'hashedPassword';
      const accessToken = 'mockedAccessToken';

      /*jest
        .spyOn(bcrypt, 'genSalt')
        .mockImplementation(() => Promise.resolve('mockedSalt'));
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(hashedPassword));*/
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRepositoryMock.create.mockReturnValue({ ...userData });
      userRepositoryMock.save.mockImplementation(() =>
        Promise.resolve(undefined),
      );
      jwtServiceMock.sign.mockReturnValue(accessToken);

      const result = await userService.register(userData);

      expect(result).toEqual(userData);
      expect(userRepositoryMock.create).toHaveBeenCalled();
      expect(userRepositoryMock.save).toHaveBeenCalledWith({
        ...userData,
        //salt: 'mockedSalt',
        //password: hashedPassword,
        password: 'testPassword',
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const userData: UserRegisterDto = {
        username: 'existingUser',
        email: 'existing@example.com',
        password: 'existingPassword',
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRepositoryMock.create.mockReturnValue(userData);
      userRepositoryMock.save.mockImplementation(() =>
        Promise.reject(new Error('Duplicate entry')),
      );

      await expect(userService.register(userData)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login with correct credentials', async () => {
      const userData: UserLoginDto = {
        username: 'testUser',
        password: 'testPassword',
      };

      const userEntity: UserEntity = {
        reviews: [],
        id: '1',
        cart: null,
        username: 'testUser',
        password: 'testPassword',
        firstname: 'John',
        lastname: 'Doe',
        email: 'test@example.com',
        salt: 'mockedSalt'
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(userEntity.password));
      userRepositoryMock.findOneBy.mockImplementation(() =>
        Promise.resolve(userEntity),
      );
      jwtServiceMock.sign.mockReturnValue('mockedAccessToken');

      const result = await userService.login(userData);

      expect(result).toEqual({
        access_token: 'mockedAccessToken',
        userId: userEntity.id,
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userData: UserLoginDto = {
        username: 'nonexistentUser',
        password: 'nonexistentPassword',
      };

      userRepositoryMock.findOneBy.mockImplementation(() =>
        Promise.resolve(undefined),
      );

      await expect(userService.login(userData)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if password is incorrect', async () => {
      const userData: UserLoginDto = {
        username: 'testUser',
        password: 'incorrectPassword',
      };

      const userEntity: UserEntity = {
        reviews: [],
        id: '1',
        cart: null,
        username: 'testUser',
        password: 'hashedPassword',
        firstname: 'John',
        lastname: 'Doe',
        email: 'test@example.com',
        salt: 'mockedSalt'
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('incorrectHashedPassword'));
      userRepositoryMock.findOneBy.mockImplementation(() =>
        Promise.resolve(userEntity),
      );

      await expect(userService.login(userData)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUser', () => {
    it('should get user by ID', async () => {
      const userId = '1';

      const userEntity: UserEntity = {
        reviews: [],
        id: userId,
        cart: null,
        username: 'testUser',
        password: 'hashedPassword',
        firstname: 'John',
        lastname: 'Doe',
        email: 'test@example.com',
        salt: 'mockedSalt'
      };

      userRepositoryMock.findOne.mockImplementation(() =>
        Promise.resolve(userEntity),
      );

      const result = await userService.getUser(userId);

      delete userEntity.password;
      delete userEntity.salt;
      expect(result).toEqual(userEntity);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 'nonexistentUser';

      userRepositoryMock.findOne.mockImplementation(() =>
        Promise.resolve(undefined),
      );

      await expect(userService.getUser(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const userId = '1';

      const userEntity: UserEntity = {
        reviews: [],
        id: userId,
        cart: null,
        username: 'testUser',
        password: 'hashedPassword',
        firstname: null,
        lastname: null,
        email: 'test@example.com',
        salt: null
      };

      const newUserEntity: Partial<UserEntity> = {
        firstname: 'John',
        lastname: 'Doe'
      };

      const updateUserEntity: UserEntity = {
        ...userEntity,
        ...newUserEntity
      };

      userRepositoryMock.findOneBy.mockImplementation(() =>
        Promise.resolve(updateUserEntity),
      );

      userRepositoryMock.update.mockImplementation(() =>
        Promise.resolve(new UpdateResult())
      );

      const result = await userService.update(userId, newUserEntity);

      delete updateUserEntity.password;
      delete updateUserEntity.salt;

      expect(result).toEqual(updateUserEntity);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: userId,
      });
      expect(userRepositoryMock.update).toHaveBeenCalledWith(
        userId,
        updateUserEntity
      );
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      const userId = '1';

      userRepositoryMock.delete.mockImplementation(() =>
        Promise.resolve(new DeleteResult()),
      );

      const result = await userService.remove(userId);

      expect(userRepositoryMock.delete).toHaveBeenCalledWith(
        userId,
      );
      expect(result).toBeUndefined();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
