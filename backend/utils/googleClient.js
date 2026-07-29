const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

module.exports = googleClient;