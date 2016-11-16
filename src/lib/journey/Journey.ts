
import Leg from "./Leg";
import {Time, Station} from "../trip/Trip";
import {Duration} from "../transfer/repository/FootpathRepository";

export default class Journey {
    legs: Leg[];
    departureTime: Time;
    arrivalTime: Time;
    origin: Station;
    destination: Station;

    /**
     * @param legs
     */
    public constructor(legs: Leg[]) {
        this.legs = legs;
        this.departureTime = legs[0].departureTime;
        this.arrivalTime = legs[legs.length -1].arrivalTime;
        this.origin = legs[0].stops[0].station;
        this.destination = legs[legs.length -1].stops[legs[legs.length -1].stops.length -1].station;
    }

    /**
     * @param journey
     */
    public dominates(journey: Journey): boolean {
        return this.legs.length <= journey.legs.length
            && this.departureTime >= journey.departureTime
            && this.arrivalTime <= journey.arrivalTime;
    }

    /**
     * @returns {number}
     */
    public duration(): Duration {
        return this.arrivalTime - this.departureTime;
    }

}
