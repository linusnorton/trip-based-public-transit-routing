import Trip from "../trip/Trip";
import Line from "./Line";
import {StoppingPattern} from "../trip/Trip";
import {Option, Some, None} from "ts-option";
import InMemoryLineRepository from "./repository/InMemoryLineRepository";
import {Map} from "immutable";

declare module "immutable" {
    interface Map<K, V> {
        [Symbol.iterator](): IterableIterator<[K,V]>;
    }
}

export type TripMap = Map<StoppingPattern, Trip[]>;
export type LineMap = Map<StoppingPattern, Line[]>;

export default class LineFactory {

    /**
     * Group the given trips into a set of lines
     */
    public getLines(trips: Trip[]): InMemoryLineRepository {
        const tripsByStoppingPattern: TripMap = trips.reduce(this.groupByStoppingPattern, Map<StoppingPattern, Trip[]>());
        let linesByStoppingPattern: LineMap = Map<StoppingPattern, Line[]>();

        for (const [stoppingPattern, trips] of tripsByStoppingPattern) {
            const lines = linesByStoppingPattern.get(stoppingPattern, []);

            for (const trip of trips) {
                this.getLineForTrip(trip, lines).match({
                    some: line => line.add(trip),
                    none: () => lines.push(new Line([trip]))
                });

                linesByStoppingPattern = linesByStoppingPattern.set(stoppingPattern, lines);
            }
        }

        return new InMemoryLineRepository(linesByStoppingPattern);
    }

    /**
     * Used to group the trips by their stopping pattern
     *
     * @param prev
     * @param item
     * @returns {Map<StoppingPattern, Array>}
     */
    private groupByStoppingPattern(prev: TripMap, item: Trip): TripMap {
        return prev.update(item.stoppingPattern(), [], trips => trips.concat(item));
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
