
import Trip from "../trip/Trip";
import {Station} from "../trip/Trip";

export default class Line {
    public trips: Trip[];

    /**
     * @param trips
     */
    public constructor(trips: Trip[]) {
        this.trips = trips;
    }

    /**
     * @param trip
     */
    add(trip: Trip): void {
        this.trips.push(trip);
    }

    /**
     * @returns {Station[]}
     */
    public stoppingStations(): Station[] {
        return this.trips[0].stops.map(stop => stop.station);
    }

}
