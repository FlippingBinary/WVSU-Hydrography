import nc from 'next-connect'
import middleware from '../../middlewares/middleware'

const submitHandler = nc()
  .use(middleware)
  .post((req, res) => {
    console.log(`Submit POST query: ${JSON.stringify(req.body)}`)
    const start_date_array = req.body.start_date.split('-')
    console.log(`start_date_array: ${JSON.stringify(start_date_array)}`)
    const end_date_array = req.body.end_date.split('-')
    const start_date = new Date(start_date_array[0] + '-' + start_date_array[1] + '-' + start_date_array[2]) // .getTime() / 1000
    const end_date = new Date(end_date_array[0] + '-' + end_date_array[1] + '-' + end_date_array[2]) // .getTime() / 1000
    const start_date_stamp = start_date.getTime() / 1000
    const end_date_stamp = end_date.getTime() / 1000 - 60
    const query = {
      type: req.body.type,
      start_date: start_date_stamp,
      end_date: end_date_stamp
    }
    req.redis.lpush('queue', JSON.stringify(query), (err) => {
      if (err) {
        res.json({
          status: 'error',
          error: err
        })
      }
      res.json({
        status: 'submitted',
        query: query
      })
    })
  })

export default submitHandler
