const Koa = require('koa')
const bodyParser = require('koa-body')
const { twiml: { MessagingResponse } } = require('twilio')
const pool = require('../../dbconfig/dbconfig')
const logger = require('pino')()

const app = new Koa()

app.use(bodyParser())

app.use(async ctx => {

    logger.info('Running the POST method to store a new item in the todo list.')
  const postItemBody = await ctx.request.body
  const postItem = await postTodo(postItemBody.Body, new Date().toISOString().split('T')[0], false)

  const twiml = new MessagingResponse()
  if (postItem) {
    twiml.message(`New todo added with todoID ${postItem[0].insertId}`)
    ctx.body = twiml.toString()
  } else {
    twiml.message(`Failed to create todoItem!`)
    ctx.body = twiml.toString()
  }
})

async function postTodo(todoItem, todoDateAdded, todoStatus) {
  try {
    const postedTodo = await pool.query(`
    INSERT INTO listtodo (todoItem, todoDateAdded, todoStatus) 
    VALUES ("${todoItem}", "${todoDateAdded}", "${todoStatus}");
    `)
    return postedTodo
  }catch(e){
    console.error(e)
  }
}

module.exports = app.callback()