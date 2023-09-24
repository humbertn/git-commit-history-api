# Git Commit History API

This is the API that consumes the GITHUB API to retrieve commit history.

## Limitations

This projects is intended to run only in local environment.

## Pre-requisites

To run this project it is REQUIRED to create a file called `.env` with the `GITHUB_ACCESS_TOKEN`.

```bash
GITHUB_ACCESS_TOKEN=<your_github_access_token>
```

- NodeJS and NPM are also required.
- If you received a `.env` via email from the author just copy and paste it in the root folder.

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ npm run start
```

API will start listening on `http://localhost:3001`

## Test

```bash
$ npm run test
```

## Endpoints

GET `/commit-history/${repo_owner}/${repo_name}`

#### Sample response

```json
[
    {
      sha: '1234567',
      commit: {
        message: 'Commit message 1',
        author: {
          date: '2023-09-01T12:00:00Z',
        },
      },
      author: {
        login: 'author1',
        avatar_url: 'avatar_url_1',
      },
    },
    {
      sha: '8901234',
      commit: {
        message: 'Commit message 2',
        author: {
          date: '2023-09-02T12:00:00Z',
        },
      },
      author: {
        login: 'author2',
        avatar_url: 'avatar_url_2',
      },
    },
]
```

## Notes

This API was created using the [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.