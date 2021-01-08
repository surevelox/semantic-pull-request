export interface ActionInput {
    titleRegex: string;
    bodyRegex: string;
    statusName: string;
    validScopes: Array<string>;
    isScopeRequired: boolean;
}
