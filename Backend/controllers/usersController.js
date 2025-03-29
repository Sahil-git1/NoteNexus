const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers =asyncHandler( async (req,res)=>{
  const users = await User.find().select('-password').lean()
  if(!users){
    return res.status(400).json({message:'No users found'})
  }
  res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser =asyncHandler( async (req,res)=>{
    const {username ,password , roles  } = req.body 

    if(!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message : 'All fields are required'})
    }
    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate){
      return res.status(409).json({message:'Duplicate Username'})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const userObject = {username, 'password':hashedPassword,roles}

    const user = await User.create(userObject)
    if(user){
        res.status(201).json({message:`New user ${username} created`})
    }
    else{
        res.status(400).json({message:"Invalid user data received"})
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser =asyncHandler( async (req,res)=>{
    const {username ,id, roles ,active,password } = req.body 

    if(!username || !password || !id || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean' ){
        return res.status(400).json({message : 'All fields are required'})
    }
    // User exist or not via id
    const user = await User.findById(id).exec()

    if(!user){
      return res.status(409).json({message:'User not found'})
    }
    // Provided Username is duplicate or not 
    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(400).json({message:"Duplicate username"})
    }
    // update user via save() that we get from mongoDB
   user.username = username
   user.roles = roles
   user.active = active
   if(password){
    user.password = await bcrypt(password,10)
   }
   // Saving User
    const updatedUser = await user.save()
    res.json({message:`${updateUser.username} updated`})
  
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser =asyncHandler( async (req,res)=>{
    const {id} = req.body 

    if( !id ){
        return res.status(400).json({message : 'User ID Required'})
    }
    // Get corresponding note
    const note = await Note.findByOne({user:id}).lean().exec()
    if(note){
        return res.status(400).json({message :`User has assigned notes`})
    }
    // If user found Or not
    const user = await User.findById(id).exec()
    if(!user){
        return res.status(409).json({message:'User not found'})
      }
    // delete the user  
      const result = await user.deleteOne()
      const reply = `Username ${result.username} with ID ${result._id} deleted`
      res.json(reply)
})

module.exports ={
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}