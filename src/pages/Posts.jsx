import React from 'react'
import PostList from '../components/PostList'
import Sidebar from '../components/Sidebar'


const Posts = () => {
  return (
    <div className="main">
      <PostList />
      <Sidebar />
    </div>
  )
}

export default Posts