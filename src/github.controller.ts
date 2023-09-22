import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller()
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('commit-history/:owner/:repo')
  async getCommitHistory(
    @Param('owner') owner: string, 
    @Param('repo') repo: string) {
    return this.githubService.getCommitHistory(owner, repo);
  }
}
