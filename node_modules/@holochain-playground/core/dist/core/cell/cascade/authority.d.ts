import { Hash } from '@holochain-open-dev/core-types';
import { GetOptions } from '../../../types';
import { Cell } from '../cell';
import { GetEntryFull, GetElementFull } from './types';
export declare class Authority {
    protected cell: Cell;
    constructor(cell: Cell);
    handle_get_entry(entry_hash: Hash, options: GetOptions): Promise<GetEntryFull | undefined>;
    handle_get_element(header_hash: Hash, options: GetOptions): Promise<GetElementFull | undefined>;
}
