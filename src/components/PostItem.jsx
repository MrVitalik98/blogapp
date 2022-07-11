import React from 'react'
import { useSelector } from 'react-redux'
import { GET_ALL_POSTS, GET_POPULAR_POSTS } from '../graphql/post/queries'
import PostItemUI from './PostItemUI'


const PostItem = ({ post }) => {
  const { category, count } = useSelector(state => state.allPosts)

  const refetchQueries = [
    {
      query: GET_ALL_POSTS,
      variables: { count, category }
    },
    {
      query: GET_POPULAR_POSTS,
      variables: { category }
    }
  ]
  

  return <PostItemUI 
            post={post} 
            refetchQueries={refetchQueries} 
          />
}


export default PostItem