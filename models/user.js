const mongoose=require('mongoose')
const {ObjectId} = mongoose.Schema.Types; 
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    pic: {
        type:String,
        default:'https://res.cloudinary.com/reetu-cloudinary/image/upload/v1630386604/default-avatar-profile-icon-vector-social-media-user-portrait-176256935_objteg.jpg',
    },
    followers: [{
        type: ObjectId,
        ref: 'User'
    }],
    following: [{
        type: ObjectId,
        ref: 'User'
    }]
})

mongoose.model("User",userSchema)