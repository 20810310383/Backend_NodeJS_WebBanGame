const mongoose = require('mongoose')

const Feedback_Schema = new mongoose.Schema(
    {
        TenSP: { type: String, required: false },       
        ImageSlider: [{ type: String }],            
    },
    { 
        timestamps: true,   // createAt, updateAt
    },
);


const Feedback = mongoose.model('Feedback', Feedback_Schema);

module.exports = Feedback;