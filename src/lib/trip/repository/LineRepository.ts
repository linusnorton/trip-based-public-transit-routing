
type Line = Object;

interface LineRepository {
    getLines(): Promise<Line[]>;
    storeLine(line: Line): Promise<void>;
}

export default LineRepository;

export class DatabaseLineRepository implements LineRepository {
    private db;

    /**
     * @param db
     */
    public constructor(db) {
        this.db = db;
    }

    /**
     * @returns {Promise<Line[]>}
     */
    public getLines(): Promise<Line[]> {
        return undefined;
    }

    public storeLine(line: Line): Promise<void> {
        return undefined;
    }

}
