const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    caseID: String,
    caseGuild: String,
    userID: String,
    caseMod: String,
    caseAction: "Warn" || "Tempmute" ||  "Mute" || "Kick" || "Ban" || "Mass Kick" || "Mass Ban" || "Lockdown" || "Mass Role Add" || "Mass Role Remove" || "Mass Everyone Role Change",
    caseReason: String,
    caseDate: String,
});
  
const CaseModel = mongoose.model('Case', caseSchema);

module.exports = CaseModel;