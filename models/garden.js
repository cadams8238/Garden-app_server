const mongoose = require('mongoose');

const gardenSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    zipcode: { type: Number, required: true },
    description: String,
    // tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

//adds 'createdAt' and 'updatedAt' fields
gardenSchema.set('timestamps', true);

gardenSchema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    }
});


module.exports = mongoose.model('Garden', gardenSchema);
