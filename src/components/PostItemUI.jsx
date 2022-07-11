import React, { useEffect } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import { useMutation } from '@apollo/client'
import Skeleton from 'react-loading-skeleton'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { IoEllipsisVerticalOutline, IoTrash, IoCalendarOutline, IoChatbubbleOutline, IoShareSocialOutline, IoHeartOutline, IoHeart } from 'react-icons/io5'
import { openDeletePostsModal } from '../app/features/modals/deletePosts/deletePostsSlice'
import { openSharePostModal } from '../app/features/modals/sharePost/sharePostSlice'
import { ADD_OR_DELETE_LIKE } from '../graphql/post/mutations'
import { showAlert } from '../app/features/alert/alertSlice'
import { getDate } from '../utils/getDate'


const PostItemUI = ({ post, refetchQueries, selectPost, isUserPost = false }) => {
  let timeoutID = null
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { _id, title, description, likes, author, image, checked, date, comments } = post


  const [addOrDeleteLike, { data, loading }] = useMutation(ADD_OR_DELETE_LIKE, { refetchQueries })


  useEffect(() => {
    if(data?.result) {
      const { status, message } = data.result

      status === 'error' 
        && message === 'Post with this id does not exist' 
        && dispatch(showAlert({ status, message: 'This post does not exist or has been deleted' }))
    }
  }, [data, dispatch])


  const handleAddOrDeleteLike = e => {
    e.stopPropagation()
    user?._id ? addOrDeleteLike({ variables: { postId: _id }}) : navigate('/auth/login')
  }


  const handleReadPost = (hash = '') => {
    if(!timeoutID) {
      timeoutID = setTimeout(() => {
        const link = `/${isUserPost ? 'my-posts' : 'posts'}/${_id}${hash}`

        navigate(link)
        timeoutID = null
      }, 300)
    }
  }


  const handleShareWithPost = e => {
    e.stopPropagation()
    dispatch(openSharePostModal(post))
  }


  const handleDbClickOnPost = e => {
    if(timeoutID && !loading) {
      timeoutID = clearTimeout(timeoutID)
      handleAddOrDeleteLike(e)
    }
  }


  const handleSelectPost = () => {
    timeoutID && selectPost(_id)
    timeoutID = clearTimeout(timeoutID)
  }



  return(
    <div 
      className={`post-item shadow ${post?._id ? 'fetched' : ''}`}
      onClick={() => !loading && _id ? handleReadPost() : undefined}
      onDoubleClick={!loading ? handleDbClickOnPost : undefined}
    >
      <div className="post-header">
        {
          image
            ? <>
                <img 
                  alt={title}
                  src={image}
                  className="post-image"
                />

                {
                  isUserPost
                    ? <>
                        <input 
                          type="checkbox"
                          checked={checked}
                          className="form-control"
                          onChange={handleSelectPost}
                        />

                        <DropdownButton
                          id="dropdown-btn"
                          variant="muted"
                          title={<IoEllipsisVerticalOutline className="text-light" />}
                          onClick={e => e.stopPropagation()}
                        >
                          <Dropdown.Item 
                            className="edit-post"
                            onClick={() => navigate(`/my-posts/edit/${_id}`)}
                          >
                            <FaPencilAlt />
                            <span>Edit</span>
                          </Dropdown.Item>

                          <Dropdown.Item
                            className="delete-post"
                            onClick={() => dispatch(openDeletePostsModal({ postIDs: [_id] }))}
                          >
                            <IoTrash />
                            <span>Delete</span>
                          </Dropdown.Item>
                        </DropdownButton>
                      </>
                    : ''
                }
              </>
            : <Skeleton className="post-image" />
        }
      </div>

      <div className="post-body">
        <div id="info">
          <div className="author">
            {
              author?.avatar !== undefined
                ? <img 
                    alt={author?.fullname}
                    src={author?.avatar || process.env.REACT_APP_DEFAULT_AVATAR}
                    className="author-avatar"
                  />
                : <Skeleton className="author-avatar" />
            }

            <p className="author-name">{author?.fullname || <Skeleton width={100} />}</p>
          </div>

          <div className="post-created-date">
            {
              date 
                ? <IoCalendarOutline className="calendar-icon" />
                : <Skeleton className="calendar-icon" height={28} width={28} />
            }

            <p className="date">{getDate(date) || <Skeleton width={100} />}</p>
          </div>
        </div>

        <h2 className="title text-center">{title || <Skeleton style={{ marginBottom: '20px', maxWidth: '400px' }} />}</h2>

        <div id="desc">
          {description ? <p className="post-description">{description}</p> : <Skeleton count={5} />}
        </div>

        <div id="actions">
          <div className="likes">
            {
              likes
                ? <>
                    {
                      likes.findIndex(id => id.toString() === user?._id) > -1
                        ? <IoHeart 
                            className="icon text-danger" 
                            onClick={!loading ? handleAddOrDeleteLike : undefined}
                          />
                        : <IoHeartOutline 
                            className="icon text-danger" 
                            onClick={!loading ? handleAddOrDeleteLike : undefined}
                          />
                    }
                    <span className="numberOfLikes text-danger">{likes.length}</span>
                  </>
                : <Skeleton width={33} height={33} borderRadius={5} />
            }
          </div>

          <div className="chat">
            { 
              comments
                ? <>
                    <IoChatbubbleOutline className="icon" onClick={() => handleReadPost('#comments')} />
                    <span className="numberOfComments">{comments?.length}</span>
                  </>
                : <Skeleton width={33} height={33} borderRadius={5} />
            }
          </div>

          <div className="share">
            {
              likes
                ? <IoShareSocialOutline 
                    className="icon"
                    onClick={handleShareWithPost}
                  />
                : <Skeleton width={33} height={33} borderRadius={5} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}


export default PostItemUI