
import Trip from "../trip/Trip";
import {Station} from "../trip/Trip";
import {Option, Some, None} from "ts-option";

export default class Line {
    public trips: Trip[];

    /**
     * @param trips
     */
    public constructor(trips: Trip[] = []) {
        this.trips = trips;
    }

    /**
     * Add the trip, ordering them by arrivalTime
     *
     * @param trip
     */
    public add(trip: Trip): void {
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

    /**
     * Assuming the trips are ordered this method will return the earliest trip that is boardable at stop stopIndex
     *
     * @param stopIndex
     * @param arrivalTime
     * @returns {Option<Trip>}
     */
    public getEarliestTripAt(stopIndex, arrivalTime): Option<Trip> {
        for (const trip of this.trips) {
            if (trip.stops[stopIndex].departureTime >= arrivalTime) {
                return new Some(trip);
            }
        }

        return new None();
    }

}
