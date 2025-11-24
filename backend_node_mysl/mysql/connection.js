const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('auth_sequelize', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

async function initDB() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

initDB();

module.exports = sequelize;