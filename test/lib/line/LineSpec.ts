
import * as chai from "chai";

import Line from "../../../src/lib/line/Line";
import {TripFixtures} from "../trip/TripSpec";
import {Some} from "ts-option";

describe("Line", () => {

    it("adds trips in order", () => {
        const line = new Line([TripFixtures.tripB]);
        line.add(TripFixtures.tripA);

        const expected = [
            TripFixtures.tripA,
            TripFixtures.tripB
        ];

        chai.expect(line.trips).to.deep.equal(expected);
    });

    it("returns the stopping pattern", () => {
        const line = new Line([TripFixtures.tripA]);

        chai.expect(line.stoppingStations()).to.deep.equal(["A", "B", "C"]);
    });

    it("gets the first trip", () => {
        const line = new Line([TripFixtures.tripB, TripFixtures.tripB]);
        const expected = new Some(TripFixtures.tripB);

        chai.expect(line.getEarliestTripAt(1, 1007)).to.deep.equal(expected);
    });

    it("returns trips after a certain point", () => {
        const line = new Line([TripFixtures.tripA, TripFixtures.tripB, TripFixtures.tripC]);
        const expected = [TripFixtures.tripB, TripFixtures.tripC];

        chai.expect(line.tripsAfterAndIncluding(TripFixtures.tripB)).to.deep.equal(expected);
    });

});