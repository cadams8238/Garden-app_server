const mongoose = require('mongoose');

const gardenSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: String,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

gardenSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    }
});


module.exports = mongoose.model('Garden', gardenSchema);
