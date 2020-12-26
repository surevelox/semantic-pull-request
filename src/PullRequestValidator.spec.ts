import { title } from 'process';
import { PullRequestValidator } from './PullRequestValidator';

describe('Validate Default Regex', function () {
    let titleRegEx: string;
    let bodyRegEx: string;
    const successMessage = 'Title and Body Validated';

    beforeEach(() => {
        titleRegEx = '^(.+)(?:(([^)s]+)))?: (.+)'
        bodyRegEx = '(.*\n)+(.*)';
    });

    it('feat commit Validation Result should return values for all properties', function () {
        const pr = new PullRequestValidator(
            'feat(tabs): Issue #1',
            'optional body',
            titleRegEx,
            bodyRegEx
        );

        const result = pr.validate();

        expect(result.status).toBe('success');       
        expect(result.message).toBe(successMessage);
    });

    

    it('Invalid message should FAIL', function () {
        const pr = new PullRequestValidator(
            'Fixed Issue #1',
            `fixed the issue`,
            titleRegEx,
            bodyRegEx
        );

        const result = pr.validate();
        expect(result.status).toBe('fail');
    });


    it('Missing PR Body should FAIL', function () {
        const pr = new PullRequestValidator(
            'revert!: fix(tabs): Issue #1',
            ``,
            titleRegEx,
            bodyRegEx
        );

        const result = pr.validate();
        expect(result.status).toBe('fail');
    });
});
