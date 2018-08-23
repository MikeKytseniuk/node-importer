const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    }
});

module.exports = mongoose.model('Contact', ContactSchema);