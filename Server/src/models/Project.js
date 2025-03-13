const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    images: [String],  // Store image URLs
    videos: [String],  // Store video URLs
    documents: [String],  // Store document URLs
    progress: { type: Number, default: 0 }  // 0-100%
});

module.exports = mongoose.model('Project', ProjectSchema);
