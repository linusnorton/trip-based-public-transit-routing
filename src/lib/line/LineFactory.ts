import Trip from "../trip/Trip";
import Line from "./Line";
import {StoppingPattern} from "../trip/Trip";
import {Option, Some, None} from "ts-option";
import {InMemoryLineRepository} from "./repository/InMemoryLineRepository";

export type TripMap = Map<StoppingPattern, Trip[]>;
export type LineMap = Map<StoppingPattern, Line[]>;

const emptyTripMap = () => new Map<StoppingPattern, Trip[]>();
const emptyLineMap = () => new Map<StoppingPattern, Line[]>();

export default class LineFactory {

    /**
     * Group the given trips into a set of lines
     */
    public getLines(trips: Trip[]): InMemoryLineRepository {
        const tripsByStoppingPattern: TripMap = trips.reduce(this.groupTripsByStoppingPattern, emptyTripMap());
        const linesByStoppingPattern: LineMap = Array.from(tripsByStoppingPattern.keys()).reduce((m, p) => m.set(p, []), emptyLineMap());

        for (const [stoppingPattern, trips] of tripsByStoppingPattern) {
            const lines = linesByStoppingPattern.get(stoppingPattern);

            for (const trip of trips) {
                this.getLineForTrip(trip, lines).match<any>({
                    some: line => line.add(trip),
                    none: () => lines.push(new Line([trip]))
                });
            }
        }

        return new InMemoryLineRepository(linesByStoppingPattern);
    }

    /**
     * Used to reduce the trips into an Map<StoppingPattern, Trip[]>
     *
     * @param accum
     * @param item
     * @returns TripMap
     */
    private groupTripsByStoppingPattern(accum: TripMap, item: Trip) {
        const stoppingPattern = item.stoppingPattern();

        if (accum.has(stoppingPattern)) {
            accum.get(stoppingPattern).push(item);
        }
        else {
            accum.set(stoppingPattern, [item]);
        }

        return accum;
    }

    /**
     * Return the line for the given trip or null if no line exists
     *
     * @param trip
     * @param lines
     * @returns {any}
     */
    private getLineForTrip(trip: Trip, lines: Line[]): Option<Line> {
        for (const line of lines) {
            if (trip.belongsToLine(line)) {
                return new Some(line);
            }
        }

        return new None();
    }


}