
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
     * Add the trip, ordering them by arrivalTime
     *
     * @param trip
     */
    add(trip: Trip): void {
        let i = 0;

        while(i < this.trips.length && trip.stops[1].arrivalTime > this.trips[i].stops[1].arrivalTime) {
            i++;
        }

        this.trips.splice(i, 0, trip);
    }

    /**
     * @returns {Station[]}
     */
    public stoppingStations(): Station[] {
        return this.trips[0].stops.map(stop => stop.station);
    }

}
