import { Dictionary, Hash, LinkMetaVal, EntryDhtStatus, EntryDetails, SignedHeaderHashed, Update, Delete } from '@holochain-open-dev/core-types';
import { CellState, ValidationLimboStatus, ValidationLimboValue, IntegrationLimboValue } from '../state';
export declare function getValidationLimboDhtOps(state: CellState, status: ValidationLimboStatus): Dictionary<ValidationLimboValue>;
export declare function pullAllIntegrationLimboDhtOps(state: CellState): Dictionary<IntegrationLimboValue>;
export declare function getHeadersForEntry(state: CellState, entryHash: Hash): SignedHeaderHashed[];
export declare function getLinksForEntry(state: CellState, entryHash: Hash): LinkMetaVal[];
export declare function getEntryDhtStatus(state: CellState, entryHash: Hash): EntryDhtStatus | undefined;
export declare function getEntryDetails(state: CellState, entryHash: Hash): EntryDetails;
export declare function getHeaderModifiers(state: CellState, headerHash: Hash): {
    updates: SignedHeaderHashed<Update>[];
    deletes: SignedHeaderHashed<Delete>[];
};
export declare function getAllHeldEntries(state: CellState): Hash[];
export declare function getAllAuthoredEntries(state: CellState): Hash[];
export declare function isHoldingEntry(state: CellState, entryHash: Hash): boolean;
export declare function isHoldingElement(state: CellState, headerHash: Hash): boolean;
export interface EntryDHTInfo {
    details: EntryDetails;
    links: LinkMetaVal[];
}
export declare function getDhtShard(state: CellState): Dictionary<EntryDHTInfo>;
