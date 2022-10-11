import { IoTrashSharp } from 'react-icons/io5'
import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { openDeletePostsModal } from '../app/features/modals/deletePosts/deletePostsSlice'
import DeletePostsModal from '../components/modals/DeletePosts'
import UserPostList from '../components/UserPostList'



const MyPosts = () => {
  const dispatch = useDispatch()
  const { loading, total } = useSelector(state => state.userPosts)
  const [userPosts, setUserPosts] = useState(new Array(3).fill({}))


  const isSelectedAllPosts = useMemo(() => {
    return userPosts?.every(post => post.checked)
  }, [userPosts])


  const isSelectPost = useMemo(() => {
    return userPosts?.some(post => post.checked)
  }, [userPosts])


  const selectAllPosts = () => {
    setUserPosts(userPosts?.map(post => ({ ...post, checked: !userPosts?.every(post => post.checked) })))
  }


  const handleOpenDeletePostsModal = () => {
    const selectedPosts = userPosts?.filter(post => post.checked)?.map(post => post?._id)
    dispatch(openDeletePostsModal({ postIDs: selectedPosts, multi: true }))
  }


  return (
    <>
      <div className="my-posts">
        <div className="header">
          <h1 className="title">My Posts</h1>
          {
            total 
              ? <p className="total-posts">
                  <span className="total text-warning">{total}</span>
                  <span>{`post${total > 1 ? 's' : ''}`}</span>
                </p>
              : '' 
          }
        </div>

        <div className={`main ${userPosts?.length ? '' : 'bg-light'}`}>
          <div className="actions">
            <button 
              id="select-all"
              className="btn btn-success"
              onClick={!loading && total ? selectAllPosts : undefined}
              disabled={loading || !total}
            >
              <input 
                type="checkbox"
                className="form-control"
                checked={userPosts?.length && isSelectedAllPosts}
                readOnly
              />
              <span>Select all</span>
            </button>

            <button 
              id="delete"
              className="btn btn-danger"
              onClick={!loading && isSelectPost ? handleOpenDeletePostsModal : undefined}
              disabled={loading || !isSelectPost}
            >
              <IoTrashSharp />
              <span>Delete</span>
            </button>
          </div>


          <UserPostList 
            userPosts={userPosts}
            setUserPosts={setUserPosts} 
          />
        </div>
      </div>

      <DeletePostsModal />
    </>
  )
}


export default MyPosts