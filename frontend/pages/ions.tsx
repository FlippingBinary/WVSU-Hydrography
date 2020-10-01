import Head from 'next/head'
import Nav from './components/nav'
import { CSSProperties, useState } from 'react'
import * as Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'
import Papa from 'papaparse'
import moment from 'moment'
import { Button, DatePicker } from 'antd'
const { RangePicker } = DatePicker

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

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

const CALCIUM_WEIGHT = 40.08 // vs 40
const MAGNESIUM_WEIGHT = 24.31 // vs 24
const SODIUM_WEIGHT = 22.99 // vs 23
const POTASSIUM_WEIGHT = 39.1 // vs 39
const BICARBONATE_WEIGHT = 61.02 // vs 61
const CARBONATE_WEIGHT = 60.01 // vs 60
const SULFATE_WEIGHT = 96.06 // vs 96
const CHLORIDE_WEIGHT = 35.45 // vs 35.6

const BASE_CHART = {
  title: {
    text: 'Piper Chart'
  },
  chart: {
    height: 680,
    width: 600
  },
  legend: {
    floating: true,
    y: 16,
    maxHeight: 58,
    layout: 'horizontal',
        navigation: {
            arrowSize: 8,
            style: {
                fontWeight: 'bold',
                color: '#333',
                fontSize: '8px'
            }
        }
  },
  plotOptions: {
    series: {
      turboThreshold: 0,
      dataLabels: {
        enabled: false,
        allowOverlap: true,
        format: '{point.label}',
        crop: false,
        overflow: 'none'
      },
      scatter: {
        marker: {
          border: true,
          lineColor: '#000'
        }
      }
    }
  },
  yAxis: {
    visible: false,
    min: -1,
    max: 6.92820323027551,
    ceiling: 4.33012701892219
  },
  xAxis: {
    visible: false,
    max: 5
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
    footerFormat: '</table>',
    followPointer: false
  },
  series: [
    // Area(s)
    {
      name: 'Ca-HCO<sub>3</sub>',
      type: 'area',
      lineWidth: 0,
      color: 'rgba(90, 207, 240, 0.85)',
      fillOpacity: 0.85,
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.5,
        y: 2.59807621135332
      },{
        x: 1.9,
        y: 3.29089653438087
      },{
        x: 2.2,
        y: 2.7712812921102
      },{
        x: 1.8,
        y: 2.07846096908265
      },{
        x: 1.5,
        y: 2.59807621135332
      }]
    },
    {
      name: 'Ca-HCO<sub>3</sub>-Cl',
      type: 'area',
      lineWidth: 0,
      color: 'rgba(188, 248, 114, 0.85)',
      fillOpacity: 0.85,
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.9,
        y: 3.29089653438087
      },{
        x: 2.2,
        y: 3.81051177665153
      },{
        x: 2.5,
        y: 3.29089653438087
      },{
        x: 2.2,
        y: 2.7712812921102
      },{
        x: 1.9,
        y: 3.29089653438087
      }]
    },
    {
      name: 'Ca-Cl',
      type: 'area',
      lineWidth: 0,
      color: 'rgba(237, 243, 107, 0.85)',
      fillOpacity: 0.85,
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.2,
        y: 3.81051177665153
      },{
        x: 2.5,
        y: 4.33012701892219
      },{
        x: 2.8,
        y: 3.81051177665153
      },{
        x: 2.5,
        y: 3.29089653438087
      },{
        x: 2.2,
        y: 3.81051177665153
      }]
    },
    {
      name: 'Ca-Na-HCO<sub>3</sub>',
      type: 'area',
      lineWidth: 0,
      color: 'rgba(191, 231, 243, 0.85)',
      fillOpacity: 0.85,
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.8,
        y: 2.07846096908265
      },{
        x: 2.2,
        y: 2.7712812921102
      },{
        x: 2.5,
        y: 2.25166604983954
      },{
        x: 2.1,
        y: 1.55884572681199
      },{
        x: 1.8,
        y: 2.07846096908265
      }]
    },
    {
      name: 'Ca-Na-HCO<sub>3</sub>-Cl',
      type: 'area',
      lineWidth: 0,
      color: 'rgba(206, 205, 201, 0.85)',
      fillOpacity: 0.85,
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.2,
        y: 2.7712812921102
      },{
        x: 2.5,
        y: 3.29089653438087
      },{
        x: 2.8,
        y: 2.7712812921102
      },{
        x: 2.5,
        y: 2.25166604983954
      },{
        x: 2.2,
        y: 2.7712812921102
      }]
    },
    {
      name: 'Ca-Na-Cl',
      type: 'area',
      lineWidth: 0,
      color: 'rgba(249, 161, 63, 0.85)',
      fillOpacity: 0.85,
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.5,
        y: 3.29089653438087
      },{
        x: 2.8,
        y: 3.81051177665153
      },{
        x: 3.1,
        y: 3.29089653438087
      },{
        x: 2.8,
        y: 2.7712812921102
      },{
        x: 2.5,
        y: 3.29089653438087
      }]
    },
    {
      name: 'Na-HCO<sub>3</sub>',
      type: 'area',
      lineWidth: 0,
      color: 'rgba(252, 235, 204, 0.85)',
      fillOpacity: 0.85,
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.1,
        y: 1.55884572681199
      },{
        x: 2.5,
        y: 2.25166604983954
      },{
        x: 2.9,
        y: 1.55884572681199
      },{
        x: 2.5,
        y: 0.866025403784438
      },{
        x: 2.1,
        y: 1.55884572681199
      }]
    },
    {
      name: 'Na-HCO<sub>3</sub>-Cl',
      type: 'area',
      lineWidth: 0,
      color: 'rgba(236, 198, 223, 0.85)',
      fillOpacity: 0.85,
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.5,
        y: 2.25166604983954
      },{
        x: 2.8,
        y: 2.7712812921102
      },{
        x: 3.2,
        y: 2.07846096908265
      },{
        x: 2.9,
        y: 1.55884572681199
      },{
        x: 2.5,
        y: 2.25166604983954
      }]
    },
    {
      name: 'Na-Cl',
      type: 'area',
      lineWidth: 0,
      color: 'rgba(240, 112, 101, 0.85)',
      fillOpacity: 0.85,
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.8,
        y: 2.7712812921102
      },{
        x: 3.1,
        y: 3.29089653438087
      },{
        x: 3.5,
        y: 2.59807621135332
      },{
        x: 3.2,
        y: 2.07846096908265
      },{
        x: 2.8,
        y: 2.7712812921102
      }]
    },
    // Line(s)
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.1,
        y: 0.173205080756888
      },{
        x: 1.9,
        y: 0.173205080756888
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.2,
        y: 0.346410161513775,
        label: '20',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      },{
        x: 1.8,
        y: 0.346410161513775,
        label: '80',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.3,
        y: 0.519615242270663
      },{
        x: 1.7,
        y: 0.519615242270663
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.4,
        y: 0.692820323027551,
        label: '40',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      },{
        x: 1.6,
        y: 0.692820323027551,
        label: '60',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.5,
        y: 0.866025403784438
      },{
        x: 1.5,
        y: 0.866025403784438
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.6,
        y: 1.03923048454133,
        label: '60',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      },{
        x: 1.4,
        y: 1.03923048454133,
        label: '40',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.7,
        y: 1.21243556529821
      },{
        x: 1.3,
        y: 1.21243556529821
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.8,
        y: 1.3856406460551,
        label: '80',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      },{
        x: 1.2,
        y: 1.3856406460551,
        label: '20',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.9,
        y: 1.55884572681199
      },{
        x: 1.1,
        y: 1.55884572681199
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.1,
        y: 0.173205080756888
      },{
        x: 0.2,
        y: 0
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.2,
        y: 0.346410161513775
      },{
        x: 0.4,
        y: 0,
        label: '80',
        dataLabels: {
          align: 'center',
          enabled: true,
          y: 20
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.3,
        y: 0.519615242270663
      },{
        x: 0.6,
        y: 0
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.4,
        y: 0.692820323027551
      },{
        x: 0.8,
        y: 0,
        label: '60',
        dataLabels: {
          align: 'center',
          enabled: true,
          y: 20
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.5,
        y: 0.866025403784438
      },{
        x: 1,
        y: 0
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.6,
        y: 1.03923048454133
      },{
        x: 1.2,
        y: 0,
        label: '40',
        dataLabels: {
          align: 'center',
          enabled: true,
          y: 20
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.7,
        y: 1.21243556529821
      },{
        x: 1.4,
        y: 0
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.8,
        y: 1.3856406460551
      },{
        x: 1.6,
        y: 0,
        label: '20',
        dataLabels: {
          align: 'center',
          enabled: true,
          y: 20
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.9,
        y: 1.55884572681199
      },{
        x: 1.8,
        y: 0
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.2,
        y: 0
      },{
        x: 1.1,
        y: 1.55884572681199
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.4,
        y: 0
      },{
        x: 1.2,
        y: 1.3856406460551
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.6,
        y: 0
      },{
        x: 1.3,
        y: 1.21243556529821
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.8,
        y: 0
      },{
        x: 1.4,
        y: 1.03923048454133
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1,
        y: 0
      },{
        x: 1.5,
        y: 0.866025403784438
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.2,
        y: 0
      },{
        x: 1.6,
        y: 0.692820323027551
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.4,
        y: 0
      },{
        x: 1.7,
        y: 0.519615242270663
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.6,
        y: 0
      },{
        x: 1.8,
        y: 0.346410161513775
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.8,
        y: 0
      },{
        x: 1.9,
        y: 0.173205080756888
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.1,
        y: 0.173205080756888
      },{
        x: 4.9,
        y: 0.173205080756888
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.2,
        y: 0.346410161513775,
        label: '80',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      },{
        x: 4.8,
        y: 0.346410161513775,
        label: '20',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.3,
        y: 0.519615242270663
      },{
        x: 4.7,
        y: 0.519615242270663
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.4,
        y: 0.692820323027551,
        label: '60',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      },{
        x: 4.6,
        y: 0.692820323027551,
        label: '40',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.5,
        y: 0.866025403784438
      },{
        x: 4.5,
        y: 0.866025403784438
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.6,
        y: 1.03923048454133,
        label: '40',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      },{
        x: 4.4,
        y: 1.03923048454133,
        label: '60',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.7,
        y: 1.21243556529821
      },{
        x: 4.3,
        y: 1.21243556529821
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.8,
        y: 1.3856406460551,
        label: '20',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      },{
        x: 4.2,
        y: 1.3856406460551,
        label: '80',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.9,
        y: 1.55884572681199
      },{
        x: 4.1,
        y: 1.55884572681199
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.1,
        y: 0.173205080756888
      },{
        x: 3.2,
        y: 0
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.2,
        y: 0.346410161513775
      },{
        x: 3.4,
        y: 0,
        label: '20',
        dataLabels: {
          align: 'center',
          enabled: true,
          y: 20
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.3,
        y: 0.519615242270663
      },{
        x: 3.6,
        y: 0
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.4,
        y: 0.692820323027551
      },{
        x: 3.8,
        y: 0,
        label: '40',
        dataLabels: {
          align: 'center',
          enabled: true,
          y: 20
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.5,
        y: 0.866025403784438
      },{
        x: 4,
        y: 0
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.6,
        y: 1.03923048454133
      },{
        x: 4.2,
        y: 0,
        label: '60',
        dataLabels: {
          align: 'center',
          enabled: true,
          y: 20
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.7,
        y: 1.21243556529821
      },{
        x: 4.4,
        y: 0
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.8,
        y: 1.3856406460551
      },{
        x: 4.6,
        y: 0,
        label: '80',
        dataLabels: {
          align: 'center',
          enabled: true,
          y: 20
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.9,
        y: 1.55884572681199
      },{
        x: 4.8,
        y: 0
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.2,
        y: 0
      },{
        x: 4.1,
        y: 1.55884572681199
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.4,
        y: 0
      },{
        x: 4.2,
        y: 1.3856406460551
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.6,
        y: 0
      },{
        x: 4.3,
        y: 1.21243556529821
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.8,
        y: 0
      },{
        x: 4.4,
        y: 1.03923048454133
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 4,
        y: 0
      },{
        x: 4.5,
        y: 0.866025403784438
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 4.2,
        y: 0
      },{
        x: 4.6,
        y: 0.692820323027551
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 4.4,
        y: 0
      },{
        x: 4.7,
        y: 0.519615242270663
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 4.6,
        y: 0
      },{
        x: 4.8,
        y: 0.346410161513775
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 4.8,
        y: 0
      },{
        x: 4.9,
        y: 0.173205080756888
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.6,
        y: 2.7712812921102
      },{
        x: 2.6,
        y: 1.03923048454133
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.7,
        y: 2.94448637286709,
        label: '20',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      },{
        x: 2.7,
        y: 1.21243556529821
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.8,
        y: 3.11769145362398
      },{
        x: 2.8,
        y: 1.3856406460551
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.9,
        y: 3.29089653438087,
        label: '40',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      },{
        x: 2.9,
        y: 1.55884572681199
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2,
        y: 3.46410161513775
      },{
        x: 3,
        y: 1.73205080756888
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.1,
        y: 3.63730669589464,
        label: '60',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      },{
        x: 3.1,
        y: 1.90525588832576
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.2,
        y: 3.81051177665153
      },{
        x: 3.2,
        y: 2.07846096908265
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.3,
        y: 3.98371685740842,
        label: '80',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      },{
        x: 3.3,
        y: 2.25166604983954
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.4,
        y: 4.1569219381653
      },{
        x: 3.4,
        y: 2.42487113059643
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.6,
        y: 2.42487113059643
      },{
        x: 2.6,
        y: 4.1569219381653
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.7,
        y: 2.25166604983954
      },{
        x: 2.7,
        y: 3.98371685740842,
        label: '80',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.8,
        y: 2.07846096908265
      },{
        x: 2.8,
        y: 3.81051177665153
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.9,
        y: 1.90525588832576
      },{
        x: 2.9,
        y: 3.63730669589464,
        label: '60',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2,
        y: 1.73205080756888
      },{
        x: 3,
        y: 3.46410161513775
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.1,
        y: 1.55884572681199
      },{
        x: 3.1,
        y: 3.29089653438087,
        label: '40',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.2,
        y: 1.3856406460551
      },{
        x: 3.2,
        y: 3.11769145362398
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.3,
        y: 1.21243556529821
      },{
        x: 3.3,
        y: 2.94448637286709,
        label: '20',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      color: '#808080',
      lineWidth: 1.4,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.4,
        y: 1.03923048454133
      },{
        x: 3.4,
        y: 2.7712812921102
      }]
    },
    // Triangle Left
    {
      type: 'line',
      color: '#000000',
      lineWidth: 2,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0,
        y: 0
      },{
        x: 1,
        y: 1.73205080756888
      },{
        x: 2,
        y: 0
      },{
        x: 0,
        y: 0
      }]
    },
    // Triangle Right
    {
      type: 'line',
      color: '#000000',
      lineWidth: 2,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3,
        y: 0
      },{
        x: 4,
        y: 1.73205080756888
      },{
        x: 5,
        y: 0
      },{
        x: 3,
        y: 0
      }]
    },
    // Diamond
    {
      type: 'line',
      color: '#000000',
      lineWidth: 2,
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.5,
        y: 0.866025403784438
      },{
        x: 1.5,
        y: 2.59807621135332
      },{
        x: 2.5,
        y: 4.33012701892219
      },{
        x: 3.5,
        y: 2.59807621135332
      },{
        x: 2.5,
        y: 0.866025403784438
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0,
        y: 0,
        label: '100',
        dataLabels: {
          align: 'center',
          enabled: true,
          y: 20
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0,
        y: 0,
        label: '0',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -6,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1,
        y: 1.73205080756888,
        label: '100',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -12,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1,
        y: 1.73205080756888,
        label: '0',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2,
        y: 0,
        label: '100',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 12,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2,
        y: 0,
        label: '0',
        dataLabels: {
          align: 'center',
          enabled: true,
          y: 20
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3,
        y: 0,
        label: '0',
        dataLabels: {
          align: 'center',
          enabled: true,
          y: 20
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3,
        y: 0,
        label: '100',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -12,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 4,
        y: 1.73205080756888,
        label: '0',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 4,
        y: 1.73205080756888,
        label: '100',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 14,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 5,
        y: 0,
        label: '0',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 6,
          y: 6
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 5,
        y: 0,
        label: '100',
        dataLabels: {
          align: 'center',
          enabled: true,
          y: 20
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.5,
        y: 2.59807621135332,
        label: '0',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -10,
          y: 10
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 2.5,
        y: 4.33012701892219,
        label: '100',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: -2,
          y: 2
        }
      }]
    },
    {
      type: 'line',
      dashStyle: 'Solid',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.5,
        y: 2.59807621135332,
        label: '0',
        dataLabels: {
          align: 'center',
          enabled: true,
          x: 10,
          y: 10
        }
      }]
    },
    // Label(s)
    {
      type: 'scatter',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 0.14,
        y: 1.03923048454133,
        label: 'Magnesium (Mg)',
        dataLabels: {
          align: 'center',
          enabled: true,
          rotation: -60,
          style: {
            fontSize: '9px',
            fontWeight: 'bold'
          }
        }
      }]
    },
    {
      type: 'scatter',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.64,
        y: 3.63730669589464,
        label: 'Sulfate (SO<sub>4</sub>) + Chloride (Cl)',
        dataLabels: {
          align: 'center',
          enabled: true,
          rotation: -60,
          style: {
            fontSize: '9px',
            fontWeight: 'bold'
          }
        }
      }]
    },
    {
      type: 'scatter',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.14,
        y: 1.03923048454133,
        label: 'Carbonate (CO<sub>3</sub>) + Bicarbonate  (CO<sub>3</sub>)',
        dataLabels: {
          align: 'center',
          enabled: true,
          rotation: -60,
          style: {
            fontSize: '9px',
            fontWeight: 'bold'
          }
        }
      }]
    },
    {
      type: 'scatter',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1.86,
        y: 1.03923048454133,
        label: 'Sodium (Na) + Potassium (K)',
        dataLabels: {
          align: 'center',
          enabled: true,
          rotation: 60,
          style: {
            fontSize: '9px',
            fontWeight: 'bold'
          }
        }
      }]
    },
    {
      type: 'scatter',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 3.36,
        y: 3.63730669589464,
        label: 'Calcium (Ca) + Magnesium (Mg)',
        dataLabels: {
          align: 'center',
          enabled: true,
          rotation: 60,
          style: {
            fontSize: '9px',
            fontWeight: 'bold'
          }
        }
      }]
    },
    {
      type: 'scatter',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 4.86,
        y: 1.03923048454133,
        label: 'Sulfate (SO<sub>4</sub>)',
        dataLabels: {
          align: 'center',
          enabled: true,
          rotation: 60,
          style: {
            fontSize: '9px',
            fontWeight: 'bold'
          }
        }
      }]
    },
    {
      type: 'scatter',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1,
        y: -0.41569219381653,
        label: 'Calcium (Ca)',
        dataLabels: {
          align: 'center',
          enabled: true,
          style: {
            fontSize: '9px',
            fontWeight: 'bold'
          }
        }
      }]
    },
    {
      type: 'scatter',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 4,
        y: -0.41569219381653,
        label: 'Chloride (Cl)',
        dataLabels: {
          align: 'center',
          enabled: true,
          style: {
            fontSize: '9px',
            fontWeight: 'bold'
          }
        }
      }]
    },
    {
      type: 'scatter',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 1,
        y: -0.623538290724796,
        label: 'CATIONS',
        dataLabels: {
          align: 'center',
          enabled: true,
          style: {
            fontSize: '12px',
            fontWeight: 'bold'
          }
        }
      }]
    },
    {
      type: 'scatter',
      marker: false,
      showInLegend: false,
      enableMouseTracking: false,
      data: [{
        x: 4,
        y: -0.623538290724796,
        label: 'ANIONS',
        dataLabels: {
          align: 'center',
          enabled: true,
          style: {
            fontSize: '12px',
            fontWeight: 'bold'
          }
        }
      }]
    }/*,
    // Sample(s)
    {
      type: 'scatter',
      name: 'Sample 1',
      data: [{
        x: 1.35199306086455,
        y: 0.338839958120287
      },{
        x: 4.27796414726035,
        y: 0.894040907965931
      },{
        x: 2.97525131298631,
        y: 3.15040572460062
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 2',
      data: [{
        x: 1.35276556174585,
        y: 0.370986409641909
      },{
        x: 4.24592676971646,
        y: 0.878549272607739
      },{
        x: 2.94586694351314,
        y: 3.13031894447105
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 3',
      data: [{
        x: 1.31160505522428,
        y: 0.384538749770743
      },{
        x: 4.30076500050881,
        y: 0.747278333143743
      },{
        x: 2.91089892591961,
        y: 3.15459699004854
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 4',
      data: [{
        x: 1.35517332905376,
        y: 0.384299056090012
      },{
        x: 4.41734247594074,
        y: 0.691293177711343
      },{
        x: 2.97487947187611,
        y: 3.18971238878972
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 5',
      data: [{
        x: 0.988841806953017,
        y: 0.452872288922996
      },{
        x: 3.93602546364003,
        y: 0.54177802585183
      },{
        x: 2.48809851087071,
        y: 3.04966107369669
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 6',
      data: [{
        x: 1.00883737301857,
        y: 0.413275716923881
      },{
        x: 3.87696471299398,
        y: 0.421772530579254
      },{
        x: 2.44535386183187,
        y: 2.90139526145896
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 7',
      data: [{
        x: 1.2180486565526,
        y: 0.425432839527709
      },{
        x: 4.19726888563138,
        y: 0.46977963244751
      },{
        x: 2.72046058750696,
        y: 3.02768663783833
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 8',
      data: [{
        x: 0.694217445891597,
        y: 0.294800493129209
      },{
        x: 3.71979475747724,
        y: 0.270263943465836
      },{
        x: 2.19992300990785,
        y: 2.90275903124452
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 9',
      data: [{
        x: 1.12960865556283,
        y: 0.455371942479457
      },{
        x: 4.04945364037457,
        y: 0.669500353091799
      },{
        x: 2.65134469572279,
        y: 3.09109607974518
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 10',
      data: [{
        x: 0.745099568412171,
        y: 0.414344524815626
      },{
        x: 3.6628971875324,
        y: 0.218360362637859
      },{
        x: 2.14742262357716,
        y: 2.84323930498661
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 11',
      data: [{
        x: 1.19491151083908,
        y: 0.313523689954211
      },{
        x: 4.09556085437019,
        y: 0.759998299777047
      },{
        x: 2.77412230068841,
        y: 3.04879701383422
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 12',
      data: [{
        x: 0.980876726247129,
        y: 0.372986848564852
      },{
        x: 3.87428733961166,
        y: 0.581595065521149
      },{
        x: 2.48780203803684,
        y: 2.9830580517962
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 13',
      data: [{
        x: 1.12610103069389,
        y: 0.543318014126753
      },{
        x: 4.19132727949176,
        y: 0.7942270896179
      },{
        x: 2.73114536623129,
        y: 3.32333635167816
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 14',
      data: [{
        x: 1.24092633243544,
        y: 0.419377981977821
      },{
        x: 4.13150843756937,
        y: 0.694145420402087
      },{
        x: 2.7655359122718,
        y: 3.06007923596064
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 15',
      data: [{
        x: 1.20264678247516,
        y: 0.518483780712816
      },{
        x: 4.18352708458291,
        y: 0.799115056411126
      },{
        x: 2.77409820481276,
        y: 3.24031748582791
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 16',
      data: [{
        x: 1.19651828273089,
        y: 0.4828241785643
      },{
        x: 4.09321434819009,
        y: 0.808347702215303
      },{
        x: 2.73883686246422,
        y: 3.1541983201199
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 17',
      data: [{
        x: 0.975545404818858,
        y: 0.446106190871646
      },{
        x: 3.85614487999533,
        y: 0.247041420686347
      },{
        x: 2.35838009308077,
        y: 2.84124612940994
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 18',
      data: [{
        x: 1.13414617847741,
        y: 0.480230804594387
      },{
        x: 4.16961462598092,
        y: 0.863145400093389
      },{
        x: 2.76241832462316,
        y: 3.30048089026804
      }]
    },
    {
      type: 'scatter',
      name: 'Sample 19',
      data: [{
        x: 1.09818199343057,
        y: 0.45590404770517
      },{
        x: 3.8493197563261,
        y: 0.759069656200301
      },{
        x: 2.56126724771519,
        y: 2.99004204393095
      }]
    }*/
  ]
}

export default function Ions () {
  const [data, setData] = useState<string[][]>()
  const [options, setOptions] = useState<any>(BASE_CHART)
  const [loading, setLoading] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const disabledDate = (current:moment.Moment):boolean => {
    return current > moment()
  }
  async function getData () {
    console.log(`Date range: ${startDate} -> ${endDate}`)
    setLoading(true)

    const ions:Ions = {}
    let countTotal = 0
    let countWater = 0
    let countFraction = 0
    let countMethod = 0
    let countIons = 0
    const csv = Papa.parse(`https://www.waterqualitydata.us/data/Result/search?countrycode=US&statecode=US%3A54&countycode=US%3A54%3A039&startDateLo=${startDate}&startDateHi=${endDate}&mimeType=csv`, {
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
        const newOptions = JSON.parse(JSON.stringify(BASE_CHART))
        for ( const [key, value] of Object.entries(ions)) {
          console.log(`${key}(${value['DateTime']}) -> ${'Carbonate' in value},${'Bicarbonate' in value},${'Calcium' in value},${'Magnesium' in value},${'Sodium' in value},${'Potassium' in value},${'Chloride' in value},${'Sulfate' in value}`)
          if ( 'Carbonate' in value
              && 'Bicarbonate' in value
              && 'Calcium' in value
              && 'Magnesium' in value
              && 'Sodium' in value
              && 'Potassium' in value
              && 'Chloride' in value
              && 'Sulfate' in value ) {
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

            const calcium = value['Calcium']/CALCIUM_WEIGHT
            const magnesium = value['Magnesium']/MAGNESIUM_WEIGHT
            const sodiumPotassium = (value['Sodium']/SODIUM_WEIGHT)+(value['Potassium']/POTASSIUM_WEIGHT)
            const cationX = 1+(sodiumPotassium-2*calcium)/(sodiumPotassium+2*calcium)*(1-(2*magnesium/(2*magnesium+2*calcium+sodiumPotassium)))
            const cationY = 2*magnesium/(sodiumPotassium+2*calcium+2*magnesium)*Math.tan(60*(Math.PI/180))

            const chloride = value['Chloride']/CHLORIDE_WEIGHT
            const bicarbonate = value['Bicarbonate']/BICARBONATE_WEIGHT
            const carbonate = value['Carbonate']/CARBONATE_WEIGHT
            const sulfate = value['Sulfate']/SULFATE_WEIGHT
            const anionXraw = 1+(chloride-(bicarbonate+2*carbonate))/(chloride+(bicarbonate+2*carbonate))*(1-(2*sulfate/(2*sulfate+(bicarbonate+2*carbonate)+chloride)))+2
            const anionX = anionXraw+0.5*2
            const anionY =2*sulfate/(chloride+(bicarbonate+2*carbonate)+2*sulfate)*Math.tan(60*(Math.PI/180))

            const combinationXraw = (Math.tan(60*(Math.PI/180))*anionXraw+Math.tan(60*(Math.PI/180))*cationX-cationY+anionY)/(2*Math.tan(60*(Math.PI/180)))
            const combinationX = combinationXraw+0.5
            const combinationY = (cationY+(Math.tan(60*(Math.PI/180))*combinationXraw-Math.tan(60*(Math.PI/180))*cationX))+0.5*Math.tan(60*(Math.PI/180))
            console.log(`Using ions: ${calcium}, ${magnesium}, ${sodiumPotassium}, ${chloride}, ${bicarbonate}, ${carbonate}, ${sulfate}`)
            console.log(`Placing sample ${results.length-1} at (${cationX}/${cationY}), (${anionX}/${anionY}), (${combinationX}/${combinationY})`)
            newOptions.series.push({
              type: 'scatter',
              name: `Sample ${results.length-1}`,
              data: [{
                x: cationX,
                y: cationY,
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
              },{
                x: anionX,
                y: anionY,
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
              },{
                x: combinationX,
                y: combinationY,
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
              }]
            })
          }
        }
    
        const sortedResults = results.sort((a,b) => parseInt(a[0]) - parseInt(b[0]))

        setOptions(newOptions)

        setData(sortedResults)
    
        const text = sortedResults.map(x => x.toString()).join('\n')
        
        var data = new Blob([text], {type: 'text/csv'});
    
        var url = window.URL.createObjectURL(data);

        console.log(`Filtered down to ${countIons}/${countMethod}/${countFraction}/${countWater}/${countTotal} rows`)
        setLoading(false)
      },
      error: (err,file) => {
        setLoading(false)
      }
    })

  }

  return (
    <>
      <Head>
        <title>Ions</title>
      </Head>
      <Nav />
      <main>
        <RangePicker disabledDate={disabledDate} format={"MM-DD-YYYY"} onChange={(dates, dateStrings)=>{setStartDate(dateStrings[0]);setEndDate(dateStrings[1]);console.log('Set dates ', dateStrings)}} disabled={loading} />
        <Button type="primary" onClick={() => getData()} loading={loading} disabled={loading}>{loading?'Processing':'Process'}</Button>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
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
