const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    names: [{
        lang: String,
        text: String
    }],
    descriptions: [{
        lang: String,
        text: String
    }],
    images: [String],
    timestamps: {
        creationDate: {
            type: Date,
            default: Date.now
        },
        updateDate: {
            type: Date,
            default: Date.now
        },
        deletionDate: {
            type: Date
        }
    }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;