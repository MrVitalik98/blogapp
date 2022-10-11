import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = ({ path }) => {
  return (
    <div className="page-not-found text-monospace">
      <h2 className="title">404</h2>

      <div className="content">
        <p className="message">Page Not Found</p>
        <p className="link">Return to <Link to={path} className="text-primary">Home Page</Link></p>
      </div>
    </div>
  )
}


export default PageNotFound