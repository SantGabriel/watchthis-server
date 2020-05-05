const MongoClient = require("mongodb").MongoClient;

const mongodb = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });

const connectDB = () => {
  return new Promise((resolve, reject) => {
    mongodb.connect((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
const getDB = () => mongodb.db("gurotudo");
const disconnectDB = () => _db.close();

module.exports = { connectDB, getDB, disconnectDB };
