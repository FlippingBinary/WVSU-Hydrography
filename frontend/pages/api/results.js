import nc from 'next-connect'
import middleware from '../../middlewares/middleware'

const resultsHandler = nc()
  .use(middleware)
  .post((req, res) => {
    console.log(`Results POST query: ${JSON.stringify(req.body)}`)
    const type = req.body.type
    const start_date_array = req.body.start_date.split('-')
    console.log(`start_date_array: ${JSON.stringify(start_date_array)}`)
    const end_date_array = req.body.end_date.split('-')
    const start_date = new Date(start_date_array[0] + '-' + start_date_array[1] + '-' + start_date_array[2]) // .getTime() / 1000
    const end_date = new Date(end_date_array[0] + '-' + end_date_array[1] + '-' + end_date_array[2]) // .getTime() / 1000
    const key = `${type}-${start_date.getTime() / 1000}-${end_date.getTime() / 1000 - 60}`
    console.log(`Front end resultsHandler key: ${key}`)
    req.redis.get(key, (err, val) => {
      if (err) {
        res.json({
          status: 'error',
          error: err
        })
      } else if (val) {
        res.json({
          status: 'done',
          results: JSON.parse(val)
        })
      } else {
        res.json({
          status: 'notfound'
        })
      }
    })
  })

export default resultsHandler
