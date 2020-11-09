import Head from "next/head"
import Nav from "./components/nav"
import React, { CSSProperties, useState } from "react"
import * as Highcharts from "highcharts"
import HighchartsExporting from "highcharts/modules/exporting"
import HighchartsReact from "highcharts-react-official"
import Papa from "papaparse"
import moment from "moment"
import { Button, Col, DatePicker, Form, Layout, Row } from "antd"

const { RangePicker } = DatePicker
if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts)
}

interface Ions {
  [key: string]: Map<string, string>
}
const tailLayout = {
  wrapperCol: {
    offset: 11,
    span: 16,
  },
  align: 'center',
};

const validIons = [
  'Carbonate',
  "Bicarbonate",
  "Calcium",
  'Magnesium',
  "Sodium",
  'Potassium',
  "Chloride",
  'Sulfate',
  "Total dissolved solids"
]

const CALCIUM_WEIGHT = 40.08 // vs 40
const MAGNESIUM_WEIGHT = 24.31 // vs 24
const SODIUM_WEIGHT = 22.99 // vs 23
const POTASSIUM_WEIGHT = 39.1 // vs 39
const BICARBONATE_WEIGHT = 61.02 // vs 61
const CARBONATE_WEIGHT = 60.01 // vs 60
const SULFATE_WEIGHT = 96.06 // vs 96
const CHLORIDE_WEIGHT = 35.45 // vs 35.6

const BASE_CHART = {
  chart: {
    height: 600,
    width: 500,
    type: "scatter",
    zoomType: "xy"
  },
  title: {
    text: "Gibbs Diagram"
  },
  legend: {
    floating: true,
    y: 16,
    maxHeight: 58,
    layout: "horizontal",
    navigation: {
      arrowSize: 8,
      style: {
        fontWeight: "bold",
        color: "#333",
        fontSize: "8px"
      }
    }
  },

  plotOptions: {
    series: {
      turboThreshold: 0,
      dataLabels: {
        enabled: false,
        allowOverlap: true,
        //format: "{point.label}",
        crop: false,
        overflow: "none"
      },
      scatter: {
        marker: {
          border: true,
          lineColor: "#000",
          radius: 5,
          states: {
            hover: {
              enabled: true,
              lineColor: "rgb(100,100,100)",
              marker: {
                enabled: false
              }
            }
          }
        }
      }
    }
  },
  xAxis: {
    title: {
      enabled: true,
      text: ''//" Cl + NO3 / ( Cl + NO3 + HCO3) "
    },
    max: 1,
    min: 0,
    startOnTick: true,
    endOnTick: true,
    showLastLabel: true
  },
  yAxis: {
    accessibility: {
      rangeDescription: "Range: 1 to 10000"
    },
    gridLineWidth: 0,
    minorGridLineWidth: 0,
    max: 10000,
    min: 1,
    minorTickInterval: 'auto',
    showLastLabel: true,
    title: {
      text: " Total dissolved solids (mg/L) "
    },
    type: "logarithmic"
  },
  tooltip: {
    useHTML: true,
    headerFormat: '<table>',
    pointFormat: '<tr><th colspan="2"><h3>{point.label}</h3></th></tr>' +
        '<tr><th>Carbonate</th><td>{point.carbonate}</td></tr>' +
        '<tr><th>Bicarbonate</th><td>{point.bicarbonate}</td></tr>' +
        '<tr><th>Calcium</th><td>{point.calcium}</td></tr>' +
        '<tr><th>Magnesium</th><td>{point.magnesium}</td></tr>' +
        '<tr><th>Sodium</th><td>{point.sodium}</td></tr>' +
        '<tr><th>Potassium</th><td>{point.potassium}</td></tr>' +
        '<tr><th>Chloride</th><td>{point.chloride}</td></tr>' +
        '<tr><th>Sulfate</th><td>{point.sulfate}</td></tr>' +
        '<tr><th>TDS</th><td>{point.tds}</td></tr>',
    footerFormat: '</table>'
  },
  series: [
    {
      dashStyle: 'ShortDash',
      type: 'line',
      color: 'black',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [
        {
          x: 0,
          y: 100
        },{
          x: 1,
          y: 2
        }
      ]
    },
    {
      dashStyle: 'ShortDash',
      type: 'line',
      color: 'black',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [
        {
          x: 0,
          y: 300
        },{
          x: 0.7,
          y: 10000
        }
      ]
    },
    {
      dashStyle: 'ShortDash',
      type: 'line',
      color: 'black',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [
        {
          x: 0.55,
          y: 200
        },{
          x: 1,
          y: 8000
        }
      ]
    },
    {
      dashStyle: 'ShortDash',
      type: 'line',
      color: 'black',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [
        {
          x: 0.55,
          y: 200
        },{
          x: 1,
          y: 6
        }
      ]
    }
    /*
    {
      name: "RainFall Dominance",
      color: "rgba(223, 83, 83, .5)",
      data: [
        [0.626304802, 1629.2],
        [0.611428571, 1284],
        [0.621761658, 1296],
        [0.635075721, 463],
        [0.576923077, 878],
        [0.695581015, 1116.3],
        [0.648055833, 1208],
        [0.724085366, 900],
        [0.766773163, 918],
        [0.622729632, 759],
        [0.78057242, 733]
      ],
      type: "scatter"
    }
    */
  ]
}

export default function Gibbs() {
  const [data, setData] = useState<string[][]>()
  const [sodiumOptions, setSodiumOptions] = useState<any>(BASE_CHART)
  const [chlorideOptions, setChlorideOptions] = useState<any>(BASE_CHART)
  const [loading, setLoading] = useState<boolean>(false)
  const disabledDate = (current: moment.Moment): boolean => {
    return current > moment()
  }
  async function getData(values) {
    setLoading(true)

    const ions: Ions = {}
    let countTotal = 0
    let countWater = 0
    let countFraction = 0
    let countMethod = 0
    let countIons = 0
    const startDate = values.dates[0].format('MM-DD-YYYY')
    const endDate = values.dates[1].format('MM-DD-YYYY')
    const csv = Papa.parse(
      `https://www.waterqualitydata.us/data/Result/search?countrycode=US&statecode=US%3A54&countycode=US%3A54%3A039&startDateLo=${startDate}&startDateHi=${endDate||moment().format('YYYY-MM-DD')}&mimeType=csv`,
      {
        download: true,
        header: true,

        step: (results, parser) => {
          const Media = results.data["ActivityMediaName"]
          const Fraction = results.data["ResultSampleFractionText"]
          const Method = results.data["ResultAnalyticalMethod/MethodIdentifier"]
          const Characteristic = results.data["CharacteristicName"]
          const Activity = results.data["ActivityIdentifier"]
          const Result = results.data["ResultMeasureValue"]
          const StartDate = results.data["ActivityStartDate"]
          const StartTime = results.data["ActivityStartTime/Time"]

          countTotal++
          // Reject everything but Water
          if (Media !== "Water") return
          countWater++
          // Reject everything but Dissolved
          if (Fraction !== "Dissolved") return
          countFraction++
          // Reject if ALGOR
          if (Method === "ALGOR") return
          countMethod++
          // Reject if not a desired ion
          if (validIons.indexOf(Characteristic) <= -1) return
          countIons++
          // Save data to collection
          if (typeof ions[Activity] === "undefined") {
            ions[Activity] = new Map<string, string>()
            const cal = StartDate.split("-")
            const tim = StartTime.split(":")
            const dt = new Date(
              parseInt(cal[0]),
              parseInt(cal[1]) - 1,
              parseInt(cal[2]),
              parseInt(tim[0]),
              parseInt(tim[1])
            )
            ions[Activity]["DateTime"] = Math.round(
              dt.getTime() / 1000
            ).toString()
          }
          ions[Activity][Characteristic] = `${parseFloat(Result) || 0}`
        },
        complete: () => {
          const results = [
            [
              "Date",
              "Carbonate",
              "Bicarbonate",
              "Calcium",
              "Magnesium",
              "Sodium",
              "Potassium",
              "Chloride",
              "Sulfate",
              "Total dissolved solids"
            ]
          ]
          const newSodiumOptions = JSON.parse(JSON.stringify(BASE_CHART))
          const newChlorideOptions = JSON.parse(JSON.stringify(BASE_CHART))
          for (const [key, value] of Object.entries(ions)) {
            if (
              "Carbonate" in value &&
              "Bicarbonate" in value &&
              "Calcium" in value &&
              "Magnesium" in value &&
              "Sodium" in value &&
              "Potassium" in value &&
              "Chloride" in value &&
              "Sulfate" in value
            ) {
              results.push([
                value["DateTime"],
                value["Carbonate"],
                value["Bicarbonate"],
                value["Calcium"],
                value["Magnesium"],
                value["Sodium"],
                value["Potassium"],
                value["Chloride"],
                value["Sulfate"],
                value["Total dissolved solids"]
              ])

              const calcium = value["Calcium"] / CALCIUM_WEIGHT
              const magnesium = value['Magnesium']/MAGNESIUM_WEIGHT
              const sodium = value['Sodium']/SODIUM_WEIGHT
              const potassium = value['Potassium']/POTASSIUM_WEIGHT
              const sodiumPotassium = sodium+potassium
              const cationX = 1+(sodiumPotassium-2*calcium)/(sodiumPotassium+2*calcium)*(1-(2*magnesium/(2*magnesium+2*calcium+sodiumPotassium)))
              const cationY = 2*magnesium/(sodiumPotassium+2*calcium+2*magnesium)*Math.tan(60*(Math.PI/180))

              const chloride = value["Chloride"] / CHLORIDE_WEIGHT
              const bicarbonate = value["Bicarbonate"] / BICARBONATE_WEIGHT
              const carbonate = value['Carbonate']/CARBONATE_WEIGHT
              const sulfate = value['Sulfate']/SULFATE_WEIGHT
              const anionXraw = 1+(chloride-(bicarbonate+2*carbonate))/(chloride+(bicarbonate+2*carbonate))*(1-(2*sulfate/(2*sulfate+(bicarbonate+2*carbonate)+chloride)))+2
              const anionX = anionXraw+0.5*2
              const anionY =2*sulfate/(chloride+(bicarbonate+2*carbonate)+2*sulfate)*Math.tan(60*(Math.PI/180))

              const combinationXraw = (Math.tan(60*(Math.PI/180))*anionXraw+Math.tan(60*(Math.PI/180))*cationX-cationY+anionY)/(2*Math.tan(60*(Math.PI/180)))
              const combinationX = combinationXraw+0.5
              const combinationY = (cationY+(Math.tan(60*(Math.PI/180))*combinationXraw-Math.tan(60*(Math.PI/180))*cationX))+0.5*Math.tan(60*(Math.PI/180))

              newSodiumOptions.series.push({
                data: [
                  {
                    x: sodium/(sodium+calcium),
                    y: parseFloat(value['Total dissolved solids']),
                    label: `Sample ${results.length-1}`,
                    carbonate: value['Carbonate'],
                    bicarbonate: value['Bicarbonate'],
                    calcium: value['Calcium'],
                    magnesium: value['Magnesium'],
                    sodium: value['Sodium'],
                    potassium: value['Potassium'],
                    chloride: value['Chloride'],
                    sulfate: value['Sulfate'],
                    tds: value['Total dissolved solids']
                  }
                ],
                name: `Sample ${results.length-1}`,
                showInLegend: false,
                type: 'scatter'
              })
            
              newChlorideOptions.series.push({
                data: [
                  {
                    x: chloride/(chloride+bicarbonate),
                    y: parseFloat(value['Total dissolved solids']),
                    label: `Sample ${results.length-1}`,
                    carbonate: value['Carbonate'],
                    bicarbonate: value['Bicarbonate'],
                    calcium: value['Calcium'],
                    magnesium: value['Magnesium'],
                    sodium: value['Sodium'],
                    potassium: value['Potassium'],
                    chloride: value['Chloride'],
                    sulfate: value['Sulfate'],
                    tds: value['Total dissolved solids']
                  }
                ],
                name: `Sample ${results.length-1}`,
                showInLegend: false,
                type: 'scatter'
              })
            
            }
          }
          const sortedResults = results.sort(
            (a, b) => parseInt(a[0]) - parseInt(b[0])
          )

          newSodiumOptions.xAxis.title.text = 'Na/(Na+Ca2)'
          newChlorideOptions.xAxis.title.text = 'Cl/(Cl+HCO3)'
          setSodiumOptions(newSodiumOptions)
          setChlorideOptions(newChlorideOptions)

          setData(sortedResults)

          const text = sortedResults.map((x) => x.toString()).join("\n")

          var data = new Blob([text], { type: "text/csv" })

          var url = window.URL.createObjectURL(data)

          console.log(
            `Filtered down to ${countIons}/${countMethod}/${countFraction}/${countWater}/${countTotal} rows`
          )
          setLoading(false)
        },
        error: (err, file) => {
          setLoading(false)
        }
      }
    )
  }

  return (
    <>
      <Head>
        <title>Gibbs</title>
      </Head>
      <Nav />
      <main>
        <Layout>
          <Form onFinish={getData}>
            <Form.Item
            labelCol={{ span: 10 }}
              label="Date Range"
              name="dates"
              initialValue={[moment('2009-01-01'),moment()]}
              >
            <RangePicker
              disabledDate={disabledDate}
              format={"MM-DD-YYYY"}
              disabled={loading}
            />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                >
                {loading ? "Processing" : "Process"}
              </Button>
            </Form.Item>
          </Form>
          <Row>
            <Col flex="500px">
              <HighchartsReact highcharts={Highcharts} options={sodiumOptions} />
            </Col>
            <Col flex="500px">
              <HighchartsReact highcharts={Highcharts} options={chlorideOptions} />
            </Col>
          </Row>
        </Layout>
      </main>
    </>
  )
}