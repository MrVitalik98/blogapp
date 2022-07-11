import { useMutation } from '@apollo/client'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GoAlert, GoX, GoTrashcan } from 'react-icons/go'
import { openDeletePostsModal, closeDeletePostsModal, setLoading } from '../../../app/features/modals/deletePosts/deletePostsSlice'
import { DELETE_POSTS } from '../../../graphql/post/mutations'
import { GET_USER_POSTS } from '../../../graphql/post/queries'
import BtnLoader from '../../BtnLoader'
import './index.scss'


const DeletePostsModal = () => {
  const dispatch = useDispatch()
  const { isShow, postIDs, multi } = useSelector(state => state.modals.deletePosts)


  const [deletePosts, { loading }] = useMutation(DELETE_POSTS, {
    refetchQueries: [
      {
        query: GET_USER_POSTS,
        variables: { category: '', count: 3 }
      }
    ]
  })

  
  const handleCloseModal = useCallback(() => dispatch(closeDeletePostsModal()), [dispatch])


  useEffect(() => {
    setLoading(loading)
    !loading && handleCloseModal()
  }, [loading, handleCloseModal])


  return (
    <Modal 
      show={isShow} 
      onHide={() => dispatch(openDeletePostsModal(postIDs))}
      id="delete-posts-modal"
    >
      <Modal.Body>
        <GoAlert className="text-warning alert-icon" />

        {
          multi
            ? <div className="content">
                <h4 className="title">Selected posts - {postIDs.length}</h4>
                <p className="text">Do you want to delete {postIDs.length > 1 ? 'them' : 'it'}</p>
              </div>
            : <p className="text">Do you want to delete this post?</p>
        }

        <div className="btn-group">
          <button 
            className="btn btn-secondary"
            onClick={handleCloseModal}
            disabled={loading}
          >
            <GoX />
            <span>Cancel</span>
          </button>

          <button 
            className="btn btn-danger"
            onClick={() => !loading ? deletePosts({ variables: { postIDs } }) : undefined}
            disabled={loading}
          >
            {
              loading 
                ? <BtnLoader />
                : <>
                    <GoTrashcan />
                    <span>Delete</span>
                  </>
            }
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default DeletePostsModal