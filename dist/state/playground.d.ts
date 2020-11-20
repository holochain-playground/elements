import { Conductor } from "../core/conductor";
import { Hash } from "../types/common";
export interface Playground {
    activeDNA: Hash;
    activeAgentId: Hash | undefined;
    activeEntryId: Hash | undefined;
    conductors: Conductor[];
    conductorsUrls: string[] | undefined;
}
