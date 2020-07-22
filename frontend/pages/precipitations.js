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

export default function Precipitation(){
  return (
    <>
    <Head>
      <title>Precipitation</title>
      <link rel="icon" href="/precipitation.ico" />
    </Head>
    <main>
    <nav>
      <ul>
        <li>
        <Link href="/" className="navbar"><a>Home</a></Link>

        </li>
    </ul>
    <body>
  <form action="#" method="post">
      <label for="startdate">Start date:</label>
      <input type="date" id="start_date" name="start_date" />
      <br />
      <label for="endtdate">End date:</label>
      <input type="date" id="end_date" name="end_date" />
      <br />
      <br />
      <input type="submit" />
      </form>
      </body>
      </nav>
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

export async function getStaticProps() {
const rawResponse = await fetch('http://research.globashell.com/api/precipitation', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: "start_date=01/01/1980&end_date=01/02/1980"});
  console.log(rawResponse)
  const content = await rawResponse.json();
  console.log(content);
}