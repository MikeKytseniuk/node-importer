//Database
const Sequelize = require('sequelize');
const sequelize = new Sequelize('nodeImporter', 'postgres', '040527', {
    host:'localhost',
    dialect: 'postgres'
});

sequelize.sync().catch(err => console.log(err));

module.exports = {
    Contact: require('./contact')(sequelize, Sequelize)
  };

