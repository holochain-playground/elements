import { PlaygroundElement } from '../../context/playground-element';

import ForceGraph3D from '3d-force-graph';
import { html } from 'lit-html';
import { css, PropertyValues, query } from 'lit-element';
import { allCells } from './processors';
import { sharedStyles } from '../utils/shared-styles';
import { selectAllCells } from '../utils/selectors';

export class CellsEcosystem extends PlaygroundElement {
  @query('#cells-ecosystem')
  _cellsEcosystemEl!: HTMLElement;

  _graph3d: any;

  _cells: any;

  firstUpdated() {
    this._cells = allCells(this.conductors);
    console.log(this._cells);
    this._graph3d = ForceGraph3D()(this._cellsEcosystemEl)
      .nodeAutoColorBy('group')
      .linkWidth((link: any) =>
        link.source.group !== link.target.group ? 6 : 1
      );

    this._graph3d.graphData(this._cells);
  }

  observedCells() {
    const cells = this.conductors.map((c) => c.getAllCells());
    return [].concat(...cells);
  }

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    this._cells = allCells(this.conductors);

    if (this._graph3d) {
      this._graph3d.graphData(this._cells);
    }
  }

  render() {
    return html`<div id="cells-ecosystem" style="flex: 1;"></div>`;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }
      `,
    ];
  }
}
