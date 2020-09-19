import Head from 'next/head'
import Nav from './components/nav'
import { CSSProperties, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import Papa from 'papaparse'

interface Ions {
  [key: string]: Map<string,string>
}

const validIons = [
  'Carbonate',
  'Bicarbonate',
  'Calcium',
  'Magnesium',
  'Sodium',
  'Potassium',
  'Chloride',
  'Sulfate',
  'Total dissolved solids'
]

export default function Ions () {
  const [data, setData] = useState<string[][]>()
  async function getData () {
    const btn = document.getElementById('btn') as HTMLInputElement
    const download = document.getElementById('download') as HTMLInputElement
    const startDate = (document.getElementById('start_date') as HTMLInputElement).valueAsDate
    const endDate = (document.getElementById('end_date') as HTMLInputElement).valueAsDate
    const startDateString = (startDate.getMonth()+1).toString().padStart(2,'0')
    + '-' + startDate.getDate().toString().padStart(2,'0')
    + '-' + startDate.getFullYear().toString()
    const endDateString = (endDate.getMonth()+1).toString().padStart(2,'0')
    + '-' + endDate.getDate().toString().padStart(2,'0')
    + '-' + endDate.getFullYear().toString()
    console.log(`Date range: ${startDate} -> ${endDate}`)
    btn.disabled = true

    const ions:Ions = {}
    let countTotal = 0
    let countWater = 0
    let countFraction = 0
    let countMethod = 0
    let countIons = 0
    const csv = Papa.parse(`https://www.waterqualitydata.us/data/Result/search?countrycode=US&statecode=US%3A54&countycode=US%3A54%3A039&startDateLo=${startDateString}&startDateHi=${endDateString}&mimeType=csv`, {
      download: true,
      header: true,
      step: (results, parser) => {
        const Media = results.data['ActivityMediaName']
        const Fraction = results.data['ResultSampleFractionText']
        const Method = results.data['ResultAnalyticalMethod/MethodIdentifier']
        const Characteristic = results.data['CharacteristicName']
        const Activity = results.data['ActivityIdentifier']
        const Result = results.data['ResultMeasureValue']
        const StartDate = results.data['ActivityStartDate']
        const StartTime = results.data['ActivityStartTime/Time']
  
        countTotal++
        // Reject everything but Water
        if ( Media !== 'Water' ) return
        countWater++
        // Reject everything but Dissolved
        if ( Fraction !== 'Dissolved' ) return
        countFraction++
        // Reject if ALGOR
        if ( Method === 'ALGOR' ) return
        countMethod++
        // Reject if not a desired ion
        if ( validIons.indexOf(Characteristic) <= -1 ) return
        countIons++
        // Save data to collection
        if ( typeof ions[Activity] === 'undefined' ) {
          ions[Activity] = new Map<string,string>()
          const cal = StartDate.split('-')
          const tim = StartTime.split(':')
          const dt = new Date(parseInt(cal[0]),parseInt(cal[1])-1,parseInt(cal[2]),parseInt(tim[0]),parseInt(tim[1]))
          ions[Activity]['DateTime'] = Math.round(dt.getTime()/1000).toString()
        }
        ions[Activity][Characteristic] = `${parseFloat(Result) || 0}`
      },
      complete: () => {
        const results = [[
          'Date',
          'Carbonate',
          'Bicarbonate',
          'Calcium',
          'Magnesium',
          'Sodium',
          'Potassium',
          'Chloride',
          'Sulfate',
          'Total dissolved solids'
        ]]
        for ( const [key, value] of Object.entries(ions)) {
          console.log(`${key}(${value['DateTime']}) -> ${'Carbonate' in value},${'Bicarbonate' in value},${'Calcium' in value},${'Magnesium' in value},${'Sodium' in value},${'Potassium' in value},${'Chloride' in value},${'Sulfate' in value}`)
          if ( 'Carbonate' in value
            && 'Bicarbonate' in value
            && 'Calcium' in value
            && 'Magnesium' in value
            && 'Sodium' in value
            && 'Potassium' in value
            && 'Chloride' in value
            && 'Sulfate' in value )
              results.push([
                value['DateTime'],
                value['Carbonate'],
                value['Bicarbonate'],
                value['Calcium'],
                value['Magnesium'],
                value['Sodium'],
                value['Potassium'],
                value['Chloride'],
                value['Sulfate'],
                value['Total dissolved solids']
              ])
        }
    
        const sortedResults = results.sort((a,b) => parseInt(a[0]) - parseInt(b[0]))
    
        setData(sortedResults)
    
        const text = sortedResults.map(x => x.toString()).join('\n')
        
        var data = new Blob([text], {type: 'text/csv'});
    
        var url = window.URL.createObjectURL(data);
    
        download.onclick = () => {
          window.location.href=url
        }
        download.style.visibility = 'visible'
        download.disabled = false
      },
      error: (err,file) => {
        btn.disabled = false
      }
    })

    console.log(`Filtered down to ${countIons}/${countMethod}/${countFraction}/${countWater}/${countTotal} rows`)

    // We only want datasets with the eight ions and total dissolved solids
    /*
    const filteredIons = Object.fromEntries(Object.entries(ions).filter(([k,v]) => (
      ("Carbonate" in v) &&
      ("Bicarbonate" in v) &&
      ('Calcium' in v) &&
      ('Magnesium' in v) &&
      ('Sodium' in v) &&
      ('Potassium' in v) &&
      ('Chloride' in v) &&
      ('Sulfate' in v) &&
      ('Total dissolved solids' in v)
    )))
    */


  }

  return (
    <>
      <Head>
        <title>Precipitation</title>
      </Head>
      <Nav />
      <main>
        <label htmlFor='start_date'>Start date:</label>
        <input type='date' id='start_date' name='start_date' />
        <br />
        <label htmlFor='end_date'>End date:</label>
        <input type='date' id='end_date' name='end_date' />
        <br />
        <br />
        <button id='btn' onClick={() => getData()}>Process</button> <button id='download' style={{visibility: "hidden"} as CSSProperties}>Download</button>
        {data &&
          <table>
            <thead>
              <tr>
                <th>Sample</th>
                <th>Date</th>
                <th>Carbonate</th>
                <th>Bicarbonate</th>
                <th>Calcium</th>
                <th>Magnesium</th>
                <th>Sodium</th>
                <th>Potassium</th>
                <th>Chloride</th>
                <th>Sulfate</th>
                <th>Total dissolved solids</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row,i) => (i) ? (
                <tr>
                  <td>{i}</td>
                  <td>{(new Date(1000 * parseInt(row[0]))).toLocaleString()}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>{row[4]}</td>
                  <td>{row[5]}</td>
                  <td>{row[6]}</td>
                  <td>{row[7]}</td>
                  <td>{row[8]}</td>
                  <td>{row[9]}</td>
                </tr>
              ):'')}
            </tbody>
          </table>
        }
      </main>

      <style jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
      }
      .navbar{
        align:center;
      }
      body {
              background-image: url('https://goldwallpapers.com/uploads/posts/rain-background/rain_background_012.jpg');
            }
      nav {
        text-align: center;
      }
      ul {
        display: flex;
        justify-content: space-between;
      }
      nav > ul {
        padding: 4px 16px;
      }
      li {
        display: flex;
        padding: 6px 8px;
      }
      a {
        color: #067df7;
        text-decoration: none;
        font-size: 13px;
      }
      table {
        border-collapse: collapse;
      }
      table, th, td {
        border: 1px solid black;
        padding: 4px;
      }
    `}
      </style>
    </>
  )
}
