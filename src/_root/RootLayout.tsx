import React from 'react'
import { Outlet,Navigate } from 'react-router'

function RootLayout() {
  return (
    <div>RootLayout
    <Outlet/>
    </div>
  )
}

export default RootLayout