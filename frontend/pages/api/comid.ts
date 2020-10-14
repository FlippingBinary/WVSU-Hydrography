import nc from 'next-connect'
import middleware from '../../middlewares/middleware'

const redisHandler = nc()
  .use(middleware)
  .get(async (req:any, res:any) => {
    const comid = req.query?.comid as string
    const distance = req.query?.distance as string

    if ( !comid || !distance ) return "Invalid request"

    const raw = await fetch(`https://cida.usgs.gov/nldi/comid/${comid}/navigate/UM/wqp?distance=${distance}`)
    res.json(await raw.json())
  })

export default redisHandler
