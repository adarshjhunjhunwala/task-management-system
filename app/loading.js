import React from 'react'
import { RingLoader } from 'react-spinners'

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center">
        <RingLoader loading={true} color="#FFFFFF" size={50} />
    </div>
  )
}