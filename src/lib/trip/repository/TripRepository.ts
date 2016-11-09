import Trip from "../Trip";
import {Stop} from "../Trip";

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
    public async getTrips(): Promise<Trip[]> {
        const trips = [];
        const [rows] = await this.db.query(`
            SELECT * FROM trips 
            JOIN stop_times USING(trip_id)
            JOIN stops USING(stop_id)
            ORDER BY trip_id, stop_sequence
        `);

        let stops = [];
        let tripId = rows[0]["trip_id"];
        let i = 0;

        for (const row of rows) {
            if (row["trip_id"] !== tripId) {
                trips.push(new Trip(stops, row["trip_id"]));
                stops = [];
            }

            stops.push(new Stop(row["parent_station"], row["arrival_time"], row["departure_time"]));
            tripId = row["trip_id"];
        }

        return trips;
    }

}
