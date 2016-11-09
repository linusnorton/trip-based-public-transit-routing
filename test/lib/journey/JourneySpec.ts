
import * as chai from "chai";

import Leg from "../../../src/lib/journey/Leg";
import Journey from "../../../src/lib/journey/Journey";
import {Stop} from "../../../src/lib/trip/Trip";

describe("Journey", () => {

    it("knows when it departs and arrives", () => {
        const journey = new Journey([
            new Leg([
                new Stop("A", Infinity, 1000),
                new Stop("B", 1005, 1005),
                new Stop("C", 1010, Infinity),
            ]),
            new Leg([
                new Stop("D", Infinity, 1015),
                new Stop("E", 1025, 1025),
                new Stop("F", 1030, Infinity),
            ]),
        ]);

        chai.expect(journey.departureTime).to.equal(1000);
        chai.expect(journey.arrivalTime).to.equal(1030);
    });

    it("knows when it is dominating", () => {
        const journeyA = new Journey([
            new Leg([
                new Stop("A", Infinity, 1000),
                new Stop("B", 1010, Infinity),
            ]),
            new Leg([
                new Stop("C", Infinity, 1015),
                new Stop("D", 1030, Infinity),
            ]),
        ]);

        const journeyB = new Journey([
            new Leg([
                new Stop("A", Infinity, 1000),
                new Stop("B", 1010, Infinity),
            ]),
            new Leg([
                new Stop("C", Infinity, 1015),
                new Stop("D", 1040, Infinity),
            ]),
        ]);

        const journeyC = new Journey([
            new Leg([
                new Stop("A", Infinity, 1000),
                new Stop("D", 1050, Infinity),
            ]),
        ]);

        chai.expect(journeyA.dominates(journeyB)).to.equal(true);
        chai.expect(journeyB.dominates(journeyA)).to.equal(false);
        chai.expect(journeyA.dominates(journeyC)).to.equal(false);
        chai.expect(journeyC.dominates(journeyA)).to.equal(false);
    });

});