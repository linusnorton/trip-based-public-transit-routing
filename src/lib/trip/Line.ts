
import Trip from "./Trip";

export default class Line {

    public trips: Trip[];

    public constructor(trips: Trip[]) {
        this.trips = trips;
    }

    add(trip: Trip): void {
        this.trips.push(trip);
    }

}
