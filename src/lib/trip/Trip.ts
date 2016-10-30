import Line from "../line/Line";

export type Station = string;
export type Time = number;
export type StoppingPattern = string;

export class Stop {
    station: Station;
    arrivalTime: Time;
    departureTime: Time;

    /**
     * @param station
     * @param arrivalTime
     * @param departureTime
     */
    public constructor(station: Station, arrivalTime: Time, departureTime: Time) {
        this.station = station;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
    }

}

export default class Trip {
    stops: Stop[];

    /**
     * @param stops
     */
    public constructor(stops: Stop[]) {
        this.stops = stops;
    }

    /**
     * @returns {StoppingPattern}
     */
    public stoppingPattern(): StoppingPattern {
        return this.stops.map(stop => stop.station).join('');
    }

    /**
     * @param line
     * @returns {boolean}
     */
    public belongsToLine(line: Line): boolean {
        for (const trip of line.trips) {
            if (this.overtakesOrOvertakenBy(trip)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Work out which service departs last and ensure that every stop of that service departs after the equivilent stop
     * of the given service. It is assumed that this trip and the given trip share the same stopping pattern.
     *
     * @param trip
     * @returns {boolean}
     */
    public overtakesOrOvertakenBy(trip: Trip): boolean {
        const [a, b] = this.stops[0].departureTime > trip.stops[0].departureTime ? [this, trip] : [trip, this];

        for (let i = 0; i < a.stops.length; i++) {
            if (a.stops[i].departureTime < b.stops[i].departureTime) {
                return true;
            }
        }

        return false;
    }

    /**
     * A trip dominates another if "is no worse than the other in any criterion" in this case we are only
     * comparing the arrival time at the destination.
     *
     * @param trip
     * @returns {boolean}
     */
    public dominates(trip: Trip): boolean {
        return this.stops[this.stops.length - 1].arrivalTime < trip.stops[this.stops.length - 1].arrivalTime;
    }
}
