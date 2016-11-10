import Line from "../Line";
import InMemoryLineRepository from "./InMemoryLineRepository";

export default class DatabaseLineRepository {
    private db;

    /**
     * @param db 
     */
    public constructor(db) {
        this.db = db;
    }

    /**
     * Store the lines in the database
     * 
     * @param lines
     */
    public async storeLines(lines: InMemoryLineRepository): Promise<any> {
        return Promise.all(lines.getLines().map(this.persistLine));
    }

    private persistLine = async (line: Line, order: number): Promise<any> => {
        const uuid = undefined;
        const rows = line.trips.map(trip => `('${uuid}', ${trip.id}, ${order})`)

        return this.db.query(`INSERT INTO line_trips VALUES ${rows.join(',')}`);
    }

    
    public async getMemoryRepository(): Promise<InMemoryLineRepository> {
        return undefined;
    }
}