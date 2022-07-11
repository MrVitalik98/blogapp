import React from 'react'
import { useSelector } from 'react-redux'
import { GET_USER_POST } from '../graphql/post/queries'
import PostUI from '../components/PostUI'



const MyPost = () => {
  const { category } = useSelector(state => state.userPosts)

  const refetchQueries = _id => {
    return {
      refetchQueries: [
        {
          query: GET_USER_POST,
          variables: { postId: _id, category }
        }
      ]
    }
  }


  return <PostUI
            CB_FUNC={GET_USER_POST}
            category={category}
            isUserPost={true}
            refetchQueries={refetchQueries} 
          />
}


export default MyPost