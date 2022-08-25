import style from './Layout.module.scss'
import { Menu } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import React from 'react'

const Layout = () => {
  const navigate = useNavigate()
  const menuItems = [
    { label: '首页', key: 'index' },
    {
      label: '请假申请', key: 'leave_', children: [
        { label: '我的申请', key: 'leave' },
        { label: '我的审批', key: 'approval' },
      ]
    }
  ]
  const clickMenu = ({ key }: { key: string }) => {
    navigate(key)
  }
  return (
    <div className={style.layout}>
      {/* 左侧导航栏 */}
      <div className={style.side}>
        <Menu items={menuItems} mode="inline" onClick={clickMenu}></Menu>
      </div>
      {/* 头部 */}
      <div className={style.header}></div>
      {/* 页面 */}
      <div className={style.page}>
        <Outlet />
      </div>
    </div>
  )
}
export default Layout