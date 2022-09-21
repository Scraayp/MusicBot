const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    caseID: String,
    caseGuild: String,
    userID: String,
    caseMod: String,
    caseReason: String,
    caseDate: String,
});
  
const CaseModel = mongoose.model('Case', caseSchema);

module.exports = CaseModel;