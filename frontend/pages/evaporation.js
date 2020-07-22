import Head from 'next/head'
import Link from 'next/link'

export default function Evaporation(){
	return (
		<>
		<Head>
			<title>Evaporation</title>
			<link rel="icon" href="/evaporation.ico" />
		</Head>
    <main>
			<nav>
    	<ul>
        <li>
        <Link href="/" className="navbar"><a>Home</a></Link>
        
        </li>

    </ul>
   
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
  