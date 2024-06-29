const express = require('express')
const multer  = require('multer')
const path = require('path')
const Blog = require('../models/blog')
const Comment = require('../models/comment')

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}_${file.originalname}`;
      cb(null, filename);
    }
  })
const upload = multer({ storage: storage })

router
    .route('/addblog')
    .get((req, res)=>{
        return res.render('addBlog', {
            user: req.user
        })
    })
router
    .route('/addblog')
    .post(upload.single("coverImageURL"), async (req, res)=>{
        const {title, content } = req.body;
        const blog = await Blog.create({
            title,
            content,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.file.filename}`
        })
        return res.redirect(`/blog/${blog._id}`);
    })
router
    .route('/:id')
    .get(async (req, res)=>{
        const blogs = await Blog.findById(req.params.id).populate("createdBy");
        const comments = await Comment.find({commentedOn: req.params.id}).populate("createdBy");
        // console.log(blog);
        console.log(comments);
        return res.render('blog', {
            user: req.user,
            blog: blogs,
            comments
        });
    })
router
    .route('/comment/:blogId')
    .post(async (req, res)=>{
        const comment = await Comment.create({
            content: req.body.content,
            commentedOn: req.params.blogId,
            createdBy: req.user._id
        })
        return res.redirect(`/blog/${req.params.blogId}`)
    })

module.exports = router;