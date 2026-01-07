const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        targetRole: {
            type: String,
            required: true,
        },
        experienceLevel: {
            type: String,
            required: true,
        },
        weakAreas: [String],
        readinessScore: {
            type: Number,
            default: 0,
        },
        weeklyRoadmap: [
            {
                week: Number,
                topics: [
                    {
                        title: String,
                        description: String,
                        priority: {
                            type: String,
                            enum: ['High', 'Medium', 'Low'],
                            default: 'Medium',
                        },
                        completed: {
                            type: Boolean,
                            default: false,
                        },
                    },
                ],
            },
        ],
        status: {
            type: String,
            enum: ['active', 'archived'],
            default: 'active',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
