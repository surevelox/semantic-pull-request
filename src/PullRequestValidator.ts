import { ValidationResult } from './ValidationResult';

export class PullRequestValidator {
    constructor(
        private title: string,
        private body: string,
        private titleRegex: string,
        private bodyRegex: string
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

        const type = match![1] !== undefined ? match![1].toLocaleLowerCase() : match![5];
        const scope = match![6];
        const subject = match![1] !== undefined ? match![4] : match![7];
        
        if(type === 'revert' && match![5].toLocaleLowerCase() === 'revert' ){
            return {
                status: 'fail',
                message: 'Revert commit must provide previous commit\'s type, scope and subject'
            } as any;
        }

        return {
            status: 'success',
            message: 'Title and Body Validated',
            type: type,
            scope: scope,
            subject: subject,
        } as any;
    }
}
