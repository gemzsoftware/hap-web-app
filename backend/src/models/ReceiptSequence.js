import mongoose from 'mongoose';

const receiptSequenceSchema = new mongoose.Schema(
    {
        year: {
            type: Number,
            required: true,
            unique: true
        },

        sequence: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

export const ReceiptSequence = mongoose.model(
    'ReceiptSequence',
    receiptSequenceSchema
);