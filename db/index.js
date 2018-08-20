//Database
const Sequelize = require('sequelize');
const sequelize = new Sequelize('nodeImporter', 'postgres', '040527', {
    host:'localhost',
    dialect: 'postgres'
});

sequelize.sync();
module.exports = {
    Contact: require('./contact')(sequelize, Sequelize)
  };

//module.exports = sequelize;