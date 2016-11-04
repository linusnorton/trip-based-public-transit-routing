
import * as chai from "chai";
import InMemoryFootpathRepository from "../../../../src/lib/transfer/repository/InMemoryFootpathRepository";
import {Map} from 'immutable';

describe("Footpath repository", () => {

    it("knows the interchange time at a particular station", () => {
        const footpathRepo = new InMemoryFootpathRepository(Map({
            "A": Map({"A": 1}),
            "B": Map({"B": 2}),
            "C": Map({"C": 1}),
            "D": Map({"D": 1}),
        }));

        chai.expect(footpathRepo.getInterchangeAt("A")).to.equal(1);
        chai.expect(footpathRepo.getInterchangeAt("B")).to.equal(2);
    });

    it("returns the stations and duration of footpaths connected to a specific destination", () => {
        const footpathRepo = new InMemoryFootpathRepository(Map({
            "A": Map({"A": 1, "B": 2}),
            "B": Map({"B": 1}),
            "C": Map({"C": 1, "B": 2}),
        }));

        chai.expect(footpathRepo.getArrivalsAt("B")).to.deep.equal([
            ["A", 2],
            ["B", 1],
            ["C", 2]
        ]);
    });
});
