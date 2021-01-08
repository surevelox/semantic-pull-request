import { title } from 'process';
import { PullRequestValidator } from './PullRequestValidator';

describe('Validate Default Regex', function () {
    let titleRegEx: string;
    let bodyRegEx: string;
    const successMessage = 'Title and Body Validated';

    beforeEach(() => {
        titleRegEx =
            '^(?:([R|r]evert)(!)?:? )?(")?((?:(.+?)(?:[(](.+)[)])?(!)?: )?(.+))(\\3)$';
        bodyRegEx = '((.|\n)+)';
    });

    it('feat commit should return values for all properties', function () {
        const pr = new PullRequestValidator(
            'feat(tabs): Issue #1',
            'optional body',
            titleRegEx,
            bodyRegEx
        );

        const result = pr.validate();

        expect(result.status).toBe('success');
        expect(result.type).toBe('feat');
        expect(result.scope).toBe('tabs');
        expect(result.subject).toBe('Issue #1');
        expect(result.message).toBe(successMessage);
    });

    it('breaking changes commit should return values for all properties', function () {
        const pr = new PullRequestValidator(
            'fix(tabs)!: Issue #1',
            'optional body',
            titleRegEx,
            bodyRegEx
        );

        const result = pr.validate();
        expect(result.status).toBe('success');
        expect(result.type).toBe('fix');
        expect(result.scope).toBe('tabs');
        expect(result.subject).toBe('Issue #1');
        expect(result.message).toBe(successMessage);
    });

    it('revert commit should return values for all properties', function () {
        const pr = new PullRequestValidator(
            'revert: fix(tabs): Issue #1',
            'optional body',
            titleRegEx,
            bodyRegEx
        );

        const result = pr.validate();
        expect(result.status).toBe('success');
        expect(result.type).toBe('revert');
        expect(result.subject).toBe('fix(tabs): Issue #1');
        expect(result.message).toBe(successMessage);
    });

    it('revert commit message within quote should return values for all properties', function () {
        const pr = new PullRequestValidator(
            'revert: "fix(tabs): Issue #1"',
            'optional body',
            titleRegEx,
            bodyRegEx
        );

        const result = pr.validate();
        expect(result.status).toBe('success');
        expect(result.type).toBe('revert');
        expect(result.subject).toBe('fix(tabs): Issue #1');
        expect(result.message).toBe(successMessage);
    });

    it('revert commit with breaking changes should return values for all properties', function () {
        const pr = new PullRequestValidator(
            'revert!: fix(tabs): Issue #1',
            'optional body',
            titleRegEx,
            bodyRegEx
        );

        const result = pr.validate();

        expect(result.status).toBe('success');
        expect(result.subject).toBe('fix(tabs): Issue #1');
        expect(result.message).toBe(successMessage);
    });

    it('revert commit without commit message should fail', function () {
        const pr = new PullRequestValidator(
            'revert:',
            'optional body',
            titleRegEx,
            bodyRegEx
        );

        const result = pr.validate();
        expect(result.status).toBe('fail');
    });

    it('revert commit without previous commit type should fail', function () {
        const pr = new PullRequestValidator(
            'revert: Issue #1',
            'optional body',
            titleRegEx,
            bodyRegEx
        );

        const result = pr.validate();
        expect(result.status).toBe('fail');
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
    describe('Scope is optional', function () {
        it('Commit message without scope should return success', function () {
            const pr = new PullRequestValidator(
                'fix: Issue #1',
                `fixed table issues`,
                titleRegEx,
                bodyRegEx,
                [],
                false
            );

            const result = pr.validate();
            console.log(result.scope);
            expect(result.scope).toBeUndefined();
            expect(result.status).toBe('success');
            expect(result.message).toBe('Title and Body Validated');
        });

        it('Commit message with scope from valid list should return success', function () {
            const pr = new PullRequestValidator(
                'fix(column): Issue #1',
                `fixed table issues`,
                titleRegEx,
                bodyRegEx,
                ['table', 'row', 'column'],
                false
            );

            const result = pr.validate();
            expect(result.scope).toBe('column');
            expect(result.status).toBe('success');
            expect(result.message).toBe('Title and Body Validated');
        });

        it('Commit message with scope but not from valid list should fail', function () {
            const pr = new PullRequestValidator(
                'fix(chair): Issue #1',
                `fixed table issues`,
                titleRegEx,
                bodyRegEx,
                ['table', 'row', 'column'],
                false
            );

            const result = pr.validate();
            expect(result.scope).toBe('chair');
            expect(result.status).toBe('fail');
            expect(result.message).toBe(
                'No scope found. Use one these scopes `table,row,column`'
            );
        });

        it('Commit message without scope with valid list of scope should return success', function () {
            const pr = new PullRequestValidator(
                'fix: Issue #1',
                `fixed table issues`,
                titleRegEx,
                bodyRegEx,
                ['table', 'row', 'column'],
                false
            );

            const result = pr.validate();
            expect(result.scope).toBeUndefined();
            expect(result.status).toBe('success');
            expect(result.message).toBe('Title and Body Validated');
        });
    });

    describe('Scope is required', function () {
        it('Commit message without scope should fail', function () {
            const pr = new PullRequestValidator(
                'fix: Issue #1',
                `fixed table issues`,
                titleRegEx,
                bodyRegEx,
                [],
                true
            );

            const result = pr.validate();
            console.log(result.scope);
            expect(result.scope).toBeUndefined();
            expect(result.status).toBe('fail');
        });

        it('Commit message with scope from valid list should return success', function () {
            const pr = new PullRequestValidator(
                'fix(column): Issue #1',
                `fixed table issues`,
                titleRegEx,
                bodyRegEx,
                ['table', 'row', 'column'],
                true
            );

            const result = pr.validate();
            expect(result.scope).toBe('column');
            expect(result.status).toBe('success');
            expect(result.message).toBe('Title and Body Validated');
        });

        it('Commit message with scope but not from valid list should fail', function () {
            const pr = new PullRequestValidator(
                'fix(chair): Issue #1',
                `fixed table issues`,
                titleRegEx,
                bodyRegEx,
                ['table', 'row', 'column'],
                true
            );

            const result = pr.validate();
            expect(result.scope).toBe('chair');
            expect(result.status).toBe('fail');
            expect(result.message).toBe(
                'No scope found. Use one these scopes `table,row,column`'
            );
        });

        it('Commit message without scope with valid list of scope should fail', function () {
            const pr = new PullRequestValidator(
                'fix: Issue #1',
                `fixed table issues`,
                titleRegEx,
                bodyRegEx,
                ['table', 'row', 'column'],
                true
            );

            const result = pr.validate();
            expect(result.scope).toBeUndefined();
            expect(result.status).toBe('fail');
            expect(result.message).toBe('Missing commit scope in PR Title');
        });
    });
});
