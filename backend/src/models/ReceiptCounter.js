import mongoose from 'mongoose';

const receiptCounterSchema = new mongoose.Schema(
    {
        year: {
            type: Number,
            required: true,
            unique: true,
            index: true
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

export const ReceiptCounter = mongoose.model(
    'ReceiptCounter',
    receiptCounterSchema
);