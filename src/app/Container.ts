
export default class {

    private constructors = {

    };

    private cache = {};

    /**
     * @param name
     * @returns {any}
     */
    get(name: string): any {
        if (!this.constructors[name]) {
            throw new Error("Unknown dependency: " + name);
        }
        if (!this.cache[name]) {
            this.cache[name] = this.constructors[name]();
        }
        return this.cache[name];
    }
}
