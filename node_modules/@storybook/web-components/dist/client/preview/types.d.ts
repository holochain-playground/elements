import { TemplateResult, SVGTemplateResult } from 'lit-element';
export { RenderContext } from '@storybook/core';
export declare type StoryFnHtmlReturnType = string | Node | TemplateResult | SVGTemplateResult;
export interface IStorybookStory {
    name: string;
    render: () => any;
}
export interface IStorybookSection {
    kind: string;
    stories: IStorybookStory[];
}
export interface ShowErrorArgs {
    title: string;
    description: string;
}
