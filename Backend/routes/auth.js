//we will use router

const express = require('express');
const router = express.Router();
const User = require('../models/User')
//for validation
const { body, validationResult } = require('express-validator');

//for password encyption
const bcryptjs = require('bcryptjs');

//login authentication token
const jwt = require('jsonwebtoken');
const JWT_SECRET = "INOtebook JWT secret for security"

//for using fetchuser middleware
const fetchuser = require('../middleware/fetchuser');


//-------------------------------------------------------------
// end point for USER using post method for "/api/auth". auth not req at this point (no login)
//ROUTE 2
//POST: /api/auth/createuser
router.post('/createuser', [

    //express validator
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('password', 'atleast 5 characters').isLength({ min: 3 }),
    body('email').isEmail(),

], async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // check if usaer with this emai exists
    try {
        let user = await User.findOne({
            email: req.body.email
        })
        if (user) {
            return res.status(400).json({ error: "user with this email already exists" })
        }

        // secure password generation
        const salt = await bcryptjs.genSalt(10);
        securePassword = await bcryptjs.hash(req.body.password, salt);
        //creating a new user
        user = await User.create({
            name: req.body.name,
            password: securePassword,
            email: req.body.email
        });
        const data = {
            user: {
                id: user.id
            }
        }
        // generate jwt authentication token
        const authToken = jwt.sign(data, JWT_SECRET)
        //send toke as response
        res.json(authToken)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured")
    }

})

//-------------------------------------------------------------
//ROUTE 2
//USER WITH LOGIN REQUIURED 
//POST : api/auth/login

router.post('/login', [

    //express validator
    body('password', 'cannot be blank').exists(),
    body('email').isEmail(),

], async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please enter correct credentials" })
        }

        const passwordCompare = await bcryptjs.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please enter correct credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        // generate jwt authentication token
        const authToken = jwt.sign(data, JWT_SECRET)
        //send toke as response
        res.json(authToken)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error")
    }

})
//---------------------------------------------------------------
//ROUTE 3
// get details of already logeed in user
//POST: /api/auth/getUser


router.post('/getuser', fetchuser , async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        let userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error")

    }
})

module.exports = router;