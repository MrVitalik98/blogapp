import React from 'react'
import { useSelector } from 'react-redux'
import { GET_USER_POSTS } from '../graphql/post/queries'
import PostItemUI from './PostItemUI'


const UserPostItem = ({ post, selectPost }) => {
  const { category } = useSelector(state => state.userPosts)

  const refetchQueries = [
    {
      query: GET_USER_POSTS,
      variables: { category }
    }
  ]


  return <PostItemUI 
            post={post} 
            isUserPost={true}
            selectPost={selectPost}
            refetchQueries={refetchQueries} 
          />
}


export default UserPostItem