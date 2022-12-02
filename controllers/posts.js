const cloudinary = require('../middleware/cloudinary')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const User = require('../models/User')

module.exports = {
    getProfile: async (req, res) => {
        try {
            const posts = await Post.find({ user: req.user.id })
            res.render('profile', {
                posts: posts,
                user: req.user,
                title: req.user.userName
            })
        } catch (error) {
            console.log(error)
        }
    },

    getFeed: async (req, res) => {
        try {
            const posts = await Post.find().sort({ createdAt: 'desc' }).lean()
            res.render('feed', {
                posts: posts,
                title: 'feed'
            })
        } catch (error) {
            console.log(error)
        }
    },
    
    createPost: async (req, res) => {
        try {
           //Upload image to cloudinary
           const result = await cloudinary.uploader.upload(req.file.path)

           await Post.create({
            title: req.body.title,
            image: result.secure_url,
            cloudinaryId: result.public_id,
            caption: req.body.caption,
            likes: 0,
            user: req.user.id,
           })
           console.log('Post has been added!')
           res.redirect('/profile')
        } catch (error) {
            console.log(error)
        }
    },

    getPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
            const comments = await Comment.find({post: req.params.id}).lean()
            const user = await User.find({user: req.user}).lean()
            console.log(req.user)
            // console.log(comments)
            console.log(req.user)
	        res.render('post', {
	            post: post,
                comments: comments,
	            user: user,
	            title: req.user.userName + ' post'
	        })
        } catch (error) {
            console.log(error)
        }

    },

    likePost: async (req, res) => {
        try {
            console.log(req.params.id)
            await Post.findOneAndUpdate(
                {_id: req.params.id}, 
                {
                    $inc: {likes: 1}
                }
            )
            console.log('Likes +1')
            res.redirect(`/post/${req.params.id}`)
        } catch (error) {
            console.log(error)
        }
    },

    deletePost: async (req, res) => {
        try {
            //Find the post by id
            let post = await Post.findById({ _id: req.params.id })
            //delete image from cloudinary
            await cloudinary.uploader.destroy(post.cloudinaryId)
            //delete post from DB
            await Post.remove({ _id: req.params.id })
            console.log('Deleted post')
            res.redirect('/profile')
        } catch (error) {
            console.log(error)
        }
    }
}