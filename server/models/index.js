const { Schema, model } = require('mongoose')

const InternetConnectionRequestSchema = new Schema({
  personalData: {
    contacts: {
      surname: String,
      name: String,
      patronymic: String,
      phone: String,
      email: String
    }
  },
  order: {
    tariffPlan: String,
    addServices: [String],
    connectionAddress: {
      postalCode: String,
      region: String,
      settlementType: String,
      settlement: String,
      streetType: String,
      street: String,
      noStreet: Boolean,
      house: String,
      building: String,
      typeRoom: String,
      room: String,
      noRoom: Boolean,
      addressCommentary: String
    }
  },
  passportData: {
    manager: String,
    otherWishes: String,
    passportData: {
      resident: String,
      citizenship: String,
      temporaryRegistration: String,
      documentType: String,
      series: String,
      number: String,
      dateOfIssue: Date,
      dateOfExpiry: Date,
      identificationNumber: String,
      passportIssuedBy: String
    },
    registrationAddress: {
      sameAsConnectionAddress: Schema.Types.Mixed,
      postalCode: String,
      region: String,
      settlementType: String,
      settlement: String,
      streetType: String,
      street: String,
      noStreet: Boolean,
      house: String,
      building: String,
      typeRoom: String,
      room: String,
      noRoom: Boolean,
      addressCommentary: String
    }
  }
})

const InternetConnectionRequestModel = model(
  'InternetConnectionRequest',
  InternetConnectionRequestSchema
)

module.exports = InternetConnectionRequestModel
