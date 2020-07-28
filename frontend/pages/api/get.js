import nc from 'next-connect'
import middleware from '../../middlewares/middleware'

const redisHandler = nc()
  .use(middleware)
  .get( (req, res) => {
    req.redis.get("test", (err,val) => {
      res.send(`Connected to redis? ${req.redis.connected}\Error? ${err}\nMessage? ${val}`)
    })
  })

export default redisHandler
