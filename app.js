require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const BLOGS = require('./models/blog');
const { checkFroAuthCookie } = require('./middlewares/authentication')
const cookiePaser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 8000;
// COLORS:  #000000  #14213d   #fca311  #e5e5e5   #FFFFFF

mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("MongoDb Connected"));



app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkFroAuthCookie("token"));
app.use(express.static(path.resolve("./public")))

app.get("/", async (req, res)=>{
    const allBlogs = await BLOGS.find({}).populate("createdBy");
    // console.log(allBlogs);
    return res.render('home', {
        user: req.user,
        blogs: allBlogs,
    });
})
app.get("/profile", (req, res)=>{
    return res.render('userProfile');
})
app.use("/user", userRoute)
app.use("/blog", blogRoute)

app.listen(PORT, ()=>{console.log("Server Started at",PORT);})