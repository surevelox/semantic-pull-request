import { ValidationResult } from "./ValidationResult";

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

        const match = titleRegex.test(this.title);
        const matchBody = bodyRegex.test(this.body);

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

        return {
            status: 'success',
            message: 'Title and Body Validated',
        } as any;

    }
}
