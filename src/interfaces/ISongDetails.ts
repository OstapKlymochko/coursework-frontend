import {ISong} from "./ISong";
import {ISongStatistics} from "./ISongStatistics";

export interface ISongDetails extends ISong, ISongStatistics {
    songUrl: string;
    videoClipUrl?: string | null;
}