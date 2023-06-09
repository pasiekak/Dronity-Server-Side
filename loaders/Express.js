const express = require('express');
const mainRouter = require('../router/Router');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');

class ExpressLoader {
    constructor() {
        const app = express();
        const PORT = process.env.PORT || 8000;
        
        // Setup view engine
        app.set('views', path.join(__dirname, '../', 'views'));
        app.set('view engine', 'ejs');
        
        
        // Middleware
        app.use(express.json())
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(morgan('dev'))

        // Routers
        app.use('/', mainRouter);

        this.server = app.listen(PORT, () => {
            console.log(`Server listening on port: ${PORT}`);
        });
    }

    getServer() {
        return this.server;
    }
}

module.exports = ExpressLoader;