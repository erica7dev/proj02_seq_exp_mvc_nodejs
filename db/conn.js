const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', '12345', {
  host: 'localhost',
  dialect: 'mysql',
})

try {
  sequelize.authenticate()
  console.log('Conectado!')
} catch (error) {
  console.error('Erro ao conectar', error)
}

module.exports = sequelize