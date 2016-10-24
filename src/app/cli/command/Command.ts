
interface Command {
    run(...args: string[]): Promise<void>;
}

export default Command;
