import { NextPage } from 'next'
import Head from 'next/head'
import Nav from '@components/nav'
import { ChangeEvent, CSSProperties, useState } from 'react'
import Papa from 'papaparse'
import moment from 'moment'
import { Button, Col, DatePicker, Divider, Form, Input, InputNumber, Layout, List, Row, Slider, Typography } from 'antd'
const { Paragraph } = Typography
const { Content } = Layout
const { RangePicker } = DatePicker

interface Props {
  results?: string
}

interface ResearchSite {
  identifier: string
  name: string
}

interface SearchQuery {
  site: string
  distance: number
}

const WQP: NextPage<Props> = ({ results }) => {
  const [siteIdentifiers, setSiteIdentifiers] = useState<Array<ResearchSite>>([])
  const [wqpIdentifiers, setWQPIdentifiers] = useState<Array<string>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const disabledDate = (current:moment.Moment):boolean => {
    return current > moment()
  }
  async function getData(values:SearchQuery) {
    setLoading(true)

    const rawNWIS = await fetch(`/api/nwis-sites?site=${values.site}`)
    const jsonNWIS = await rawNWIS.json()
    console.log(jsonNWIS)
    const comid = jsonNWIS.features?.[0]?.properties?.comid
    const rawComid = await fetch(`/api/comid?comid=${comid}&distance=${values.distance}`)
    const jsonComid = await rawComid.json()
    console.log(jsonComid)

    const siteList = [] as Array<ResearchSite>
    for( const site of jsonComid?.features ) {
      siteList.push({
        identifier: site?.properties?.identifier,
        name: site?.properties?.name
      })
    }
    setSiteIdentifiers(siteList)


    setLoading(false)

    /*
    const csv = Papa.parse(`https://www.waterqualitydata.us/data/Result/search?countrycode=US&statecode=US%3A54&countycode=US%3A54%3A039&startDateLo=${startDate}&startDateHi=${endDate}&mimeType=csv`, {
      download: true,
      header: true,
      step: (results, parser) => {
      },
      complete: () => {
      },
      error: (err,file) => {
        setLoading(false)
      }
    })
    */
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <Head>
        <title>WQP</title>
      </Head>
      <Nav />
      <Layout>
        <Content>
          {/*
          <RangePicker disabledDate={disabledDate} format={"MM-DD-YYYY"} onChange={(dates, dateStrings)=>{setStartDate(dateStrings[0]);setEndDate(dateStrings[1]);console.log('Set dates ', dateStrings)}} disabled={loading} />
          */}
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}            
            name="identifiers"
            initialValues={{ site:'USGS-03206000', distance:5 }}
            onFinish={getData}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Site"
              name="site"
              rules={[{ required: true, message: 'Please enter a USGS site name!'}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Distance"
              rules={[{ required: true, message: 'Please enter a distance!'}]}
            >
              <Row>
                <Col span={12}>
                  <Form.Item
                    name="distance"
                  >
                    <Slider
                      min={1}
                      max={100}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    name="distance"
                  >
                    <InputNumber
                      min={1}
                      max={100}
                      style={{ margin: '0 16px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>{loading?'Processing':'Process'}</Button>
            </Form.Item>
          </Form>
          <Divider orientation="left">Site Identifiers</Divider>
          <List
            bordered
            dataSource={siteIdentifiers}
            loading={loading}
            renderItem={item => <List.Item>{item.identifier} - {item.name}</List.Item>}
            rowKey={(item) => `${item.identifier}-${item.name}`}
          />
        </Content>
      </Layout>
    </>
  )
}

export default WQP
