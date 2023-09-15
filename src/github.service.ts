import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GithubService {
  private readonly githubAPIBaseURL = 'https://api.github.com';

  async getCommitHistory(owner: string, repo: string) {
    if (owner == null || repo == null || owner.trim().length == 0 || repo.trim().length == 0) {
      throw new Error(`Parameters are missing, you need to send both owner and repository name. owner:"${owner}", repo:"${repo}"`);
    }

    try {
      const response = await axios.get(`${this.githubAPIBaseURL}/repos/${owner}/${repo}/commits`);
      return response.data;
    } catch(error) {
      throw new Error(`Error while fetching commit history for owner:"${owner}" and repo:"${repo}". message:"${error.message}"`);
    }
  }
}
