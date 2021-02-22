import { Hash } from '@holochain-open-dev/core-types';
import { HostFn } from '../../host-fn';
export declare type UpdateEntryFn = (args: {
    original_header_address: Hash;
    content: any;
    entry_def_id: string;
}) => Promise<Hash>;
export declare const update_entry: HostFn<UpdateEntryFn>;
