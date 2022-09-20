const mongoose = require('mongoose');

mongoose.connect('').catch(err => {
    if(err){
        console.error(err);
        return;
    }
})