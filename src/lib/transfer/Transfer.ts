
import Trip from "../trip/Trip";
import {Duration} from "./repository/FootpathRepository";
import {Station} from "../trip/Trip";
import {Stop} from "../trip/Trip";

export default class Transfer {
    public tripT: Trip;
    public stopI: number;
    public tripU: Trip;
    public stopJ: number;

    /**
     * @param tripT
     * @param stopI
     * @param tripU
     * @param stopJ
     */
    public constructor(tripT: Trip, stopI: number, tripU: Trip, stopJ: number) {
        this.tripT = tripT;
        this.stopI = stopI;
        this.tripU = tripU;
        this.stopJ = stopJ;
    }

    /**
     * Returns trip if the next stop of tripU if the previous stop of tripT
     *
     * @returns {boolean}
     */
    public isUTurn(): boolean {
        return this.tripT.stops[this.stopI - 1].station === this.tripU.stops[this.stopJ + 1].station;
    }

    /**
     * Returns true if it is possible to change a stop earlier. Assumes the transfer is a U-turn transfer.
     *
     * @returns {boolean}
     */
    public canChangeEarlier(interchange: Duration): boolean {
        const arrivalTime = this.tripT.stops[this.stopI - 1].arrivalTime;
        const departureTime = this.tripU.stops[this.stopJ + 1].departureTime;

        return arrivalTime + interchange < departureTime;
    }

    /**
     * @returns {Stop}
     */
    public getStationPriorToTransfer(): Station {
        return this.tripT.stops[this.stopI - 1].station;
    }

    /**
     * @returns {Stop[]}
     */
    public stopsAfterTransfer(): Stop[] {
        return this.tripU.stops.slice(this.stopJ + 1);
    }

}