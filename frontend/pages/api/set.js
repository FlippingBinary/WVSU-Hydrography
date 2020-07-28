import nc from 'next-connect'
import middleware from '../../middlewares/middleware'

const redisHandler = nc()
  .use(middleware)
  .get( (req, res) => {
    req.redis.set("test", "something", (err) => {
      res.send(`Connected to redis? ${req.redis.connected}\nError? ${err}`)
    })
  })

export default redisHandler
