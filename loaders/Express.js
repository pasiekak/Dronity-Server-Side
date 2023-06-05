const express = require('express');


class ExpressLoader {
    constructor() {
        const app = express();
        const PORT = process.env.PORT || 8000;

        // Middleware
        app.use(express.json());

        // Routers

        this.server = app.listen(PORT, () => {
            console.log(`Server listening on port: ${PORT}`);
        });
    }

    getServer() {
        return this.server;
    }
}

module.exports = ExpressLoader;