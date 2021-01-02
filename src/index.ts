import * as core from '@actions/core';
import * as github from '@actions/github';
import { ActionInput } from './ActionInput';
import { GitHubHelper } from './github/GithubHelper';
import { PullRequestValidator } from './PullRequestValidator';
import { ValidationResult } from './ValidationResult';

async function run() {
    const options: ActionInput = {
        titleRegex:
            '^(?:([R|r]evert)(!)?: )?(")?((.+?)(?:[(](.+)[)])?!?: (.+))(\\3)$',
        bodyRegex: '((.|\n)+)',
        statusName: 'Semantic Pull Request',
    };

    let pullRequest: any = github.context.payload.pull_request;

    if (pullRequest != null) {
        const gitHelper = new GitHubHelper(process.env.GITHUB_TOKEN!);

        // Get latest changes from PR before validating
        pullRequest = await gitHelper.getPullRequest();

        const validationCheck: ValidationResult = new PullRequestValidator(
            pullRequest.title,
            pullRequest.body ?? '',
            options.titleRegex,
            options.bodyRegex
        ).validate();

        // if validation is success then update the status
        if (validationCheck.status === 'success') {
            gitHelper.updatePRStatus(
                options.statusName,
                'success',
                validationCheck.message
            );

            core.setOutput('success', true);
        } else {
            gitHelper.updatePRStatus(
                options.statusName,
                'fail',
                validationCheck.message
            );

            core.setOutput('success', false);
        }
    } else {
        core.setOutput('success', false);
        core.setFailed(
            'Unsupported event configured. The `semantic pull request`action only works with `pull_request_target` or `pull_request` events'
        );
    }
}

run();
