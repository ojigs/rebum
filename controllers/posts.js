const cloudinary = require('cloudinary')
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
    }
}