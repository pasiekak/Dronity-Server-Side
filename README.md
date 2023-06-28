# REST API with node.js, sqlite3, swagger and sequelize
## Requirements
- node.js and npm
- git
## Instruction
1. Clone repository using this command
```git
git clone https://github.com/pasiekak/REST-API-node.git
```
2. Enter the created folder
```cmd
cd <repository-folder>
```
3. Install dependencies using npm
```npm
npm i
```
4. Fill database with sequelize seeders
```npx
npx sequelize db:seed:all
```
5. Set your environment jwt secret in .env
```
JWT_SECRET="******" # Enter your secret password here
```
6. Optional: Test empty database using npm
```npm
npm test
```
7. Change name of _example_.pem to cert.pem and key.pem and fill them with your key and certificate. Otherwise https and secure websocket wont work.
8. Run project
```npm
npm run dev
```
9. Open your browser and go to
```
https://localhost:8000
```
10. You should see login page, available credentials are:
```
1. login: admin     password: admin
2. login: moderator password: moderator
3. login: operator  password: operator
4. login: client    password: client
```