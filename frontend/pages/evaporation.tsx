import Head from 'next/head'
import Nav from './components/nav'
import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Button, Col, DatePicker, Form, Layout, Row } from "antd"
import moment from "moment"

export default function Evaporation () {
  const [data, setData] = useState<any>()
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState<boolean>(false)
  const disabledDate = (current: moment.Moment): boolean => {
    return current > moment()
  }
  const tailLayout = {
    wrapperCol: {
      offset: 11,
      span: 16,
    },
  };
  async function pollData () {
    const rawResponse = await fetch('/api/results', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'evaporation',
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
            label: 'evaporation',
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
    } catch {
      console.log('Caught error from json processing');
      btn.disabled = false
    }
  }
  async function getData () {
    const btn = document.getElementById('btn') as HTMLInputElement
    /*btn.disabled = true*/
    const rawResponse = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'evaporation'/*,
        start_date: (document.getElementById('start_date') as HTMLInputElement).value,
        end_date: (document.getElementById('end_date') as HTMLInputElement).value*/
      })
    })
    console.log(rawResponse)
    if (rawResponse.status !== 200) {
      setData({
        status: 'error',
        response: rawResponse
      })
      /*btn.disabled = false*/
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
        <title>Evaporation</title>
      </Head>
      <Nav />
      <main>
      <Layout>
          <Form onFinish={getData}>
            <Form.Item
              labelCol={{ span: 10 }}
              label="Date Range"
              name="dates"
              initialValue={[moment('1979-01-01'),moment()]}
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
        </Layout>  
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
      `}
      </style>
    </>
  )
}
