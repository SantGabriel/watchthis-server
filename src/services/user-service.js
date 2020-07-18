const db = require("../configs/mongodb").getDB();
const cipher = require("../helpers/cipher");
const roles = require("../helpers/roles");
const ObjectId = require("mongodb").ObjectID;

exports.register = (username, rawPassword, role) => {
  return new Promise((resolve, reject) => {
    try {
      db.collection("users")
        .findOne({ username: username })
        .then((found) => {
          if (!found) {
            if (Object.values(roles).indexOf(role) > -1) {
              if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*#?&-.]{8,}$/.test(rawPassword)) {
                const dataIv = cipher.generateIv();
                const password = cipher.encrypt(rawPassword, dataIv);
                db.collection("users")
                  .insertOne({ username, password, role, dataIv, itensLista: [] })
                  .then(() => resolve())
                  .catch((error) => reject(error.message));
              } else reject("invalid password");
            } else reject("invalid role");
          } else reject("username already in use");
        })
        .catch((error) => reject(error.message));
    } catch (error) {
      reject(error.message);
    }
  });
};

exports.authenticate = (username, rawPassword) => {
  return new Promise((resolve, reject) => {
    db.collection("users")
      .findOne({ username: username })
      .then((user) => {
        if (user) {
          const password = cipher.decrypt(user.password, user.dataIv);
          if (password == rawPassword) resolve({ _id: user._id, role: user.role });
        }
        reject(new Error("username and password don't match"));
      })
      .catch((error) => reject(error));
  });
};

exports.getItemLista = (userId, obraId) => {
  return new Promise((resolve, reject) => {
    db.collection("users")
      .findOne({ _id: ObjectId(userId) }) //encontra o user
      .then((user) => {
        if (user.itensLista) {            //Se possui uma lista
          const itemLista = user.itensLista.find(currentItemLista =>
            currentItemLista.obra.equals(ObjectId(obraId))); //encontra o itemLista buscado pelo user          

          db.collection("obras")
            .findOne({ _id: ObjectId(obraId) }) //encontra a obra do itemLista
            .then((obra) => { //retorna um itemLista com sua respectiva obra
              resolve({ nota: itemLista.nota, statusItem: itemLista.statusItem, obra: obra });
            });
        } else return null;
      }).catch((err) => reject(err));
  });
};

exports.getItensLista = (userId,search) => {
  return new Promise((resolve, reject) => {
    let cont = 0;
    //let filterObra = search ? {"nome": { $regex: "(?i).*" + search + ".*" }} : {}; 
    let filter = { _id: ObjectId(userId)/*, itensLista: {filterObra}*/ };
    db.collection("users")
      .findOne(filter) //encontra o user
      .then((user) => {
        let itensListaComObras = [];    //array de itemLista com a sua respectiva Obra
        if (user.itensLista) {            //se o user tem uma lista          
          user.itensLista.forEach(itemLista => {  //procura a obra de cada item da lista
            db.collection("obras")
              .findOne({ _id: itemLista.obra }) //encontra a obra do itemLista
              .then((obra) => {
                itensListaComObras.push( //preenche o array de itemLista com a sua respectiva Obra
                  { nota: itemLista.nota, statusItem: itemLista.statusItem, obra: obra }
                )
                cont++;
                //retorna o itensLista depois que todas as suas respectivas obras foram encontradas 
                if (cont === user.itensLista.length) resolve(itensListaComObras);
              });
          });
          if (user.itensLista.length === 0) resolve([]);
        } else resolve([])
      })
      .catch((err) => reject(err));
  });
};

exports.addItemLista = (userId, obraId) => {
  return new Promise((resolve, reject) => {
    db.collection("users")            //adiciona itemLista
      .updateOne({ _id: ObjectId(userId) }, { //adiciona o itemLista ao array de itensLista do user
        $push: { itensLista: { nota: -1, statusItem: "none", obra: ObjectId(obraId) } }
      })
      .then(() => {
        db.collection("obras") //atualizar estatisticas da obra 
          .updateOne({ _id: ObjectId(obraId) },
            {
              $inc: {
                nListas: 1,
              }
            })
        resolve()
      }).catch((err) => reject(err));
  });
};

exports.updateItemLista = (userId, obraId, novaNota, statusItem) => { //atualiza a nota ou o status da obra na lista do user
  return new Promise((resolve, reject) => {
    //atualiza estatisticas da obra
    db.collection("users")
      .findOne({ _id: ObjectId(userId) }) //procura o User
      .then((user) => {
        const itemLista = user.itensLista.find(currentItemLista =>
          currentItemLista.obra.equals(ObjectId(obraId))); //Encontra o itemLista que está relacionado a obraId
        const notaAnterior = itemLista.nota;

        if (novaNota > 0) { //se alguma nota foi dada
          db.collection("obras")
            .findOne({ _id: ObjectId(obraId) }) //encontra a obra associada ao itemLista
            .then((obra) => {
              const avaliacao = obra.avaliacao;
              const nVotos = obra.nVotos;
              db.collection("obras") //atualizar estatisticas da obra 
                .updateOne({ _id: ObjectId(obraId) },
                  {
                    $set: {
                      avaliacao: (notaAnterior >= 0) ? //se for reavaliar a obra
                        ((novaNota - notaAnterior) + (avaliacao * (nVotos))) / nVotos
                        :
                        (novaNota + (avaliacao * (nVotos))) / (nVotos + 1), //atualiza a nova avaliacao da obra
                      nVotos: (notaAnterior >= 0) ? //se for reavaliar a obra
                        nVotos       //não aumenta o numero de votos
                        :
                        nVotos + 1,  //incrementa o nº de votos dessa obra
                    }
                  }).then(() => {
                    db.collection("users")//atualizar itensLista
                      .updateOne({ _id: ObjectId(userId), "itensLista.obra": ObjectId(obraId) },
                        {                                     //update o itemLista que possui o userId e obraId
                          $set: {
                            "itensLista.$": {
                              nota: novaNota,                     //nova nota dada a itemLista pelo user
                              statusItem: statusItem,         //novo status do itemLista
                              obra: ObjectId(obraId),
                            }
                          }
                        }).then(() => resolve());
                  })
            })
        } else {  //atualiza so o status
          db.collection("users")//atualizar itensLista
            .updateOne({ _id: ObjectId(userId), "itensLista.obra": ObjectId(obraId) },
              {                                     //update o itemLista que possui o userId e obraId
                $set: {
                  "itensLista.$": {                    //nova nota dada a itemLista pelo user
                    nota: itemLista.nota,
                    statusItem: statusItem,         //novo status do itemLista
                    obra: ObjectId(obraId),
                  }
                }
              }).then(() => resolve())
        }
      })
      .catch((err) => reject(err));
  });
};

exports.removeItemLista = (userId, obraId) => {
  return new Promise((resolve, reject) => {
    db.collection("users") //Atualiza estatistica da obra
      .findOne({ _id: ObjectId(userId) }) //procura o User
      .then((user) => {
        const itemLista = user.itensLista.find(currentItemLista =>
          currentItemLista.obra.equals(ObjectId(obraId)));
        const nota = itemLista.nota;

        db.collection("obras")
          .findOne({ _id: ObjectId(obraId) }) //encontra a obra associada ao itemLista
          .then((obra) => {
            const avaliacao = obra.avaliacao;
            const nVotos = obra.nVotos;
            const nListas = obra.nListas;
            //se tem apenas e voto, como ele será apagado, então Obra.avaliacao volta a ser -1
            const novaAvaliacao = nVotos === 1 ? -1 : ((avaliacao * nVotos) - nota) / (nVotos - 1)
            db.collection("obras") //atualizar estatisticas da obra 
              .updateOne({ _id: ObjectId(obraId) },
                {
                  $set: {
                    avaliacao: (nota > 0) ? //se esse item foi votado pelo User
                      novaAvaliacao  //atualiza a nova avaliacao da obra
                      :
                      avaliacao,
                    nVotos: (nota > 0) ? //se esse item foi votado pelo User
                      nVotos - 1  //decrementa o nº de votos dessa obra
                      :
                      nVotos,
                    nListas: nListas - 1,
                  }
                })
              .then(() => {

                db.collection("users") //retira itemLista
                  .updateOne({ _id: ObjectId(userId) },
                    {
                      $pull: {
                        itensLista: itemLista
                      }
                    })
                  .then(() => resolve(itemLista))
              })
          })
      }).catch((err) => reject(err))
  });
};
