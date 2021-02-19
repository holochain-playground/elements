import { Element, Hash } from '@holochain-open-dev/core-types';
import { GetOptions } from '../../../types';
import { P2pCell } from '../../network/p2p-cell';
import { CellState } from '../state';
export declare class Cascade {
    protected state: CellState;
    protected p2p: P2pCell;
    constructor(state: CellState, p2p: P2pCell);
    dht_get(hash: Hash, options: GetOptions): Promise<Element | undefined>;
}
