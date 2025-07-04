
import mongoose from 'mongoose';

const paymentHistorySchema = new mongoose.Schema({
    paymentId:
    {
        type: String,
        required: true
    },
    orderId:
    {
        type: String,
        required: true
    },
    studentName:
    {
        type: String,
        required: true
    },
    studentEmail:
    {
        type: String,
        required: true
    },
    referralId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Referral'
    },
    companyRequested:
    {
        type: String,
        required: true
    },
    amount:
    {
        type: Number,
        required: true
    },
    paymentDate:
    {
        type: Date,
        default: Date.now
    },
});

const PaymentHistory = mongoose.model('PaymentHistory', paymentHistorySchema);

export default PaymentHistory;
