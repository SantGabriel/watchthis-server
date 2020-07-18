const db = require('../configs/mongodb.js').getDB();
const ObjectId = require('mongodb').ObjectID;

exports.getObras = (search) => {
    return new Promise((resolve, reject) => {
        let filter = search ? {"nome": { $regex: "(?i).*" + search + ".*" }} : {}; 
        db.collection("obras")
            .find(filter)
            .toArray()
            .then((obras) => resolve(obras))
            .catch((err) => reject(err));
    });
};

exports.getObra = (obraId) => {
    return new Promise((resolve, reject) => {
        db.collection("obras")
            .findOne({ _id: ObjectId(obraId) })
            .then((obra) => resolve(obra))
            .catch((err) => reject(err));
    });
};

exports.insertObra = (body) => {
    return new Promise((resolve, reject) => {
        db.collection("obras")
            .insertOne({
                nome: body.nome,
                tipo: body.tipo,
                url: body.url,
                categorias: body.categorias, //array de categorias
                dataInicio: body.dataInicio,
                dataFim: body.dataFim,
                avaliacao: body.avaliacao,
                duracao: body.duracao,
                nVotos: body.nVotos,
                nListas: body.nListas,
                descricao: body.descricao,
            })
            .then((res) => resolve({ inserted: 1, _id: res.insertedId }))
            .catch((err) => reject(err));
    });
};

exports.updateObra = (obraId, body) => {
    return new Promise((resolve, reject) => {
        db.collection("obras")
            .updateOne({ _id: ObjectId(obraId) }, {
                $set: {
                    nome: body.nome,
                    tipo: body.tipo,
                    url: body.url,
                    categorias: body.categorias, //array de categorias
                    dataInicio: body.dataInicio,
                    dataFim: body.dataFim,
                    avaliacao: body.avaliacao,
                    duracao: body.duracao,
                    nVotos: body.nVotos,
                    nListas: body.nListas,
                    descricao: body.descricao,
                },
            })
            .then(() => resolve({ updated: 1 }))
            .catch((err) => reject(err));
    });
};

exports.removeObra = (obraId) => {
    return new Promise((resolve, reject) => {
        db.collection("obras")
            .deleteOne({ _id: ObjectId(obraId) })
            .then(() => resolve({ removed: 1 }))
            .catch((err) => reject(err));
    });
};