import React from 'react'
import Head from 'next/head'
import Nav from './components/nav'
import Link from 'next/link'

export default function Home() {
  return (
    <body>
      <Head>
        <title>HSPF</title>
      </Head>
      <Nav />
      <div className="hero">
        <header>
          <h1 className="title"><u>Hydrologic Simulation Program in Fortran</u></h1>
        </header>
        
        <br />
        <h2 className="title"><b><i><u>Intoduction</u></i></b></h2>
        <p className="description">
          Hydrological Simulation Program - FORTRAN (HSPF) is a comprehensive package for simulation of
          watershed hydrology and water quality for both conventional and toxic organic pollutants. HSPF
          incorporates watershed-scale ARM and NPS models into a basin-scale analysis framework that
          includes fate and transport in one dimensional stream channels. It is the only comprehensive model
          of watershed hydrology and water quality that allows the integrated simulation of land and soil
          contaminant runoff processes with In-stream hydraulic and sediment-chemical interactions. The
          result of this simulation is a time history of the runoff flow rate, sediment load, and nutrient and
          pesticide concentrations, along with a time history of water quantity and quality at any point in a
          watershed. HSPF simulates three sediment types (sand, silt, and clay) in addition to a single organic
          chemical and transformation products of that chemical.
          <br />
          <a href="https://www.epa.gov/ceam/basins-framework-and-features" target="_blank">Extra information</a>
        </p>


        <h2 className="title"><b><i><u>Application</u></i></b></h2>
        <p className="description">
          The abstract for the Application of BASINS/HSPF to Data-scarce Watersheds follows. Better
          Assessment Science Integrating Point and Nonpoint Sources (BASINS 4.1) is a program developed by
          the US EPA for local, regional, and state agencies responsible for water resources management,
          particularly the development of total maximum daily loads (TMDLs) as required under the Clean
          Water Act (CWA). BASINS facilitates water quantity and quality modeling applications to support EPA’s
          policy and regulatory decisions, e.g., water quality criteria development and total maximum daily
          load calculations. BASINS 4.1 has pre-packaged cartographic, environmental, and climate data within
          its databases and BASINS users in the United States often use it. Where pre-packaged data is not
          available, however, BASINS users must obtain data from other sources and upload it to BASINS. This
          tutorial summarizes data requirements of BASINS users who want to use data other than pre-
          packaged or who want to apply BASINS/HSPF to watersheds outside the United States. This report
          presents steps to import data to BASINS, delineate watersheds, and launch BASINS to build an HSPF
          model project.
        </p>
      </div>          

    <footer className="footer">
      <p>©2020 West Virginia State University |  P.O. Box 1000 Institute, WV 25112-1000 |  (304) 766-3000 </p>
      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/42/West_Virginia_State_University_seal.png/150px-West_Virginia_State_University_seal.png" width="50" height="50" />
    </footer>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      body {
        background-image: url('https://images.unsplash.com/photo-1485627941502-d2e6429a8af0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80');
      }
      .footer {
        display: flex;
        justify-content: center;
        padding: 5px;
        background-color: grey;
        color: #fff;
        border:black;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 25px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
      `}</style>
    </body>
  )
}
