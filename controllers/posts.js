const cloudinary = require('../middleware/cloudinary')
const Post = require('../models/Post')

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
}