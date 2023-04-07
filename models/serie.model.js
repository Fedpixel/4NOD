const {Schema, model} = require('mongoose')

const serieSchema = new Schema({
    //id: Géré par MongoDB
    name: String,
    releaseDate: String,
    numberOfSeason: Number,
    description: String,
    imgUrl: String,
    comments: [
        {
            //id: Géré par MongoDB
            content: String,
            author: String,
            date: String
        }
    ]
}, {timestamps: true})

module.exports = model('Serie', serieSchema, 'series')