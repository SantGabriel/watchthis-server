module.exports = (sequelize, Sequelize) => {
    class Obra extends Sequelize.Model { }
    Obra.init(
        {
            _id: {
                type: Sequelize.STRING(36),
                primaryKey: true,
            },
            nome: {
                type: Sequelize.STRING,
            },
            tipo: { //anime, filme, ou serie
                type: Sequelize.STRING,
            },
            url: { //link imagem da obra
                type: Sequelize.STRING,
            },
            dataInicio: { //data de lançamento
                type: Sequelize.STRING,
            },
            dataFim: { //data do episodio final, se houver
                type: Sequelize.STRING,
            },            
            duracao: { //serie: nº de temporadas / filme: minutos / anime: nº de episodios
                type: Sequelize.INTEGER,
            },
            nVotos: { //quantidade de usuarios que avaliaram essa obra
                type: Sequelize.INTEGER,
            },
            nListas: { //quantidade de usuarios que adicionaram essa obra à sua lista
                type: Sequelize.INTEGER,
            },
            avaliacao: { //Avaliação dos usuários em relação à essa obra
                type: Sequelize.FLOAT(1,1),
            },
            descricao: {
                type: Sequelize.TEXT,
            },
        },
        { sequelize, modelName: 'Obra' }
    );
    Obra.associate = (models) => {
        Obra.belongsToMany(models.Categoria, { through: "ObraCategorias" });
    };
    return Obra;
};
