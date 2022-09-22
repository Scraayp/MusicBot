const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    _id: String,
    caseID: String,
    caseGuild: String,
    userID: String,
    caseMod: String,
    caseAction: String,
    caseReason: String,
    caseDate: String,
});
  
const CaseModel = mongoose.model('Case', caseSchema);

module.exports = CaseModel;