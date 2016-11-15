
import Container from "../src/app/Container";

const container = new Container();

container
    .runQueryCommand()
    .run()
    .then(_ => container.db().end())
    .catch(err => {
        console.error(err);
        container.db().end();
    });

