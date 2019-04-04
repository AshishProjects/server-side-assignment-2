const Koa = require('koa')
const bodyParser = require('koa-body')
const pool = require('../../dbconfig/dbconfig')
const logger = require('pino')()

const app = new Koa()
app.use(bodyParser())

app.use(async ctx => {
    logger.info(' Running the GET method to get data.')
  const returnedTodos = await getTodos()
  ctx.body = returnedTodos
})

async function getTodos() {
  try {
    const newdataTodos = await pool.query(`SELECT * FROM listtodo;`)
    return newdataTodos[0]
  }catch(e){
    console.error(e)
  }
}

module.exports = app.callback()