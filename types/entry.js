import 'blakejs';
import 'byte-base64';
import { hash } from '../processors/hash.js';

function getAppEntryType(entryType) {
    if (entryType.App)
        return entryType.App;
    return undefined;
}
function getEntryTypeString(entryType) {
    const appEntryType = getAppEntryType(entryType);
    if (appEntryType)
        return appEntryType.id;
    return entryType;
}
function hashEntry(entry) {
    if (entry.entry_type === 'Agent')
        return entry.content;
    return hash(entry);
}

export { getAppEntryType, getEntryTypeString, hashEntry };
//# sourceMappingURL=entry.js.map
