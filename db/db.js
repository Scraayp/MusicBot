const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://user:MltQr5aavrXIeueV@cluster0.vn729fq.mongodb.net/OctoBot?retryWrites=true&w=majority').catch(err => {
    if(err){
        console.error(err);
        return;
    }else {
        console.log("Database connected.")
    }
})