import nc from 'next-connect'
import redis from './redis'

const middleware = nc()
  .use(redis)

export default middleware
