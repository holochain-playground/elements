import { h as hash } from '../../../hash-bca98662.js';
import 'byte-base64';

const putElement = (element) => (state) => {
    // Put header in CAS
    const headerHash = hash(element.header);
    state.CAS[headerHash] = element.header;
    // Put entry in CAS if it exist
    if (element.maybe_entry) {
        const entryHash = hash(element.maybe_entry);
        state.CAS[entryHash] = element.maybe_entry;
    }
    state.sourceChain.unshift(headerHash);
};

export { putElement };
//# sourceMappingURL=put.js.map
