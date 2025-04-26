const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider',
        required: true
    },
    schedule: {
        Sunday: [{ time: String, isBooked: Boolean, bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', default: null },  bookingDate: { type: Date, default: null} }],
        Monday: [{ time: String, isBooked: Boolean, bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', default: null },  bookingDate: { type: Date,default: null} }],
        Tuesday: [{ time: String, isBooked: Boolean, bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', default: null },  bookingDate: { type: Date, default: null} }],
        Wednesday: [{ time: String, isBooked: Boolean, bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', default: null }, bookingDate: { type: Date, default: null} }],
        Thursday: [{ time: String, isBooked: Boolean, bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', default: null },  bookingDate: { type: Date, default: null} }],
        Friday: [{ time: String, isBooked: Boolean, bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', default: null },  bookingDate: { type: Date, default: null} }],
        Saturday: [{ time: String, isBooked: Boolean, bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', default: null }, bookingDate: { type: Date,default: null} }]
    }
}, { timestamps: true });

const TimeTable = mongoose.model('TimeTable', timeTableSchema);
module.exports = TimeTable;
