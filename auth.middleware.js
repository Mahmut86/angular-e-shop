const jwt = require("jsonwebtoken");
const app_secret = "myappsecret";
const username = "admin";
const password = "12345";

module.exports = function(req, res, next) {
    if (req.url === "/login" && req.method == "POST") {
        if (req.body.username === username && req.body.password === password) {
            let token = jwt.sign({ data: username, expressIn: "1h" }, app_secret);
            res.json({ success: true, token: token });
        } else {
            res.json({ success: false });
        }
        res.end();
        return;
    } else {
        if (
            (req.url.startsWith("/products") || req.url.startsWith("/categories")) &&
            req.method != "GET"
        ) {

            let token = req.headers["authorization"];
            console.log(token)

            if (token != null && token.startsWith('Bearer<')) {

                token = token.substring(7, token.length - 1);
                console.log(token)

                try {
                    jwt.verify(token, app_secret);
                    next();
                    return;
                } catch (err) {}
            }
            res.statusCode = 401;
            res.end();
            return;
        }
    }
    next();
};