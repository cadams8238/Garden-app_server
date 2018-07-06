// const mongoose = require('mongoose');
//
// const taskSchema = new mongoose.Schema({
//     date: Date,
//     description: String,
//     completed: Boolean
// })
//
// taskSchema.set('toObject', {
//     virtuals: true,
//     versionKey: false,
//     transform: (doc, ret) => {
//         delete ret._id;
//     }
// });
//
// module.exports = mongoose.model('Task', taskSchema);
