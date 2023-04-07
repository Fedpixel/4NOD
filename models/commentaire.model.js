const {Schema, model} = require('mongoose')

const comentaireSchema = new Schema({
    //id: Géré par MongoDB
    author: String,
    content: String,
    date: {
        type: Date,
        required: false
    },
}, {timestamps: true})

module.exports = model('Commentaire', commentaireSchema, 'commentaires')