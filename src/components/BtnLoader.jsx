import React from 'react'
import { Spinner } from 'react-bootstrap'


const BtnLoader = ({ text }) => {
  return (
    <div className="btn-loader">
      {
        text 
          ? <span>{text}</span>
          : ''
      }

      <Spinner animation="border" role="status">
        <span className="visually-hidden"></span>
      </Spinner>
    </div>
  )
}


export default BtnLoader