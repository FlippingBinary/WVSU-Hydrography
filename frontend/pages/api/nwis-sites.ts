import nc from 'next-connect'
import middleware from '../../middlewares/middleware'

const redisHandler = nc()
  .use(middleware)
  .get(async (req:any, res:any) => {
    const nwissite = req.query?.site as string

    if ( !nwissite ) return "Invalid request"

    const raw = await fetch(`https://cida.usgs.gov/nldi/nwissite/${nwissite}?f=json`)
    res.json(await raw.json())
  })

export default redisHandler
