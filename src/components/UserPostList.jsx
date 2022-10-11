import { useLazyQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GET_USER_POSTS } from '../graphql/post/queries'
import { setPosts, setLoading } from '../app/features/posts/userPostsSlice'
import UserPostItem from './UserPostItem'
import NoData from './NoData'


const UserPostList = ({ userPosts, setUserPosts }) => {
  const dispatch = useDispatch()
  const { posts, category } = useSelector(state => state.userPosts)

  
  const [getUserPosts, { data, loading }] = useLazyQuery(GET_USER_POSTS, {
    fetchPolicy: 'network-only'
  })


  useEffect(() => {
    setUserPosts(prev => {
      return posts?.map(post => {
                const _post = prev.find(p => p._id === post._id)
                return _post ? ({ ...post, checked: _post.checked }) : ({ ...post, checked: false })
              })
    })
  }, [posts, setUserPosts])


  useEffect(() => {
    getUserPosts({ variables: { category }})
  }, [getUserPosts, category])


  useEffect(() => {
    data?.result?.posts && dispatch(setPosts(data.result))
  }, [data, dispatch])


  useEffect(() => {
    dispatch(setLoading(loading))
  }, [dispatch, loading])


  const selectPost = postId => {
    setUserPosts(userPosts.map(post => post._id === postId ? ({ ...post, checked: !post.checked}) : post))
  }


  return (
    Array.isArray(userPosts) && userPosts.length
      ? <div className="post-list">
          {
            userPosts.map((post, idx) => {
              return <UserPostItem 
                        post={post} 
                        key={post?._id || idx}
                        selectPost={selectPost}
                      />
            })
          }
        </div>

      : <NoData msg="No posts" />
  )
}


export default UserPostList