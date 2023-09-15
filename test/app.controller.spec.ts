import { Test, TestingModule } from '@nestjs/testing';
import { GithubController } from '../src/github.controller';
import { GithubService } from '../src/github.service';

describe('GithubController', () => {
  let githubController: GithubController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GithubController],
      providers: [GithubService],
    }).compile();

    githubController = app.get<GithubController>(GithubController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(githubController.getHello()).toBe('Hello World!');
    });
  });
});
