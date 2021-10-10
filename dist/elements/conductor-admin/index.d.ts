import { PropertyValues } from 'lit';
import { Card } from '@scoped-elements/material-web';
import { IconButton } from '@scoped-elements/material-web';
import { Tab } from '@scoped-elements/material-web';
import { TabBar } from '@scoped-elements/material-web';
import { PlaygroundElement } from '../../base/playground-element';
import { Conductor } from '@holochain-playground/core';
import { List } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import { CopyableHash } from '../helpers/copyable-hash';
import { Button } from '@scoped-elements/material-web';
import { HelpButton } from '../helpers/help-button';
import { CallFns } from '../helpers/call-functions';
import { GridElement } from '@vaadin/vaadin-grid';
import { GridColumnElement } from '@vaadin/vaadin-grid/vaadin-grid-column';
import { JsonViewer } from '@power-elements/json-viewer';
export declare class ConductorAdmin extends PlaygroundElement {
    private _selectedTabIndex;
    private _grid;
    get activeConductor(): Conductor | undefined;
    renderHelp(): import("lit-html").TemplateResult<1>;
    updated(changedValues: PropertyValues): void;
    setupGrid(grid: GridElement, conductor: Conductor): void;
    renderCells(conductor: Conductor): import("lit-html").TemplateResult<1>;
    renderAdminAPI(conductor: Conductor): import("lit-html").TemplateResult<1>;
    renderContent(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResult[];
    static get scopedElements(): {
        'copyable-hash': typeof CopyableHash;
        'call-functions': typeof CallFns;
        'mwc-tab': typeof Tab;
        'vaadin-grid': typeof GridElement;
        'vaadin-grid-column': typeof GridColumnElement;
        'mwc-tab-bar': typeof TabBar;
        'mwc-list': typeof List;
        'json-viewer': typeof JsonViewer;
        'mwc-list-item': typeof ListItem;
        'mwc-card': typeof Card;
        'mwc-button': typeof Button;
        'mwc-icon-button': typeof IconButton;
        'help-button': typeof HelpButton;
    };
}
