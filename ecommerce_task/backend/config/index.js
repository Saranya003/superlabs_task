

require('dotenv').config({ path: __dirname + '/../../.env' });
console.log(__dirname );

// config.js
module.exports = {
    app: {
        baseUrl: process.env.APP_BASE_URL,
        clientUrl: process.env.CLIENT_URL,
        port: process.env.APP_PORT,
        appName: process.env.APP_NAME,
        env: process.env.NODE_ENV,
        encryptionPassword: process.env.APP_ENCRYPT_PASSWORD,
        encryptionIV: process.env.APP_ENCRYPT_IV,
    },
    db: {
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        username: process.env.DB_USER,
        host: process.env.DB_HOST,
        maxConnections: 100,
        dialect: 'postgres',
        logging: true
    },
    winiston: {
        logpath: '/logs/',
    },
    auth: {
        jwt_secret: process.env.JWT_SECRET,
        jwt_expiresin: process.env.JWT_EXPIRES_IN,
        saltRounds: process.env.SALT_ROUND || 10,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expiresin: process.env.REFRESH_TOKEN_EXPIRES_IN,

        supervisor_jwt_secret: process.env.SUPERVISOR_JWT_SECRET
    },

    imageFormats: [
        ".jpeg",
        ".jpg",
        ".png",
        ".gif",
        ".tiff",
        ".bmp",
        ".svg",
        ".raw",
        ".webp",
        ".heif"
    ],


};