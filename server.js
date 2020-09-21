const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;

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

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/');
                })
                .catch(error => console.error(error));
        });
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
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
