import * as core from '@actions/core';
import * as github from '@actions/github';
import { ActionInput } from './ActionInput';
import { PullRequestValidator } from './PullRequestValidator';
import { ValidationResult } from './ValidationResult';

async function run() {

    const options: ActionInput = {
        titleRegex: '^(.+)(?:(([^)s]+)))?: (.+)',
        bodyRegex: '(.*\n)+(.*)'        
    };

    const pullRequest = github.context.payload.pull_request;

    if (pullRequest != null) {
        const validationCheck: ValidationResult = new PullRequestValidator(
            pullRequest.title,
            pullRequest.body ?? '',
            options.titleRegex,
            options.bodyRegex
        ).validate();

        // if validation is success then update the status
        if (validationCheck.status === 'success') {
            core.setOutput('success', true);
        } else {
            core.setOutput('success', false);
        }
    }
}

run();
