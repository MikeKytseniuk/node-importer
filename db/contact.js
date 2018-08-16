module.exports = (sequelize, Sequelize) =>
    sequelize.define('contact', {
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique:true
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique:true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique:true
        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
            unique:true
        }
    });
/* const Sequelize = require('sequelize')
const sequelize = require('./index');

   const contact = sequelize.define('contact', {
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique:true
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique:true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique:true
        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
            unique:true
        }
    })

module.exports = contact; */