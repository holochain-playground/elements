import { Dictionary, Hash } from './common';

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/state/metadata.rs

export interface Metadata {
  system_meta: Dictionary<SysMetaVal[]>; // Stores an array of headers
  link_meta: Dictionary<LinkMetaVal>;
  misc_meta: Dictionary<MiscMetaVal>;
}

export type SysMetaVal =
  | {
      NewEntry: Hash;
    }
  | {
      Update: Hash;
    }
  | {
      Delete: Hash;
    }
  | {
      Activity: Hash;
    }
  | {
      DeleteLink: Hash;
    }
  | {
      CustomPackage: Hash;
    };

export interface LinkMetaVal {
  link_add_hash: Hash;
  target: Hash;
  timestamp: number;
  zome_id: number;
  tag: any;
}

export type MiscMetaVal =
  | {
      EntryStatus: EntryDhtStatus;
    }
  | 'StoreElement'
  | { ChainItem: number }
  | { ChainObserved: HighestObserved }
  | { ChainStatus: ChainStatus };

export enum ChainStatus {
  Empty,
  Valid,
  Forked,
  Invalid,
}

export interface HighestObserved {
  header_seq: number;
  hash: Hash[];
}

export enum EntryDhtStatus {
  Live,
  /// This [Entry] has no headers that have not been deleted
  Dead,
  /// This [Entry] is awaiting validation
  Pending,
  /// This [Entry] has failed validation and will not be served by the DHT
  Rejected,
  /// This [Entry] has taken too long / too many resources to validate, so we gave up
  Abandoned,
  /// **not implemented** There has been a conflict when validating this [Entry]
  Conflict,
  /// **not implemented** The author has withdrawn their publication of this element.
  Withdrawn,
  /// **not implemented** We have agreed to drop this [Entry] content from the system. Header can stay with no entry
  Purged,
}
