const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, " Please enter your name"],
        maxLenth: [20,"Please name cannot exceed 20 characters"]
    },
    email:{
        type: String,
        required: [true, " Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    password:{
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password must be at least 6 characters long"],
        select: false
    },
    avatar: {
        public_id:{
            type: String,
        
        },
        url: {
            type: String,

        }
    },
    roles: {
        type: String,
        default: 'user'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

// Encrypting password before saving user to database
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password , 10)
})

// Compare user password 
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}


// Return JWT Token 
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

// Generate password reset token 
userSchema.methods.getResetPasswordToken = function(){
    //  Generate token 
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to reset passwordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expire time. 
    this.resetPasswordExpire = Date.now() + 30 * 60 *1000

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);