const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const { WebSocketServer} = require('ws');

const mainRouter = require('../router/Router');
const cookieParser = require('cookie-parser');

class ExpressLoader {
    constructor() {
        const app = express();
        const PORT = process.env.PORT || 8000;
        let sslServer;
        try {
            sslServer = https.createServer({
                key: fs.readFileSync(path.join(__dirname, '../../', 'cert', 'key.pem')),
                cert: fs.readFileSync(path.join(__dirname, '../../', 'cert', 'cert.pem'))
            }, app);
            // Setup for ssl websocketserver
            const wss = new WebSocketServer({ server: sslServer });
            wss.on('connection', async (ws) => {
                ws.on('error', console.error);
              
                ws.on('message', function message(data) {
                  console.log('received: %s', data);
                });
                
                // basic sending current date to client
                const interval = setInterval(() => {
                    const currentDate = new Date().toLocaleString();
                    ws.send(currentDate)
                },1000)
                ws.on('close', () => {
                    clearInterval(interval)
                })
            });
        } catch(err) {
            console.log(err);
        }

        // Docs setup
        const swaggerUI = require('swagger-ui-express');
        const YAML = require('yamljs');
        const swaggerJsDocs = YAML.load(path.join(__dirname, '../../' , 'api.yaml'));
        app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

        // Setup view engine
        app.set('views', path.join(__dirname, '../../', 'views'));
        app.set('view engine', 'ejs');
        
        
        // Middleware
        app.use(cors());
        app.use(express.json());
        app.use(cookieParser());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(morgan('dev'))

        // Routers
        app.use('/', mainRouter);

        if(sslServer) {
            this.server = sslServer.listen(PORT, () => {
                console.log(`SSL Server listening on port: ${PORT}`);
            });
        } else {
            this.server = app.listen(PORT, () => {
                console.log(`Server listening on port: ${PORT}`);
            })
        }
        
    }

    getServer() {
        return this.server;
    }
}

module.exports = ExpressLoader;