import Head from 'next/head'
import Nav from './components/nav'
import { useState } from 'react'
import { Bar } from 'react-chartjs-2'

export default function Precipitation () {
  const [data, setData] = useState<any>()
  async function pollData () {
    const rawResponse = await fetch('/api/results', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'precipitation',
        start_date: (document.getElementById('start_date') as HTMLInputElement).value,
        end_date: (document.getElementById('end_date') as HTMLInputElement).value
      })
    })
    const btn = document.getElementById('btn') as HTMLInputElement
    try {
      const content = await rawResponse.json()
      if (content.status === 'error') {
        console.log('Result is error: ', content)
      } else if (content.status === 'done') {
        const newData = {
          labels: [],
          datasets: [{
            label: 'precipitation',
            type: 'line',
            data: [],
            fill: false,
            backgroundColor: '#71B37C',
            borderColor: '#71B37C',
            hoverBackgroundColor: '#71B37C',
            hoverBorderColor: '#71B37C'
          }]
        }
        content.results.history.forEach((item, index) => {
          newData.labels.push(item.date + '-' + item.time)
          newData.datasets[0].data.push(item.value)
        })
        console.log(newData)
        setData(newData)
        btn.disabled = false
      } else {
        setTimeout(pollData, 1000)
      }
    } catch (err) {
      console.log('Caught error from json processing ', err)
      btn.disabled = false
    }
  }
  async function getData () {
    const btn = document.getElementById('btn') as HTMLInputElement
    btn.disabled = true
    const rawResponse = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'precipitation',
        start_date: (document.getElementById('start_date') as HTMLInputElement).value,
        end_date: (document.getElementById('end_date') as HTMLInputElement).value
      })
    })
    console.log(rawResponse)
    if (rawResponse.status !== 200) {
      setData({
        status: 'error',
        response: rawResponse
      })
      btn.disabled = false
      return
    }
    const content = await rawResponse.json()
    console.log(content)
    if ((content.status || 'error') === 'submitted') {
      await pollData()
    }
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
        <button id='btn' onClick={() => getData()}>Process</button>
        {data &&
          <Bar data={data} />}
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
    `}
      </style>
    </>
  )
}
