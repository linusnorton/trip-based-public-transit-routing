
import Transfer from "./Transfer";
export default class TransferPreCalculation2 {

    public getTransfers(transfers: Transfer[]): Transfer[] {
        const results: Transfer[] = [];

        for (const transfer of transfers) {
            if (!transfer.isUTurn() || transfer.uTurnIsQuicker()) {
                results.push(transfer);
            }
        }

        return results;
    }
}