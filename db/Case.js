const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    userID: String,
    caseID: String,
    caseReason: String,
    caseMod: String,
    caseDate: Date
});
  
const CaseModel = mongoose.model('Case', caseSchema);

module.exports = CaseModel;