import { Entry, EntryType, SignedHeaderHashed, Create, Delete, Update } from '@holochain-open-dev/core-types';
import { ValidationStatus } from '..';
export interface GetEntryFull {
    entry: Entry;
    entry_type: EntryType;
    live_headers: SignedHeaderHashed<Create>[];
    deletes: SignedHeaderHashed<Delete>[];
    updates: SignedHeaderHashed<Update>[];
}
export interface GetElementFull {
    signed_header: SignedHeaderHashed;
    maybe_entry: Entry | undefined;
    validation_status: ValidationStatus;
    deletes: SignedHeaderHashed<Delete>[];
    updates: SignedHeaderHashed<Update>[];
}
export declare type GetResult = GetElementFull | GetEntryFull;
