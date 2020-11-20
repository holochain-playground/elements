import { Dictionary } from '../types/common';
import blake from 'blakejs';
import * as base64 from 'byte-base64';
import * as buffer from 'buffer';

// From https://github.com/holochain/holochain/blob/dc0cb61d0603fa410ac5f024ed6ccfdfc29715b3/crates/holo_hash/src/encode.rs
window['Buffer'] = buffer.Buffer;
export function hash(content: any): string {
  const contentString =
    typeof content === 'string' ? content : JSON.stringify(content);

  const hashBytes = blake.blake2b(contentString, null, 32);

  return base64.bytesToBase64(hashBytes);
}

export const hashLocation: Dictionary<number> = {};

export function location(hash: string): number {
  if (hashLocation[hash]) return hashLocation[hash];

  const hash128: Uint8Array = blake.blake2b(hash, null, 16);

  const out = [hash128[0], hash128[1], hash128[2], hash128[3]];

  for (let i = 4; i < 16; i += 4) {
    out[0] = out[0] ^ hash128[i];
    out[1] = out[1] ^ hash128[i + 1];
    out[2] = out[2] ^ hash128[i + 2];
    out[3] = out[3] ^ hash128[i + 3];
  }

  const view = new DataView(new Uint8Array(out).buffer, 0);
  return view.getUint32(0, false);
}

// We return the distance as the shortest distance between two hashes in the circle
export function distance(hash1: string, hash2: string): number {
  const location1 = location(hash1);
  const location2 = location(hash2);

  return Math.min(location1 - location2, location2 - location1);
}

export function compareBigInts(a: number, b: number): number {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
}
