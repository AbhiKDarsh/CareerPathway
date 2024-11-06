const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: true,
        
    },

    phone : {
        type : Number,
        required:false,
    },
    role: {
        type: Number,
        required: true,
    },
    resetCode:{
        type:String,
        default:''
    },
    resetCodeExpiration:{
        type:Date,
        default:Date.now
    },

    education: {
        type: String,
        enum:[ '10','+2','Under Graduate', 'Post Graduate'],
        required: false
    },

    courses:{
        type: [String],
        default: []
    },
    marks: {
        tenthMark: {
            type:Number,
            default:0
        },
        twelthMark:{
            type:Number,
            default:0
        },
        degreeMark:{
            type:Number,
            default:0
        },
        pgMark:{
            type:Number,
            default:0
        }

    }


}, { timestamps: true, versionKey: false });

const User = mongoose.model('User', userSchema);
module.exports = User;
