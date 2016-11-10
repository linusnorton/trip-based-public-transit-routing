
import Transfer from "../Transfer";
import Trip from "../../trip/Trip";
import {Map} from "immutable";

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
    public async storeTransfers(transfers: TransfersMap): Promise<any> {
        const rows = transfers.map(this.getRows).flatten().valueSeq();
        
        return this.db.query(`
            INSERT INTO trip_transfers VALUES ${rows.join(",")}
        `);
    }

    /**
     * 
     */
    private getRows(tripTransfers: Map<number, Transfer[]>, trip: Trip): string[] {
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

        return rows;
    }

}