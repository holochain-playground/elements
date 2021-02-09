import {
  Element,
  Hash,
  NewEntryHeader,
  SignedHeaderHashed,
} from '@holochain-open-dev/core-types';
import { getHashType, HashType } from '../../../processors/hash';
import { GetOptions, GetStrategy } from '../../../types';
import { Cell } from '../cell';
import { Authority } from './authority';

export class Cascade {
  constructor(protected cell: Cell) {}

  async dht_get(hash: Hash, options: GetOptions): Promise<Element | undefined> {
    // TODO rrDHT arcs
    const authority = new Authority(this.cell);

    const isPresent = this.cell.state.CAS[hash];

    // TODO only return local if GetOptions::content() is given
    if (isPresent && options.strategy === GetStrategy.Contents) {
      const hashType = getHashType(hash);

      if (hashType === HashType.ENTRY) {
        const entry = this.cell.state.CAS[hash];
        const signed_header = Object.values(this.cell.state.CAS).find(
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
        const signed_header = this.cell.state.CAS[hash];
        const entry = this.cell.state.CAS[
          (signed_header as SignedHeaderHashed<NewEntryHeader>).header.content
            .entry_hash
        ];
        return {
          entry,
          signed_header,
        };
      }
    }

    return this.cell.p2p.get(hash, options);
  }
}
