import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    referrer: { type: String, default: 'Direct' },
    location: { type: String, default: 'Unknown' }
});

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    clicks: [clickSchema]
});

export default mongoose.model('Url', urlSchema);
