/*
import {useState} from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Precipitation(){
  const [data, setData] = useState('')
  const getData = () => {
    let data = new FormData();
    let form = document.getElementsByTagName('form')[0];
    data.append('start_date', form.start_date.value);
    data.append('end_date', form.end_date.value);
    const rawResponse = await fetch('http://research.globashell.com/api/precipitation', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    });
    const content = await rawResponse.text();
    console.log(content);
    setData(content);
  }
	return (
		<>
		<Head>
			<title>Precipitation</title>
			<link rel="icon" href="/precipitation.ico" />
		</Head>
		<nav>
    	<ul>
        <li>
          <Link href="/" className="navbar"><a>Home</a></Link>
        </li>
      </ul>
    </nav>
    <div>
    	<form action="#" method="post">
        <label for="startdate">Start date:</label>
        <input type="date" id="start_date" name="start_date" />
        <br />
        <label for="endtdate">End date:</label>
        <input type="date" id="end_date" name="end_date" />
        <br />
        <br />
        <input type="submit" onClick={() => {getData()}} />
      </form>
    </div>
    <div>{data}</div>
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
    `}</style>
	</>
	)
}
*/

import Head from 'next/head'
import Link from 'next/link'
import Nav from './components/nav'
import {useState} from 'react'
// import { tryGetPreviewData } from 'next/dist/next-server/server/api-utils'


export default function Precipitation(){
  const [data, setData] = useState();
  async function getData() {
    document.getElementById('btn').disabled = true;
    const rawResponse = await fetch('/api/precipitation', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'start_date': document.getElementById('start_date').value,
        'end_date': document.getElementById('end_date').value
      })
    });
    console.log(rawResponse);
    const content = await rawResponse.text();
    console.log(content);
    setData(content);
    document.getElementById('btn').disabled = false;
  }
    
  return (
    <>
      <Head>
        <title>Precipitation</title>
      </Head>
      <Nav />
      <main>
        <label for="start_date">Start date:</label>
        <input type="date" id="start_date" name="start_date" />
        <br />
        <label for="end_date">End date:</label>
        <input type="date" id="end_date" name="end_date" />
        <br />
        <br />
        <button id="btn" onClick={() => getData()}>Process</button>
        <div>{data}</div>
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
    `}</style>
  </>
  )
}
