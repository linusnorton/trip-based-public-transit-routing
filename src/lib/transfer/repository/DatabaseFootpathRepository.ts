
import FootpathRepository from "./FootpathRepository";
import {Station, Stop} from "../../trip/Trip";
import {Duration} from "./FootpathRepository";
import InMemoryFootpathRepository from "./InMemoryFootpathRepository";

export default class DatabaseFootpathRepository {
    private db;

    public constructor(db) {
        this.db = db;
    }

    public async getMemoryRepository(): Promise<InMemoryFootpathRepository> {
        return undefined;
    }

}