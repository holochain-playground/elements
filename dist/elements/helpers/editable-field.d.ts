import { LitElement } from 'lit';
import { IconButton } from 'scoped-material-components/mwc-icon-button';
declare const EditableField_base: typeof LitElement;
export declare class EditableField extends EditableField_base {
    value: any;
    _editing: boolean;
    _newValue: any;
    _valid: boolean;
    save(): void;
    cancel(): void;
    firstUpdated(): void;
    setupField(fieldSlot: HTMLSlotElement): void;
    render(): import("lit-html").TemplateResult<1>;
    static elementDefinitions: {
        'mwc-icon-button': typeof IconButton;
    };
    static styles: import("lit").CSSResultGroup[];
}
export {};
