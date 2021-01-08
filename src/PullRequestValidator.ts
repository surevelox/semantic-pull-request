import { ValidationResult } from './ValidationResult';

export class PullRequestValidator {
    constructor(
        private title: string,
        private body: string,
        private titleRegex: string,
        private bodyRegex: string,
        private validScopes: Array<string> = [],
        private scopeRequired: boolean = false
    ) {}
    validate(): ValidationResult {
        const titleRegex = new RegExp(this.titleRegex);
        const bodyRegex = new RegExp(this.bodyRegex);

        console.log('validating title: ' + this.title);
        const match = titleRegex.exec(this.title);
        console.log('validated title:');
        console.log(match);

        console.log('validating body: ' + this.body);
        const matchBody = bodyRegex.test(this.body);
        console.log('validated body: ' + matchBody);

        if (!match) {
            return {
                status: 'fail',
                message: 'Title failed',
            } as any;
        }

        if (!matchBody) {
            return {
                status: 'fail',
                message: 'Body failed',
            } as any;
        }

        const isRevert = match![1] != null;
        const type = isRevert ? match![1].toLocaleLowerCase() : match![5];
        const scope = match![6];
        const subject = isRevert ? match![4] : match![8];
        const isBreakingChanges = isRevert
            ? match![2] != null
            : match![7] != null;

        let status: any;
        if (isRevert && match![5] === 'revert') {
            status = {
                status: 'fail',
                message:
                    'Revert commit must provide previous commit type, scope and subject',
            };
        } else if (isRevert && match![5] == null) {
            status = {
                status: 'fail',
                message:
                    'Invalid revert commit - missing previous commit type ',
            };
        } else if (isRevert && scope == null && this.scopeRequired) {
            status = {
                status: 'fail',
                message: 'Missing previous commit scope in PR Title',
            };
        } else if (
            isRevert &&
            scope != null &&
            this.validScopes.length > 0 &&
            !this.validScopes.includes(scope)
        ) {
            status = {
                status: 'fail',
                message: `Revert commit has invalid previous commit scope. Use one these scopes \`${this.validScopes.join()}\``,
            };
        } else if (type == null) {
            status = {
                status: 'fail',
                message: 'Missing commit type in PR Title',
            };
        } else if (scope == null && this.scopeRequired) {
            status = {
                status: 'fail',
                message: 'Missing commit scope in PR Title',
            };
        } else if (
            scope != null &&
            this.validScopes.length > 0 &&
            !this.validScopes.includes(scope)
        ) {
            status = {
                status: 'fail',
                message: `No scope found. Use one these scopes \`${this.validScopes.join()}\``,
            };
        } else if (subject == null || subject.trim() === '') {
            status = {
                status: 'fail',
                message: 'Missing commit subject in PR Title',
            };
        } else {
            status = {
                status: 'success',
                message: 'Title and Body Validated',
            };
        }

        return {
            ...status,
            type: type,
            scope: scope,
            subject: subject,
        } as any;
    }
}
