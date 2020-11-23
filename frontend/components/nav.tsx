import React from 'react'
import Link from 'next/link'

const links = [
  { href: '/precipitation', label: 'Precipitation' },
  { href: '/evaporation', label: 'Evaporation' },
  { href:'/' , label:'Home'}
]

const Nav = ({ path }: {path:string}) => (
  <nav>
    <ul>
      {links.map(({ href, label }) => (
        <li key={`nav-link-${href}-${label}`}>
          { ( path == href ) ? label :
            <Link href={href}><a>{label}</a></Link>
          }
        </li>
      ))}
      <li><a href='https://www.wvstateu.edu/about.aspx' target="_blank">About WVSU</a></li>
    </ul>

    <style jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
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
  </nav>
)

export default Nav
