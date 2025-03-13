const mongoose = require('mongoose')

const ThongBaoBanner_Schema = new mongoose.Schema(
    {               
        title: { type: String},         
    },
    { 
        timestamps: true,   // createAt, updateAt
    },
);

const ThongBaoBanner = mongoose.model('ThongBaoBanner', ThongBaoBanner_Schema);

module.exports = ThongBaoBanner;