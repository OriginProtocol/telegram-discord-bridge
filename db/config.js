require('dotenv').config()

const url = process.env.DATABASE_URL

module.exports = {
  development: { url, logging: false, define: { underscored: true } },
  test: { url, logging: false, define: { underscored: true } },
  production: { url, logging: false, define: { underscored: true } }
}
