import { Test, TestingModule } from '@nestjs/testing';
import { FatRatService } from './fat-rat.service';

describe('FatRatService', () => {
  let service: FatRatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FatRatService],
    }).compile();

    service = module.get<FatRatService>(FatRatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
