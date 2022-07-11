import React from 'react'
import { useSelector } from 'react-redux'
import { GET_POST } from '../graphql/post/queries'
import PostUI from '../components/PostUI'


const Post = () => {
  const { category } = useSelector(state => state.allPosts)

  const refetchQueries = _id => {
    return {
      refetchQueries: [
        {
          query: GET_POST,
          variables: { postId: _id, category }
        }
      ]
    }
  }


  return <PostUI 
          CB_FUNC={GET_POST} 
          category={category}
          refetchQueries={refetchQueries} 
        />
}


export default Post