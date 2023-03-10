const mongoose = require('mongoose');
const Blogpost = require('../models/blogpostModel');

/* Get all blogposts */
const getBlogposts = async (req, res) => {
    const blogposts = await Blogpost.find({}).sort({createdAt: -1});
    res.status(200).json(blogposts);
}

/* Get a single blogpost */
const getBlogpost = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Blogpost not found'});
    }
    const blogpost = await Blogpost.findById(id);
    if(!blogpost) {
        return res.status(404).json({error: 'Blogpost not found'});
    }
    res.status(200).json(blogpost);
}

/* Create a new blogpost */
const createBlogpost = async (req, res) => {
    const {title, description, publish_date, proj_id} = req.body;
    const profile_img = req.file;
    try {
        const blogpost = await Blogpost.create({title, description, publish_date, proj_id});
        if(profile_img) {
            blogpost.profile_img = profile_img.path;
        } else {
            console.log(profile_img);
        }
        res.status(200).json(blogpost);
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

/* Delete a blogpost */
const deleteBlogpost = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Blogpost not found'});
    }
    const blogpost = await Blogpost.findOneAndDelete({_id: id});
    if(!blogpost) {
        return res.status(404).json({error: 'Blogpost not found'});
    }
    res.status(200).json(blogpost);
}

/* Update a blogpost */
const updateBlogpost = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Blogpost not found'});
    }
    const blogpost = await Blogpost.findOneAndUpdate({_id: id}, {
        ...req.body, ...req.body
    });
    if(!blogpost) {
        return res.status(404).json({error: 'Blogpost not found'});
    }
    res.status(200).json(blogpost);
}

const addLike = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Blogpost not found'});
    }
    const blogpost = await Blogpost.findOneAndUpdate({_id: id}, {
        $inc: {"likes": 1}
    });
    if(!blogpost) {
        return res.status(404).json({error: 'Blogpost not found'});
    }
    return res.status(200).json(blogpost);
}

const removeLike = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Blogpost not found'});
    }
    const blogpost = await Blogpost.findOneAndUpdate({_id: id}, {
        $inc: {"likes": -1}
    });
    if(!blogpost) {
        return res.status(404).json({error: 'Blogpost not found'});
    }
    return res.status(200).json(blogpost);
}

module.exports = {
    getBlogposts,
    getBlogpost,
    createBlogpost,
    deleteBlogpost,
    updateBlogpost,
    addLike,
    removeLike
}