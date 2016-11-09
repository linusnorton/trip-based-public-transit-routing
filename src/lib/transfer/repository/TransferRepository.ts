
import Transfer from "../Transfer";
import Trip from "../../trip/Trip";
import {Map} from "immutable";

export default class TransferRepository {
    private db;

    public constructor(db) {
        this.db = db;
    }

    public getTransfers(): Map<Trip, Map<number, Transfer[]>> {
        return undefined;
    }
    
    public storeTransfers(transfers: Map<Trip, Map<number, Transfer[]>>): any {
        return Promise.all(transfers.map(this.storeTripTransfers).toArray());
    }

    private storeTripTransfers = async(transfers: Map<number, Transfer[]>, trip: Trip): Promise<any> => {
        const rows = [];
        
        for (const [i, transfers] of transfers) {
            for (const transfer of transfers) {
                rows.push(`(...)`);
            }
        }
        this.db.query(`
            INSERT INTO trip_transfers ()
        `);
    }

}