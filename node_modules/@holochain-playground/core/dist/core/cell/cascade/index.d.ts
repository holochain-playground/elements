import { Element, Hash } from '@holochain-open-dev/core-types';
import { GetOptions } from '../../../types';
import { Cell } from '../cell';
export declare class Cascade {
    protected cell: Cell;
    constructor(cell: Cell);
    dht_get(hash: Hash, options: GetOptions): Promise<Element | undefined>;
}
