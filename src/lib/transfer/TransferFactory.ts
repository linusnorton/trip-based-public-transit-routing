
import Trip from "../trip/Trip";
import Line from "../line/Line";
import {Duration} from "../../../../transfer-pattern-generator/ts/src/Journey/Connection";

type FootpathMap = {
    [origin: string]: {
        [destination: string]: Duration
    }
};

export default class TransferFactory {

    /**
     *
     * @param trips
     * @param lines
     */
    public getTransfers(trips: Trip[], lines: Line[], footpaths: FootpathMap) {

    }

    /**
     * Algorithm 1 (p5). Loop over every stop in every trip and calculate the possible transfers
     *
     * @param trips
     * @param lines
     */
    private generateTransfers(trips: Trip[], lines: Line[], foothpaths: FootpathMap) {
        for (const trip of trips) {
            for (const stop of trip.stops) {
                const stops = Object.keys(foothpaths[stop.station]);

            }
        }
    }

}
