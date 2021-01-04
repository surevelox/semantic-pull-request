import { context, getOctokit } from '@actions/github';
import { Octokit } from '@octokit/core';
import { OctokitOptions } from '@octokit/core/dist-types/types';

export class GitHubHelper {
    private octokit: Octokit;

    constructor(token: string, options?: OctokitOptions) {
        this.octokit = getOctokit(token, options);
    }
    public async updatePRStatus(
        statusName: string,
        state: 'error' | 'failure' | 'pending' | 'success',
        description: string
    ) {
        try {
            const owner = context.payload.pull_request!.base.user.login;
            const repo = context.payload.pull_request!.base.repo.name;
            const sha = context.payload.pull_request?.head.sha;

            const response = await this.octokit.request(
                'POST /repos/{owner}/{repo}/statuses/{sha}',
                {
                    owner: owner,
                    repo: repo,
                    sha: sha,
                    state: state,
                    description: description,
                    target_url:
                        'https://github.com/surevelox/semantic-pull-request',
                    context: statusName,
                }
            );
            return response;
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    }

    public async getPullRequest() {
        try {
            const owner = context.payload.pull_request!.base.user.login;
            const repo = context.payload.pull_request!.base.repo.name;
            const prNum = context.payload.pull_request!.number;

            const { data: pullRequest } = await this.octokit.pulls.get({
                owner,
                repo,
                pull_number: prNum,
            });

            return pullRequest;
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    }
}
