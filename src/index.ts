import * as core from '@actions/core';
import * as github from '@actions/github';
import { context } from '@actions/github/lib/utils';
import { ActionInput } from './ActionInput';
import { GitHubHelper } from './github/GithubHelper';
import { PullRequestValidator } from './PullRequestValidator';
import { ValidationResult } from './ValidationResult';

async function run() {
    try {
        const options: ActionInput = {
            titleRegex:
                '^(?:([R|r]evert)(!)?: )?(")?((.+?)(?:[(](.+)[)])?!?: (.+))(\\3)$',
            bodyRegex: '((.|\n)+)',
            statusName: 'Semantic Pull Request',
        };

        let pullRequest: any = github.context.payload.pull_request;

        if (pullRequest != null) {
            const gitHelper = new GitHubHelper(process.env.GITHUB_TOKEN!);

            console.log(
                `Getting pull request #${github.context.payload.pull_request?.number}...`
            );
            // Get latest changes from PR before validating
            pullRequest = await gitHelper.getPullRequest();
            console.log(`Received pull request #${pullRequest}`);

            const validationCheck: ValidationResult = new PullRequestValidator(
                pullRequest.title,
                pullRequest.body ?? '',
                options.titleRegex,
                options.bodyRegex
            ).validate();

            // if validation is success then update the status
            if (validationCheck.status === 'success') {
                console.log(
                    `PR Validated #${validationCheck.status}, Updating Commit Status...`
                );

                const response = await gitHelper.updatePRStatus(
                    options.statusName,
                    'success',
                    validationCheck.message
                );

                console.log(
                    `Updated Commit Status #${validationCheck.status}, Resonse received ${response} `
                );

                core.setOutput('success', true);
            } else {
                console.log(
                    `PR Validated #${validationCheck.status}, Updating Commit Status...`
                );

                const response = await gitHelper.updatePRStatus(
                    options.statusName,
                    'failure',
                    validationCheck.message
                );

                console.log(
                    `Updated Commit Status #${validationCheck.status}, Resonse received ${response} `
                );

                core.setOutput('success', false);
            }
        } else {
            core.setOutput('success', false);
            core.setFailed(
                'Unsupported event configured. The `semantic pull request`action only works with `pull_request_target` or `pull_request` events'
            );
        }
    } catch (error) {
        console.log(error.message);
        core.setFailed(error.message);
    }
}

run();
