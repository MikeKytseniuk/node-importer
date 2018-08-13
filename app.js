const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const amqp = require('amqplib/callback_api');
const importer = require('./api/index');

//Database
const Sequelize = require('sequelize');
const sequelize = new Sequelize('nodeImporter', 'postgres', '040527', {
    host:'localhost',
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000  
    }
});
//const sequelize = new Sequelize('postgres://postgres:040527:5432/nodeImporter');

const Contact = sequelize.define('contact', {
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

Contact.sync().then(() => {
    // Table created
    return Contact.create({
      firstName: 'John',
      lastName: 'Hancock',
      email: 'lol',
      phoneNumber: 'kek'
    });
  });
/* sequelize.authenticate()
    .then(() => {
        console.log('connectiob has been established successfully');
    })
    .catch(err => {
        console.log('unable', err)
    }); */
//Routes
const indexRouter = require('./routes/index');
const contactsRouter = require('./routes/contact');

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {

    });
});

const app = express();

//body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', indexRouter);
app.use('/contacts', contactsRouter);

app.use('/', (req, res) => {
    res.render('index');
});



app.listen(3000);