import React, { ChangeEvent, useState, useEffect } from "react"
import { Table, Button, Input, Space, Badge, Select, Modal, Form, DatePicker } from 'antd'
import style from './Leave.module.scss'
import { fmtLocalTime } from '../../utils'
import dayjs from "dayjs"
import { SearchOutlined, RedoOutlined } from '@ant-design/icons'
import server from '../../utils/axios'
import Flex from '../../components/Flex/Flex'
import moment from "moment"

interface IApplyStateMap {
  [key: number]: any
}
const applyStateMap: IApplyStateMap = {
  0: {
    status: 'processing',
    text: '审批中'
  },
  1: {
    status: 'success',
    text: '通过'
  },
  2: {
    status: 'error',
    text: '驳回'
  },
}
const leaveTypeOptions = [
  { key: 0, value: '全部' },
  { key: 1, value: '事假' },
  { key: 2, value: '病假' },
  { key: 3, value: '产假' },
]
const { Option } = Select;
const Leave = () => {
  const [dataSource, setDataSource] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const { RangePicker } = DatePicker;

  const [searchParams, setSearchParams] = useState({
    name: '', // 请假事由
    leaveType: 0, // 请假类型
  })

  // 搜索
  const search = () => {
    setLoading(true)
    server.get('/leave/list', {
      params: searchParams
    }).then(res => {
      setDataSource(res.data)
      setLoading(false)
    })
  }
  // 重置搜索
  const reset = () => {
    searchParams.name = ''
    searchParams.leaveType = 0
    search()
    setSearchParams({ ...searchParams })
  }
  // 进来会先调用一次，然后依赖变更时再调用
  useEffect(() => {
    search()
  }, [])
  const columns = [
    {
      title: '请假事由',
      dataIndex: 'reason',
      render: (reason: string) => {
        return <a>{reason}</a>
      },
    },
    {
      title: '请假类型',
      dataIndex: 'type',
      render: (type: number) => {
        return <span>{leaveTypeOptions.find(val => val.key === type)?.value}</span>
      }
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: (startTime: string) => {
        return <span>{fmtLocalTime(startTime)}</span>
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: (endTime: string) => {
        return <span>{fmtLocalTime(endTime)}</span>
      }
    },
    {
      title: '请假时长',
      dataIndex: 'hour',
      render: (_: any, { startTime, endTime }: any) => {
        const hour = dayjs(endTime).diff(startTime, 'hour')
        return <span>{hour + '个小时'}</span>
      }
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      render: (applyTime: string) => {
        return <span>{fmtLocalTime(applyTime)}</span>
      }
    },
    {
      title: '审批状态',
      dataIndex: 'applyState',
      render: (applyState: number) => {
        return <Badge status={applyStateMap[applyState].status} text={applyStateMap[applyState].text} />
      }
    },
  ]
  const nameChange = (e: ChangeEvent<HTMLInputElement>) => {
    searchParams.name = e.target.value
    setSearchParams({ ...searchParams })
  }
  const leaveTypeChange = (val: number) => {
    searchParams.leaveType = val
    setSearchParams({ ...searchParams })
  }
  // 新增请假
  const submit = () => {
    form.validateFields().then(values => {
      const params = {
        reason: values.reason,
        type: values.type,
        startTime: moment(values.times[0]).format('YYYY-MM-DD HH:mm') + ':00',
        endTime: moment(values.times[1]).format('YYYY-MM-DD HH:mm') + ':00',
      }
      server.post('/leave/add', params).then(() => {
        setConfirmLoading(false)
        form.resetFields()
        setIsModalVisible(false)
        search()
      })
    })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };
  return (
    <div className="page">
      <div className="m-16">
        <div className=" bg-white p-16 mb-16">
          <Space size="middle">
            <div>
              <Space>
                <span>请假事由</span>
                <Input value={searchParams.name} onChange={nameChange} className={style.search_input} placeholder="请输入" />
              </Space>
            </div>
            <div>
              <Space>
                <span>请假类型</span>
                <Select value={+searchParams.leaveType} onChange={leaveTypeChange} placeholder="请选择" className={style.search_select}>
                  {leaveTypeOptions.map(val => <Option value={val.key} key={val.key}>{val.value}</Option>)}
                </Select>
              </Space>
            </div>
            <Button loading={loading} type="primary" icon={<SearchOutlined />} onClick={search}>查询</Button>
            <Button onClick={reset} icon={<RedoOutlined />}>重置</Button>
          </Space>
        </div>
      </div>
      <div className="bg-white p-16 m-16">
        <Flex justifyContent="space-between" alignItems="center" className="mb-8">
          <span>查到{dataSource.length}条数据</span>
          <Flex>
            <Button type="primary" onClick={showModal}>新增</Button>
          </Flex>
        </Flex>
        <Table dataSource={dataSource} columns={columns} loading={loading} rowKey="id" />
      </div>
      <Modal title="请假" visible={isModalVisible} onOk={submit} onCancel={handleCancel} confirmLoading={confirmLoading}>
        <Form form={form}>
          <Form.Item name="reason" label="请假原因" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="请假类型" rules={[{ required: true }]}>
            <Select placeholder="请选择请假类型">
              {leaveTypeOptions.slice(1).map(val => <Option value={val.key} key={val.key}>{val.value}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="times" label="请假时长" rules={[{ required: true }]}>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Leave