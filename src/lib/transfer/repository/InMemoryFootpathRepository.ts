
import FootpathRepository from "./FootpathRepository";
import {Stop, Station} from "../../trip/Trip";
import {Duration} from "./FootpathRepository";
import {FootpathNotFoundError} from "./FootpathRepository";

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

        const stops: Stop[] = [];

        for (const [station, duration] of this.footpaths.get(stop.station)) {
            stops.push(new Stop(station, stop.arrivalTime + duration, null));
        }

        return stops;
    }

}