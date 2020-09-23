require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const connectionString = `mongodb+srv://${process.env.API_USERNAME}:${process.env.API_KEY}@cluster0.lfwrb.mongodb.net/crud_app?retryWrites=true&w=majority`;

// Callback version
// MongoClient.connect(connectionString, {
//     useUnifiedTopology: true
// },(err, client) => {
//     if (err) return console.error(err);
//     console.log('Connected to Database');
// });

// Promise Version
MongoClient.connect(connectionString, {
    useUnifiedTopology: true})
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('crud_app');
        const quotesCollection = db.collection('quotes');

        app.set('view engine', 'ejs');
        app.use(express.static('public'));
        app.use(bodyParser.json());

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error));
        });
            
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/');
                })
                .catch(error => console.error(error));
        });

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda'},
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result => {
                console.log(result);
            })
            .catch(error => console.error(error));
        });

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
            .then(result => {
                if (result.deletedCount === 0){
                    return res.json('No quote to delete');
                }
                res.json(`Deleted Darth Vadar's quote`);
            })
            .catch(error => console.log(error));
        })

    })
    .catch(error => console.error(error));

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function(){
    console.log('listening on 3000');
});

// Traditionally written 
// app.get('/', function(req, res){
//     res.send('Hello World');
// });

// ES6 arrow function version
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });
