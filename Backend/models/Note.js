// basically models folder contains our schemas that we will make using mongoose to use in mongodb. it gives structure to the documents(tables) we will make

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const notesSchema = new Schema({
    user:{
        // just like we declare foreign keys
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user'  //refering to our user model
    } ,
    title: {
        type: String,
        required: true
    },

    description : {
        type: String,
        required: true
    },

    tag : {
        type: String,
        default : "general"
    },

    date: {
        type: Date,
        default: Date.now 
    },

});

module.exports = mongoose.model('notes' , notesSchema);