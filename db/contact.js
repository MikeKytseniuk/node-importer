module.exports = (sequelize, Sequelize) =>
    sequelize.define('contact', {
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
