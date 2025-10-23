require('dotenv').config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://giahuyngngoc_db_user:DtTKR7EGRFlFjOsu@appdich.xvnqneq.mongodb.net/',
  PORT: process.env.PORT || 3000
};
