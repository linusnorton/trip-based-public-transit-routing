
import Trip from "../trip/Trip";

export default class Transfer {
    private tripA: Trip;
    private stopI: number;
    private tripB: Trip;
    private stopJ: number;

    /**
     * @param tripA
     * @param stopI
     * @param tripB
     * @param stopJ
     */
    public constructor(tripA: Trip, stopI: number, tripB: Trip, stopJ: number) {
        this.tripA = tripA;
        this.stopI = stopI;
        this.tripB = tripB;
        this.stopJ = stopJ;
    }

}