import Trip from "../Trip";

interface TripRepository {
    getTrips(): Promise<Trip[]>;
}

export default TripRepository;

export class DatabaseTripRepository implements TripRepository {
    private db;

    /**
     * @param db
     */
    public constructor(db) {
        this.db = db;
    }

    /**
     * @returns {Promise<Trip[]>}
     */
    getTrips(): Promise<Trip[]> {
        return undefined;
    }

}
