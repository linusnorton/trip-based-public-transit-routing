
import * as chai from "chai";

import Trip from "../../../src/lib/trip/Trip";
import {Stop} from "../../../src/lib/trip/Trip";
import Line from "../../../src/lib/trip/Line";

export class TripFixtures {

    static tripA = new Trip([
        new Stop("A", null, 1000),
        new Stop("B", 1005, 1006),
        new Stop("C", 1010, null)
    ]);

    static tripB = new Trip([
        new Stop("A", null, 1001),
        new Stop("B", 1007, 1008),
        new Stop("C", 1012, null)
    ]);

    static tripC = new Trip([
        new Stop("A", null, 1002),
        new Stop("B", 1006, 1007),
        new Stop("C", 1011, null)
    ]);

    static tripD = new Trip([
        new Stop("X", null, 1002),
        new Stop("Y", 1006, 1007),
        new Stop("Z", 1011, null)
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


});