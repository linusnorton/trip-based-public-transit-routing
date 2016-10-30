
import FootpathRepository from "./FootpathRepository";
import {Stop, Station} from "../../trip/Trip";
import {Duration} from "./FootpathRepository";
import {FootpathNotFoundError} from "./FootpathRepository";
import {Map} from 'immutable';

type FootpathMap = Map<Station, Map<Station, Duration>>;

export default class InMemoryFootpathRepository implements FootpathRepository {
    private footpaths: FootpathMap;

    /**
     * @param footpaths
     */
    public constructor(footpaths: FootpathMap) {
        this.footpaths = footpaths;
    }

    /**
     * Return stops that can be reached via footpath from the given stop.
     *
     * Interchange is treated as a footpath from stationA -> stationA.
     *
     * @param stop
     * @returns {Stop[]}
     */
    public getConnectedStopsFor(stop: Stop): Stop[] {
        if (!this.footpaths.has(stop.station)) {
            throw new FootpathNotFoundError(`No footpath entry for ${stop.station}. There should at least be interchange`);
        }

        return this.footpaths.get(stop.station).map((d: Duration, s: Station): Stop => {
            return new Stop(s, stop.arrivalTime + d, Infinity);
        }).toArray();
    }

    /**
     * @param station
     * @returns {Duration}
     */
    public getInterchangeAt(station: Station): Duration {
        return this.footpaths.get(station).get(station);
    }

}