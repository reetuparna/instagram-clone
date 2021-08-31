const express=require('express');
const mongoose=require('mongoose');
const app=express();
const PORT= process.env.PORT || 5000;
const {MONGO_URI} = require('./config/secret');

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
mongoose.connection.on('connected', () => {
    console.log("success");
})

mongoose.connection.on('error', err => {
    console.log("error");
})

if(process.env.NODE_ENV == 'production'){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log("Running on ",PORT);
})