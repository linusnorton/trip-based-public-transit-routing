
import Trip from "../trip/Trip";

export default class Transfer {
    private tripT: Trip;
    private stopI: number;
    private tripU: Trip;
    private stopJ: number;

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
     * Returns true if the arrival time at the previous station is less from tripU, making it quicker to use the
     * transfer
     *
     * @returns {boolean}
     */
    public uTurnIsQuicker(): boolean {
        const arrivalTimeOnTripT = this.tripT.stops[this.stopI - 1]; // todo interchange should be applied here
        const arrivalTimeOnTripU = this.tripU.stops[this.stopI - 1];

        return arrivalTimeOnTripU < arrivalTimeOnTripT;
    }
}