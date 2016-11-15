import Trip from "../Trip";
import {Stop} from "../Trip";

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export default class TripRepository {
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
        const dow = days[new Date().getDay()];
        const [rows] = await this.db.query(`
            SELECT 
              trip_id, 
              parent_station, 
              TIME_TO_SEC(arrival_time) as arrival_time, 
              TIME_TO_SEC(departure_time) as departure_time 
            FROM trips 
            JOIN stop_times USING(trip_id)
            JOIN stops USING(stop_id)
            JOIN calendar USING (service_id)
            WHERE CURDATE() >= start_date AND CURDATE() <= end_date
            AND ${dow} = 1
            ORDER BY trip_id, stop_sequence
        `);

        let stops = [];
        let tripId = rows[0]["trip_id"];

        for (const row of rows) {
            if (row["trip_id"] !== tripId) {
                trips.push(new Trip(stops, parseInt(tripId)));
                stops = [];
            }

            stops.push(new Stop(row["parent_station"], parseInt(row["arrival_time"]), parseInt(row["departure_time"])));
            tripId = row["trip_id"];
        }

        return trips;
    }

}
