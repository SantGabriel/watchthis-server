module.exports = (sequelize, Sequelize) => {
    class Categoria extends Sequelize.Model {}
    Categoria.init (
      {
        _id: {
          type: Sequelize.STRING (36),
          primaryKey: true,
        },
        nome: {
          type: Sequelize.STRING,
        },
      },
      {sequelize, modelName: 'Categoria'}
    );
    
    return Categoria;
  };
  