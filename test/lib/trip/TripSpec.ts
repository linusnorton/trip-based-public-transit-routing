
import * as chai from "chai";

import Trip from "../../../src/lib/trip/Trip";
import {Stop} from "../../../src/lib/trip/Trip";
import Line from "../../../src/lib/line/Line";

export class TripFixtures {

    static tripA = new Trip([
        new Stop("A", Infinity, 1000),
        new Stop("B", 1005, 1006),
        new Stop("C", 1010, Infinity)
    ]);

    static tripB = new Trip([
        new Stop("A", Infinity, 1001),
        new Stop("B", 1007, 1008),
        new Stop("C", 1012, Infinity)
    ]);

    static tripC = new Trip([
        new Stop("A", Infinity, 1002),
        new Stop("B", 1006, 1007),
        new Stop("C", 1011, Infinity)
    ]);

    static tripD = new Trip([
        new Stop("X", Infinity, 1102),
        new Stop("Y", 1106, 1107),
        new Stop("Z", 1111, Infinity)
    ]);

    static tripE = new Trip([
        new Stop("A", Infinity, 1000),
        new Stop("B", 1005, 1006),
        new Stop("C", 1010, 1011),
        new Stop("D", 1015, Infinity)
    ]);

    static tripF = new Trip([
        new Stop("A", Infinity, 1005),
        new Stop("B", 1010, 1011),
        new Stop("C", 1015, 1016),
        new Stop("D", 1020, Infinity)
    ]);

    static tripG = new Trip([
        new Stop("D", Infinity, 1010),
        new Stop("C", 1015, 1016),
        new Stop("B", 1020, 1021),
        new Stop("A", 1025, Infinity)
    ]);

}

describe("Trip", () => {

    it("knows if it's overtaken", () => {
        chai.expect(TripFixtures.tripA.overtakesOrOvertakenBy(TripFixtures.tripB)).to.equal(false);
        chai.expect(TripFixtures.tripA.overtakesOrOvertakenBy(TripFixtures.tripC)).to.equal(false);
        chai.expect(TripFixtures.tripB.overtakesOrOvertakenBy(TripFixtures.tripA)).to.equal(false);
        chai.expect(TripFixtures.tripB.overtakesOrOvertakenBy(TripFixtures.tripC)).to.equal(true);
        chai.expect(TripFixtures.tripC.overtakesOrOvertakenBy(TripFixtures.tripA)).to.equal(false);
        chai.expect(TripFixtures.tripC.overtakesOrOvertakenBy(TripFixtures.tripB)).to.equal(true);
    });

    it("knows what line it belongs to", () => {
        const line = new Line([TripFixtures.tripA, TripFixtures.tripB]);

        chai.expect(TripFixtures.tripA.belongsToLine(line)).to.equal(true);
        chai.expect(TripFixtures.tripC.belongsToLine(line)).to.equal(false);
    });

    it("returns it's stopping pattern", () => {
        chai.expect(TripFixtures.tripC.stoppingPattern()).to.equal("ABC");
        chai.expect(TripFixtures.tripD.stoppingPattern()).to.equal("XYZ");
    });

    it("knows when it is dominating", () => {
        chai.expect(TripFixtures.tripA.dominates(TripFixtures.tripB)).to.equal(true);
        chai.expect(TripFixtures.tripB.dominates(TripFixtures.tripA)).to.equal(false);
    });

});