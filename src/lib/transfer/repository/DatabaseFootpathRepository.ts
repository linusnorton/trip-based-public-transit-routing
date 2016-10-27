
import FootpathRepository from "./Footpath";
import {Station, Stop} from "../../trip/Trip";
import {Duration} from "./Footpath";

export default class DatabaseFootpathRepository implements FootpathRepository {

    getConnectedStopsFor(stop: Stop): Stop[] {
        return undefined; // const stopQ = new Stop(station, tripT.stops[i].arrivalTime + duration, null);
    }

}