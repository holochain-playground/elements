import { Hash } from '@holochain-open-dev/core-types';
import { P2pCell } from '../../..';
import { GetOptions } from '../../../types';
import { CellState } from '../state';
import { GetEntryFull, GetElementFull } from './types';
export declare class Authority {
    protected state: CellState;
    protected p2p: P2pCell;
    constructor(state: CellState, p2p: P2pCell);
    handle_get_entry(entry_hash: Hash, options: GetOptions): Promise<GetEntryFull | undefined>;
    handle_get_element(header_hash: Hash, options: GetOptions): Promise<GetElementFull | undefined>;
}
