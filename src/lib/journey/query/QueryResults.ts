
import Journey from "../Journey";

export default class QueryResults {
    private journeys: Journey[];

    /**
     * @param journeys
     */
    public constructor(journeys: Journey[] = []) {
        this.journeys = journeys;
    }

    /**
     * Add a journey to the results and remove any journeys dominated by the new journey.
     *
     * @param journey
     */
    public add(journey: Journey) {
        this.journeys = this.journeys
            .filter(j => !journey.dominates(j))
            .concat(journey);
    }

    /**
     * @returns {Journey[]}
     */
    public getJourneys(): Journey[] {
        return this.journeys;
    }

}
