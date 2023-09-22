import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  private readonly githubAPIBaseURL = 'https://api.github.com';

  constructor(private readonly configService: ConfigService) {} 

  async getCommitHistory(owner: string, repo: string) {
    if (owner == null || repo == null || owner.trim().length == 0 || repo.trim().length == 0) {
      throw new BadRequestException(`Parameters are missing, you need to send both owner and repository name. owner:"${owner}", repo:"${repo}"`);
    }

    try {
      const accessToken = this.configService.get<string>('GITHUB_ACCESS_TOKEN');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.get(`${this.githubAPIBaseURL}/repos/${owner}/${repo}/commits`, { headers });
      
      if(response.data) {
        return response.data;
      } 
      throw new NotFoundException(`There are no entries in commit history for owner:"${owner}" and repo:"${repo}".`);
    } catch(error) {
      throw new InternalServerErrorException('Error while fetching commit history for owner:"${owner}" and repo:"${repo}"');
    }
  }
}
