
import {Map, List} from "immutable";
import Trip from "../trip/Trip";
import LineRepository from "../line/repository/LineRepository";

declare module "immutable" {
    interface Map<K, V> {
        [Symbol.iterator](): IterableIterator<[K,V]>;
    }
    interface List<T> {
        [Symbol.iterator](): IterableIterator<[T]>;
    }
}

type TripStopIndex = number;
type TripSegment = [Trip, TripStopIndex, TripStopIndex];

export default class NestedTripSegmentQueue {
    private items: List<List<TripSegment>>;
    private visitedTrips: Map<Trip, TripStopIndex>;
    private lineRepository: LineRepository;

    constructor(lineRepository: LineRepository) {
        this.items = List<List<TripSegment>>();
        this.visitedTrips = Map<Trip, TripStopIndex>();
        this.lineRepository = lineRepository;
    }

    public add(tripT: Trip, stopIndex: TripStopIndex, depth: number): void {
        const oldStopIndex = this.visitedTrips.get(tripT, tripT.stops.length);

        if (stopIndex < oldStopIndex) {
            // add the TripSegment to the queue
            this.items = this.items.update(depth, List<TripSegment>(), prev => prev.push([tripT, stopIndex, oldStopIndex]));

            for (const tripU of this.lineRepository.lineForTrip(tripT).tripsAfterAndIncluding(tripT)) {
                this.visitedTrips = this.visitedTrips.update(tripU, Infinity, prev => Math.min(prev, stopIndex));
            }
        }
    }

    public empty(depth: number): boolean {
        return this.items.get(depth, List<TripSegment>()).isEmpty();
    }

    public get(depth: number): any {
        return this.items.get(depth);
    }

}