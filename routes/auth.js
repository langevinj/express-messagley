const Router = require("express").Router;
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");

const router = new Router();
 /**login: {username, password} => {token} */
router.post("/login", async function(req, res, next) {
    try{
        const { username, password } = req.body;
        const result = await User.authenticate(username, password);

        if(result === true){
            let token = jwt.sign({ username }, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({ token })
        } else {
            throw new ExpressError("Invalid username/password", 400)
        }
    } catch (e) {
        return next(e);
    }
});

/**  register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post("/register", async function (req, res, next) {
    try{
        const { username } = await User(req.body);
        let token = jwt.sign({ username }, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({ token });

    } catch (e) {
        return next(e);
    }
});

 module.exports = router;