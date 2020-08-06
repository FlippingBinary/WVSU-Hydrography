import Head from 'next/head'
import Nav from './components/nav'
import {useState} from 'react'

export default function Evaporation(){
  const [data, setData] = useState();
  async function pollData() {
    const rawResponse = await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'type': 'evaporation',
        'start_date': document.getElementById('start_date').value,
        'end_date': document.getElementById('end_date').value
      })
    })
    try {
      const content = await rawResponse.json()
      if ( content.status === 'error' ) {
        console.log('Result is error: ', content)
      }
      else if ( content.status === 'done' ) {
        setData(content)
        document.getElementById('btn').disabled = false;
      }
      else {
        setTimeout(pollData, 1000)
      }
    }
    catch {
      console.log("Caught error from json processing")
      document.getElementById('btn').disabled = false;
    }
  }
  async function getData() {
    document.getElementById('btn').disabled = true;
    const rawResponse = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'type': 'evaporation',
        'start_date': document.getElementById('start_date').value,
        'end_date': document.getElementById('end_date').value
      })
    });
    console.log(rawResponse);
    if ( rawResponse.status !== 200 ) {
      setData({
        status: 'error',
        response: rawResponse
      })
      document.getElementById('btn').disabled = false;
      return
    }
    const content = await rawResponse.json()
    console.log(content);
    if ( (content.status || 'error' ) === 'submitted' ) {
      await pollData()
    }
  }
    
	return (
    <>
      <Head>
        <title>Evaporation</title>
      </Head>
      <Nav />
      <main>
        <label htmlFor="start_date">Start date:</label>
        <input type="date" id="start_date" name="start_date" />
        <br />
        <label htmlFor="end_date">End date:</label>
        <input type="date" id="end_date" name="end_date" />
        <br />
        <br />
        <button id="btn" onClick={() => getData()}>Process</button>
        <div>{data && JSON.stringify(data)}</div>
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
      `}</style>
    </>
	)
}
  