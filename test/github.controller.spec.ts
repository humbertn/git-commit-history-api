import { Test, TestingModule } from '@nestjs/testing';
import { GithubController } from '../src/github.controller';
import { GithubService } from '../src/github.service';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';

describe('GithubController', () => {
  let githubController: GithubController;
  let githubService: GithubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GithubController],
      providers: [GithubService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },],
    }).compile();

    githubController = module.get<GithubController>(GithubController);
    githubService = module.get<GithubService>(GithubService);    
  });

  it('should be defined', () => {
    expect(githubController).toBeDefined;
  });

  describe('getCommitHistory', () => {
    it('should return commit history', async () => {
      const owner = 'testing-owner';
      const repo = 'testing-repo';

      const commitHistory = [{commit: {message: 'first test commit'}}, {commit: {message: 'second test commit'}}];

      jest.spyOn(githubService, 'getCommitHistory').mockResolvedValue(commitHistory);      

      const testResult = await githubController.getCommitHistory(owner, repo);
      expect(testResult).toBe(commitHistory);
    });

    it('should throw NotFoundException if no commit history is found', async () => {
      const owner = 'testing-owner';
      const repo = 'testing-repo';

      jest.spyOn(githubService, 'getCommitHistory').mockResolvedValue([]); 

      try {
        await githubController.getCommitHistory(owner, repo);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Error while fetching commit history for owner:"${owner}" and repo:"${repo}". message:"${e.message}"`);
      }
    });

    it('should throw an error if an error occurs during fetch', async () => {
      const owner = 'testing-owner';
      const repo = 'testing-repo';

      jest.spyOn(githubService, 'getCommitHistory').mockRejectedValue(new InternalServerErrorException('Test error')); 

      try {
        await githubController.getCommitHistory(owner, repo);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.message).toBe(`Test error`);
      }
    });
    
    it('should throw a BadRequestException if params are null/empty', async () => {
      const owner = 'testing-owner';
      const repo = null;

      jest.spyOn(githubService, 'getCommitHistory').mockRejectedValue(new BadRequestException('Bad Params')); 

      try {
        await githubController.getCommitHistory(owner, repo);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe(`Bad Params`);
      }
    });
  });
});