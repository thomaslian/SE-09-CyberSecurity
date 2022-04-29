const admin = require('firebase-admin');

module.exports = async function (req, res, next) {
    if (!req.headers.authorization) return res.status(400).json({ message: "ID token needed!" });
    try {
        const decodedToken = await admin.auth().verifyIdToken(req.headers.authorization);
        if (decodedToken.uid) {
            console.log(`User with UID ${decodedToken.uid} accessed the server!`);
            next();
        } else {
            return res.status(401).json({ message: "ID token is not properly formatted or unexpired" });
        }
    } catch (e) {
        console.log("Could not decode id token");
        console.log(e);
        return res.status(401).json({ message: "ID token is not properly formatted or unexpired" });
    }
}
