import { Test, TestingModule } from '@nestjs/testing';
import { GradoController } from './grado.controller';

describe('GradoController', () => {
  let controller: GradoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradoController],
    }).compile();

    controller = module.get<GradoController>(GradoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
