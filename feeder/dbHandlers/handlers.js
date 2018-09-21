const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/feeder');
const MongoDBContact = require('../models/contact');
const HTTPError = require('../../HTTPError');

const MongoDbHandlers = {
    create: async function (contact, log) {
        let newContact = await MongoDBContact.create(contact);

        return {
            email: log.id,
            action: log.action,
            success: Boolean(newContact),
            msg: newContact ? 'Succesfully created' : 'Already exists'
        }
    },

    update: async function (newContact, oldContact, log) {
        let result = await MongoDBContact.updateOne(newContact, oldContact);

        return {
            email: log.id,
            action: log.action,
            success: Boolean(result.n),
            msg: result.n ? 'Succesfully updated' : 'There is no contact by given email'
        }
    },

    delete: async function (log) {
        let result = await MongoDBContact.deleteOne({ email: log.id });

        return {
            email: log.id,
            action: log.action,
            success: Boolean(result.n),
            msg: result.n ? 'Succesfully deleted' : 'There is no contact by given email'
        }
    }

};


async function makeMongoDbAction(referenceContact, log) {

    if (!referenceContact) {
        return MongoDbHandlers.delete(log);
    }

    let mongoReferenceContact = await MongoDBContact.findOne({ email: referenceContact.email });

    if (!mongoReferenceContact) {
        return MongoDbHandlers.create(referenceContact, log);
    }

    
    return MongoDbHandlers.update(referenceContact, mongoReferenceContact, log);
}

module.exports = makeMongoDbAction;
