import redis from 'redis'

const client = new redis.createClient(6379, 'redis')
client.on("error", (err) => {
  console.err(err)
})

const redisInit = async (req, res, next) => {
//  if (!client.connected) {
//    res.send("Error: No task queue")
//  }
  req.redis = client
  return next()
}

export default redisInit
