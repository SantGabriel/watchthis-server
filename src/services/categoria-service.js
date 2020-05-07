const db = require('../configs/mongodb.js').getDB();
const ObjectId = require('mongodb').ObjectID;

exports.getCategorias = () => {
  return new Promise((resolve, reject) => {
    db
      .collection('categorias')
      .find()
      .toArray()
      .then(categorias => resolve(categorias))
      .catch(err => reject(err));
  });
};

exports.getCategoria = id => {
  return new Promise((resolve, reject) => {
    db
      .collection('categorias')
      .findOne({ _id: ObjectId(id) })
      .then(categoria => resolve(categoria))
      .catch(err => reject(err));
  });
};

//Para popular categorias
/*
exports.insertCategorias = (categorias) => {
  return new Promise((resolve, reject) => {
    db
      .collection('categorias')
      .insertMany(categorias)
      .then(() => resolve({ inserted: true }))
      .catch(err => reject(err));
  });
};*/


