
import InMemoryFootpathRepository from "./InMemoryFootpathRepository";
import {Station} from "../../trip/Trip";
import {Duration} from "./FootpathRepository";
import {Map} from "immutable";

export default class DatabaseFootpathRepository {
    private db;

    public constructor(db) {
        this.db = db;
    }

    /**
     * @returns {Promise<InMemoryFootpathRepository>}
     */
    public async getMemoryRepository(): Promise<InMemoryFootpathRepository> {
        const [rows] = await this.db.query(`
            SELECT from_stop_id, to_stop_id, min_transfer_time AS duration FROM transfers UNION
            SELECT from_stop_id, to_stop_id, link_secs AS duration FROM links
        `);

        const footpaths = Map<Station, Map<Station, Duration>>().withMutations(map => {
            for (const row of rows) {
                const oldValue = map.get(row["from_stop_id"], Map<Station, Duration>());
                const newValue = oldValue.set(row["to_stop_id"], row["duration"]);

                map.set(row["from_stop_id"], newValue);
            }
        });

        return new InMemoryFootpathRepository(footpaths);
    }

}