// Pull in dependencies
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require('jsonwebtoken');
require("../../config/passport")(passport);

// Load User model
const User = require("../../models/User");
const Contact = require("../../models/Contact");

// @route GET api/contacts/list
// @desc returns an array of object{username, status}
// @access public
router.get("/list", passport.authenticate('jwt', {session: false}), async (req, res) => {
    let userRequester = await User.findById(req.user.id, (error, userReq) => {
        if (error) {
            return console.log(`Error has occurred: ${error}`);
        }
        return userReq;
    });

    Contact.find({requester: userRequester}, {recipient: true, status: true})
        .populate('recipient', 'username profile.image')
        .then(contacts => {
            res.json(contacts);
        });
});


// @route POST api/contacts/request
// @desc request contact
// @access Public
router.post("/request", passport.authenticate('jwt', {session: false}), async (req, res) => {

    //Get requester and recipient
    let Requester = await User.findById(req.user.id, (error, userReq) => {
        if (error) {
            return console.log(`Error has occurred: ${error}`);
        }
        return userReq;
    });

    let Recipient = await User.findOne({email: req.body.email}, (error, userRec) => {
        if (error) {
            return console.log(`Error has occurred: ${error}`);
        }
        return userRec;
    });

    if (!Recipient) {
        return res.status(404).json({ msg: "E-mail address not found" });
    }

    //Make contacts
    const docRequester = await Contact.findOneAndUpdate(
        {requester: Requester, recipient: Recipient},
        {$set: {status: 1}},
        {upsert: true, new: true}
    );
    const docRecipient = await Contact.findOneAndUpdate(
        {recipient: Requester, requester: Recipient},
        {$set: {status: 2}},
        {upsert: true, new: true}
    );

    await User.findOneAndUpdate(
        {_id: Requester.id},
        {$push: {contacts: docRequester._id}}
    );
    await User.findOneAndUpdate(
        {_id: Recipient.id},
        {$push: {contacts: docRecipient._id}}
    );
    return res.status(200).json({msg: "Request sent"});
});

// @route POST api/contacts/accept
// @desc accept contact
// @access Public
router.post("/accept", passport.authenticate('jwt', {session: false}), async (req, res) => {

    //Get requester and recipient
    let Requester = await User.findById(req.user.id, (error, userReq) => {
        if (error) {
            return console.log(`Error has occurred: ${error}`);
        }
        return userReq;
    });
    let Recipient = await User.findOne({username: req.body.username}, (error, userRec) => {
        if (error) {
            return console.log(`Error has occurred: ${error}`);
        }
        return userRec;
    });

    await Contact.findOneAndUpdate(
        {requester: Requester, recipient: Recipient},
        {$set: {status: 3}}
    );
    await Contact.findOneAndUpdate(
        {recipient: Requester, requester: Recipient},
        {$set: {status: 3}}
    );
    return res.status(200).json({msg: "Friend request accepted"});
});

// @route POST api/contacts/reject
// @desc reject contact
// @access Public
router.post("/reject", passport.authenticate('jwt', {session: false}), async (req, res) => {

    //Get requester and recipient
    let Requester = await User.findById(req.user.id, (error, userReq) => {
        if (error) {
            return console.log(`Error has occurred: ${error}`);
        }
        return userReq;
    });
    let Recipient = await User.findOne({username: req.body.username}, (error, userRec) => {
        if (error) {
            return console.log(`Error has occurred: ${error}`);
        }
        return userRec;
    });

    const docA = await Friend.findOneAndRemove(
        {requester: Requester, recipient: Recipient}
    );
    const docB = await Friend.findOneAndRemove(
        {recipient: Requester, requester: Recipient}
    );
    await User.findOneAndUpdate(
        {_id: Requester.id},
        {$pull: {contacts: docA._id}}
    );
    await User.findOneAndUpdate(
        {_id: Recipient.id},
        {$pull: {contacts: docB._id}}
    )
    return res.status(200).json({msg: "Friend request declined"});
});

module.exports = router;