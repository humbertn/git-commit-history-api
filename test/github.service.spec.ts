import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../src/github.service';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

describe('GithubService', () => {
  let githubService: GithubService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
    providers: [
        GithubService,
        {
        provide: ConfigService,
        useValue: {
            get: jest.fn(() => 'my_awesome_access_token'), 
        },
        },
    ],
    }).compile();

    githubService = module.get<GithubService>(GithubService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
        expect(githubService).toBeDefined();
  });

  describe('getCommitHistory', () => {
    it('should return commit history', async () => {
        const owner = 'testing-owner';
        const repo = 'testing-repo';

        const axiosResponse = {
            data: [{ commit: 'Commit 1' }, { commit: 'Commit 2' }],
        };

        jest.spyOn(configService, 'get').mockReturnValue('my_awesome_access_token'); 
        jest.spyOn(axios, 'get').mockResolvedValue(axiosResponse);

        const result = await githubService.getCommitHistory(owner, repo);

        expect(result).toEqual(axiosResponse.data);
    });

    it('should throw BadRequestException for missing parameters', async () => {
        const owner = null;
        const repo = 'testing-repo';

        try {
            await githubService.getCommitHistory(owner, repo);
        } catch (e) {
            expect(e).toBeInstanceOf(BadRequestException);
            expect(e.message).toBe('Parameters are missing, you need to send both owner and repository name. owner:"null", repo:"testing-repo"');
        }
    });

    it('should throw NotFoundException for empty commit history', async () => {
        const owner = 'testing-owner';
        const repo = 'testing-repo';

        jest.spyOn(configService, 'get').mockReturnValue('my_awesome_access_token');
        jest.spyOn(axios, 'get').mockResolvedValue({data: []});

        try {
            await githubService.getCommitHistory(owner, repo);
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
            expect(e.message).toBe('There are no entries in commit history for owner:"testing-owner" and repo:"testing-repo".');
        }
    });

    it('should throw InternalServerErrorException for network error', async () => {
        const owner = 'testing-owner';
        const repo = 'testing-repo';

        jest.spyOn(configService, 'get').mockReturnValue('my_awesome_access_token');
        jest.spyOn(axios, 'get').mockRejectedValue(new Error('Test error'));

        try {
            await githubService.getCommitHistory(owner, repo);
        } catch (e) {
            expect(e).toBeInstanceOf(InternalServerErrorException);
            expect(e.message).toBe('Error while fetching commit history for owner:"testing-owner" and repo:"testing-repo"');
        }
    });
  });
});
