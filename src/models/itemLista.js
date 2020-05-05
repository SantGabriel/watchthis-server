/*
Esse modelo não terá uma tabela específica.

Como todo itemLista está SEMPRE associado a um User, ela ficará salva em um array dentro de User.
Portanto um itemLista NUNCA será buscado apenas pelo seu ID.

Como todo itemLista está SEMPRE associado a uma Obra, 
o ID da Obra será utilizado como 'primary key' de um itemLista para encontra-lo dentro de um User.
Portanto um itemLista não terá seu próprio ID
*/
module.exports = (sequelize, Sequelize) => {
    class ItemLista extends Sequelize.Model { }
    ItemLista.init(
        {
            nota: { //nota do User para essa obra
                type: Sequelize.INTEGER,
            },
            statusItem: { //Já assisti, Estou a assistir, Irei assistir, Desisti de continuar
                type: Sequelize.STRING,
            }
        },
        { sequelize, modelName: 'itemLista' }
    );
    ItemLista.associate = (models) => {
        ItemLista.hasOne(models.Obra);
    };
    return ItemLista;
};
