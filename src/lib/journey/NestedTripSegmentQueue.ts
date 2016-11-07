
import {Map, List} from "immutable";
import Trip from "../trip/Trip";
import LineRepository from "../line/repository/LineRepository";
import {Stop} from "../trip/Trip";
import Journey from "./Journey";
import Leg from "./Leg";

declare module "immutable" {
    interface Map<K, V> {
        [Symbol.iterator](): IterableIterator<[K,V]>;
    }
    interface List<T> {
        [Symbol.iterator](): IterableIterator<[T]>;
    }
}

type TripStopIndex = number;

class TripSegment {
    trip: Trip;
    b: TripStopIndex;
    e: TripStopIndex;

    constructor(trip: Trip, b: TripStopIndex, e: TripStopIndex) {
        this.trip = trip;
        this.b = b;
        this.e = e;
    }

    getStops(): Stop[] {
        return this.trip.stops.slice(this.b, this.e + 1);
    }

    upTo(stopI: TripStopIndex): TripSegment {
        return new TripSegment(this.trip, this.b, stopI);
    }
}

export default class NestedTripSegmentQueue {
    private items: List<List<TripSegment>>;
    private visitedTrips: Map<Trip, TripStopIndex>;
    private lineRepository: LineRepository;
    private journeyPath: Map<Trip, TripSegment>;

    constructor(lineRepository: LineRepository) {
        this.items = List<List<TripSegment>>();
        this.visitedTrips = Map<Trip, TripStopIndex>();
        this.lineRepository = lineRepository;
        this.journeyPath = Map<Trip, TripSegment>();
    }

    public add(tripT: Trip, stopIndex: TripStopIndex, depth: number, previousSegment?: TripSegment): void {
        const oldStopIndex = this.visitedTrips.get(tripT, tripT.stops.length);

        if (stopIndex < oldStopIndex) {
            const segment = new TripSegment(tripT, stopIndex, oldStopIndex);

            this.items = this.items.update(depth, List<TripSegment>(), prev => prev.push(segment));
            this.journeyPath = this.journeyPath.set(tripT, previousSegment);

            for (const tripU of this.lineRepository.lineForTrip(tripT).tripsAfterAndIncluding(tripT)) {
                this.journeyPath = this.journeyPath.set(tripU, previousSegment);
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

    public extractJourney(segment: TripSegment): Journey {
        const legs = [];

        do {
            legs.push(new Leg(segment.getStops()));
        } while (segment = this.journeyPath.get(segment.trip));

        return new Journey(legs.reverse());
    }

}