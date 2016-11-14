
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
    public getTransfers(): TransfersMap {
        return undefined;
    }
    
    /**
     * Store the given transfers in the database
     * 
     * @param transfers
     */
    public async storeTransfers(transferMap: TransfersMap): Promise<void> {
        // const rows = transfers
        //     .valueSeq()             // turn Map into List of values
        //     .map(this.getRows)      // map transfers into array of SQL inserts
        //     .flatten()              // flatten into single array of SQL inserts
        //     .join(",");             // join into single string value

        const rows = [];

        for (const [trip, tripTransfers] of transferMap) {
            for (const [i, transfers] of tripTransfers) {
                for (const transfer of transfers) {
                    console.log(transfer);
                    const fields = [
                        transfer.tripT.id,
                        transfer.stopI,
                        transfer.tripU.id,
                        transfer.stopJ
                    ];

                    rows.push(`(${fields.join(",")})`);
                }
            }
        }

        return this.db.query(`INSERT INTO trip_transfers VALUES ${rows}`);
    }

    /**
     * 
     */
    private getRows(tripTransfers: Map<number, Transfer[]>): string[] {
        const rows = [];
        
        for (const [i, transfers] of tripTransfers) {
            for (const transfer of transfers) {
                console.log(transfer);
                const fields = [
                    transfer.tripT.id, 
                    transfer.stopI, 
                    transfer.tripU.id, 
                    transfer.stopJ
                ];

                rows.push(`(${fields.join(",")})`);
            }
        }

        return rows;
    }

}