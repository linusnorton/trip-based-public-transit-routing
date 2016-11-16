
import Transfer from "../Transfer";
import Trip from "../../trip/Trip";
import {Map} from "immutable";

declare module "immutable" {
    interface Map<K, V> {
        [Symbol.iterator](): IterableIterator<[K,V]>;
    }
}

type TransfersMap = Map<Trip, Map<number, Transfer[]>>;

export default class TransferRepository {
    private db;

    /** 
     * @param db 
     */
    public constructor(db) {
        this.db = db;
    }

    /**
     * Load transfers from the database
     * 
     * @returns {TransfersMap}
     */
    public async getTransfers(trips: Trip[]): Promise<TransfersMap> {
        const select = this.db.query("SELECT * FROM trip_transfers");
        const tripMap = Map<number, Trip>(trips.map(trip => [trip.id, trip]));
        const [rows] = await select;
        const transfers = Map<Trip, Map<number, Transfer[]>>().asMutable();

        for (const row of rows) {
            const tripT = tripMap.get(parseInt(row["trip_t"]));
            const stopI = parseInt(row["stop_i"]);
            const tripU = tripMap.get(parseInt(row["trip_u"]));
            const stopJ = parseInt(row["stop_j"]);
            if (!tripU || !tripT) {
                continue;
            }
            const transfer = new Transfer(tripT, stopI, tripU, stopJ);
            const oldValue = transfers.get(tripT, Map<number, Transfer[]>());
            const newValue = oldValue.update(stopI, [], prev => prev.concat(transfer));

            transfers.set(tripT, newValue);
        }

        return transfers.asImmutable();
    }
    
    /**
     * Store the given transfers in the database
     * 
     * @param transfers
     */
    public async storeTransfers(transfers: TransfersMap): Promise<any> {
        const inserts = transfers
            .valueSeq()                         // turn Map into List of values
            .map(this.insertTransfers)          // map transfers into array of SQL inserts
            .filter(v => v != null).toArray();  // remove empty values

        return Promise.all(inserts);
    }

    private insertTransfers = (tripTransfers: Map<number, Transfer[]>): any => {
        const rows = [];
        
        for (const [i, transfers] of tripTransfers) {
            for (const transfer of transfers) {
                const fields = [
                    transfer.tripT.id, 
                    transfer.stopI, 
                    transfer.tripU.id, 
                    transfer.stopJ
                ];

                rows.push(`(${fields.join(",")})`);
            }
        }

        if (rows.length > 0) {
            return this.db.query(`INSERT IGNORE INTO trip_transfers VALUES ${rows}`);
        }
    }

}