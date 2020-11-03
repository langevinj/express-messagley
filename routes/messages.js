const Router = require("express").Router;
const Message = require("../models/message")
const {ensureLoggedIn} = require("../middleware/auth");
const ExpressError = require("../expressError");
const router = new Router();

/**- get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 **/

router.get("/:id", ensureLoggedIn, async function(req, res, next) {
    try {
        const username = req.user.username;
        const message = await Message.get(req.params.id)
        
        if(message.from_user.username !== username && message.to_user.username !== username){
            throw new ExpressError("Cannot read this message", 401);
        }
        return res.json({message})
    } catch(e) {
        return next(e);
    }
});

/** - post message.
 *
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureLoggedIn, async function(req, res, next) {
    try{
        const message = await Message.create({
            from_username: req.user.username,
            to_username: req.bod.to_username,
            body: req.body.body
        });
        return res.json({message: message});
    } catch(e) {
        return next(e)
    }
});


/** mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 **/
router.post("/:id/read", ensureLoggedIn, async function(req, res, next) {
    try {
        const result = await Message.get(req.params.id)
        if(result.to_user.username !== req.user.username){
            throw new ExpressError("You cannot mark this message read", 401)
        }
        let message = await Message.markRead(req.params.id)
        return res.json({message});
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
