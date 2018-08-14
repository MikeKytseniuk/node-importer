module.exports = (sequelize, Sequelize) =>
    sequelize.define('contact', {
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        phoneNumber: {
            type: Sequelize.STRING
        }
    });

