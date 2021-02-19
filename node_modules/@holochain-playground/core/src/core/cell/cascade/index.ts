import {
  Element,
  Hash,
  NewEntryHeader,
  SignedHeaderHashed,
} from '@holochain-open-dev/core-types';
import { getHashType, HashType } from '../../../processors/hash';
import { GetOptions, GetStrategy } from '../../../types';
import { P2pCell } from '../../network/p2p-cell';
import { Cell } from '../cell';
import { CellState } from '../state';
import { Authority } from './authority';

export class Cascade {
  constructor(protected state: CellState, protected p2p: P2pCell) {}

  async dht_get(hash: Hash, options: GetOptions): Promise<Element | undefined> {
    // TODO rrDHT arcs
    const authority = new Authority(this.state, this.p2p);

    const isPresent = this.state.CAS[hash];

    // TODO only return local if GetOptions::content() is given
    if (isPresent && options.strategy === GetStrategy.Contents) {
      const hashType = getHashType(hash);

      if (hashType === HashType.ENTRY) {
        const entry = this.state.CAS[hash];
        const signed_header = Object.values(this.state.CAS).find(
          header =>
            (header as SignedHeaderHashed).header &&
            (header as SignedHeaderHashed<NewEntryHeader>).header.content
              .entry_hash === hash
        );

        return {
          entry,
          signed_header,
        };
      }

      if (hashType === HashType.HEADER) {
        const signed_header = this.state.CAS[hash];
        const entry = this.state.CAS[
          (signed_header as SignedHeaderHashed<NewEntryHeader>).header.content
            .entry_hash
        ];
        return {
          entry,
          signed_header,
        };
      }
    }

    return this.p2p.get(hash, options);
  }
}
