import { PlaygroundElement } from './utils/playground-element';
import { Select } from 'scoped-material-components/mwc-select';
import { ListItem } from 'scoped-material-components/mwc-list-item';
export declare class SelectDNA extends PlaygroundElement {
    selectDNA(dna: string): void;
    render(): import("lit-element").TemplateResult;
    static get scopedElements(): {
        'mwc-list-item': typeof ListItem;
        'mwc-select': typeof Select;
    };
}
