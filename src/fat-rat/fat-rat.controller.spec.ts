import { Test, TestingModule } from '@nestjs/testing';
import { FatRatController } from './fat-rat.controller';

describe('FatRatController', () => {
  let controller: FatRatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FatRatController],
    }).compile();

    controller = module.get<FatRatController>(FatRatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
