import { PropertyValues } from 'lit';
import { PlaygroundElement } from '../../base/playground-element';
import { Select } from 'scoped-material-components/mwc-select';
import { ListItem } from 'scoped-material-components/mwc-list-item';
import { Card } from 'scoped-material-components/mwc-card';
import { Drawer } from 'scoped-material-components/mwc-drawer';
import { List } from 'scoped-material-components/mwc-list';
import { LightDnaSlot, LightHappBundle } from '../../base/context';
import { TextField } from 'scoped-material-components/mwc-textfield';
import { Button } from 'scoped-material-components/mwc-button';
import { CopyableHash } from '../helpers/copyable-hash';
import { IconButton } from 'scoped-material-components/mwc-icon-button';
export interface EditingHappBundle {
    name: string;
    description: string;
    slots: Array<[string, LightDnaSlot]>;
}
export declare class HappsManager extends PlaygroundElement {
    _selectedHappId: string;
    _editingHapp: EditingHappBundle | undefined;
    _lastSelectedDna: string | undefined;
    _newDnaCount: number;
    _newHappCount: number;
    get _activeHapp(): LightHappBundle;
    get _editingHappValid(): boolean;
    firstUpdated(): void;
    update(changedValues: PropertyValues): void;
    renderDnaSlot(index: number, slotNick: string, dnaSlot: LightDnaSlot): import("lit-html").TemplateResult<1>;
    setupHappNameTextfield(field: TextField): void;
    setupNickField(field: TextField, oldValue: string): void;
    saveHapp(): void;
    renderBottomBar(): import("lit-html").TemplateResult<1>;
    renderHappDetail(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResultGroup[];
    static elementDefinitions: {
        'mwc-list-item': typeof ListItem;
        'mwc-icon-button': typeof IconButton;
        'mwc-textfield': typeof TextField;
        'mwc-list': typeof List;
        'copyable-hash': typeof CopyableHash;
        'mwc-select': typeof Select;
        'mwc-card': typeof Card;
        'mwc-button': typeof Button;
        'mwc-drawer': typeof Drawer;
    };
}
