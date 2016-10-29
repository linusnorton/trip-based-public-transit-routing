
import Transfer from "./Transfer";

export default class TransferPreCalculation2 {

    public getTransfers(transfers: Transfer[]): Transfer[] {
        return transfers.filter(transfer => !transfer.isUTurn() || transfer.uTurnIsQuicker());
    }
}