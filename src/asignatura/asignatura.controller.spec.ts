import { Test, TestingModule } from '@nestjs/testing';
import { AsignaturaController } from './asignatura.controller';

describe('AsignaturaController', () => {
  let controller: AsignaturaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsignaturaController],
    }).compile();

    controller = module.get<AsignaturaController>(AsignaturaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
