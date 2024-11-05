const { Sequelize, DataTypes } = require('sequelize');

// Conexão com o MySQL
const sequelize = new Sequelize('todolist', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

// Definindo o modelo de tarefas
const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    }
}, {
    tableName: 'tasks'
});

// Sincroniza o modelo com o banco de dados
sequelize.sync()
    .then(() => console.log('Banco de dados e tabela "tasks" criados'))
    .catch(err => console.error('Erro ao conectar com o banco de dados', err));

module.exports = { Task };
