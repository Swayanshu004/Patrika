const express = require("express");
const USER = require('../models/user')

const router = express.Router();

router
    .route('/signin')
    .get((req, res)=>{
        return res.render('signin')
    })
router
    .route('/signup')
    .get((req, res)=>{
        return res.render('signup')
    })

router
    .route('/signin')
    .post(async (req, res)=>{
        const {email, password} = req.body;
        try {            
            const token = await USER.matchPasswordAndGenerateToken(email, password);
            // console.log("in router :- ",token);
            return res.cookie("token", token).redirect("/");
        } catch (error) {
            return res.render('signin', {
                error: "Wrong Credential !!"
            })
        }
    })
router
    .route('/signup')
    .post(async (req, res)=>{
        const {fullname, email, password} = req.body;
        await USER.create({
            fullname,
            email,
            password
        });
        return res.redirect("/");
    })
router
    .route('/logout')
    .get((req, res)=> {
        return res.clearCookie("token").redirect('/');
    })

module.exports = router