const mongoose = require('mongoose');

const ManagerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true
    },

    confirmPass: {
        type: String,
        required: true
    },

    role:  {
        type: Number,
        required: true
    }

    
});

const ManagerModel = mongoose.model("Manager", ManagerSchema);
module.exports= ManagerModel;