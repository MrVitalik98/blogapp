import { FaPen } from 'react-icons/fa'
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useEffect, useState, useRef } from 'react'
import { 
  IoArrowBackCircleSharp, IoArrowForwardCircleSharp, IoCalendarOutline, 
  IoChatbubbleOutline, IoHeart, IoHeartOutline, IoShareSocialOutline 
} from 'react-icons/io5'
import { openSharePostModal } from '../app/features/modals/sharePost/sharePostSlice'
import { ADD_OR_DELETE_LIKE } from '../graphql/post/mutations'
import { showAlert } from '../app/features/alert/alertSlice'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import { getDate } from '../utils/getDate'



const PreviousOrNextPostItem = ({ post, type, isUserPost, reset }) => {
  const navigate = useNavigate()

  const openPost = postId => {
    navigate(`/${isUserPost ? 'my-' : ''}posts/${postId}`)
    reset()
  }

  const setBackground = img => ({ background: `url(${img}) center no-repeat`})


  return (
    <div 
      className={`${type}-post ${post?._id ? 'enableHover shadow' : ''}`}
      style={post?.image ? setBackground(post.image) : { background: '#fff' }}
      onClick={() => post?._id ? openPost(post._id) : undefined}
    >
      <div className="content">
        <p className="date">{getDate(post?.date, false) || <Skeleton width={100} />}</p>
        <p className="title">{post?.title || <Skeleton width={160} />}</p>
      </div>

      {
        post?._id 
          ? type === 'previous' 
            ? <IoArrowBackCircleSharp className="icon shadow" /> 
            : <IoArrowForwardCircleSharp className="icon shadow" />
          : <Skeleton className="icon" />
        }
    </div> 
  )
}



const Post = ({ CB_FUNC, refetchQueries, category, isUserPost = false }) => {
  const linkRef = useRef('')
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [post, setPost] = useState({})
  const [replyTo, setReplyTo] = useState('')
  const { user } = useSelector(state => state.auth)
  
  const { _id, image, title, likes, description, date, author, nextPost, previousPost, comments } = post


  const [getPost, { data: data1, loading: loading1 }] = useLazyQuery(CB_FUNC, {
    fetchPolicy: 'network-only'
  })

  const [addOrDeleteLike, { data: data2, loading: loading2 }] = useMutation(ADD_OR_DELETE_LIKE, { 
    ...refetchQueries(_id)
  })
  

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])


  const reset = () => {
    setReplyTo('')
  }


  useEffect(() => {
    if(data2?.result) {
      const { status, message } = data2.result

      status === 'error' 
        && message === 'Post with this id does not exist' 
        && dispatch(showAlert({ status, message: 'This post does not exist or has been deleted' }))
    }
  }, [data2, dispatch, navigate])


  useEffect(() => {
    params?.id && getPost({ variables: { postId: params.id, category }})
  }, [params?.id, getPost, category])


  useEffect(() => {
    if(data1?.result?.post) {
      setPost(data1.result.post)

      if(window?.location?.hash) {
        setTimeout(() => linkRef?.current?.click(), 150)
      }
    }
  }, [data1?.result?.post])


  useEffect(() => {
    data1?.result?.alert && dispatch(showAlert(data1.result.alert)) && navigate('/')
  }, [data1?.result?.alert, navigate, dispatch])


  const handleAddOrDeleteLike = () => {
    user?._id ? addOrDeleteLike({ variables: { postId: _id }}) : navigate('/auth/login')
  }


  return (
    <div className="post-container">
      <div className="post">
        {
          image && !loading1 
            ? <div className="post-header">
                <img 
                  alt={title}
                  src={image}
                  className="post-image"
                />

                {
                  user?._id === author?._id
                    && 
                  <button
                    className="btn btn-light shadow edit-post"
                    onClick={() => navigate(`/my-posts/edit/${_id}`)}
                  >
                    <FaPen />
                  </button>
                }
              </div>
            
            : <Skeleton className="post-header" />
        }

        <div className="post-body">
          <div id="info">
            <div className="author">
              {
                author?.avatar !== undefined && !loading1
                  ? <img 
                      alt={author.fullname}
                      src={author.avatar || process.env.REACT_APP_DEFAULT_AVATAR}
                      className="author-avatar"
                    />
                  : <Skeleton className="author-avatar" />
              }

              <p className="author-name">{ author?.fullname || <Skeleton width={100} /> }</p>
            </div>

            <div className="post-created-date">
              {
                date && !loading1
                  ? <IoCalendarOutline className="calendar-icon" />
                  : <Skeleton className="calendar-icon" height={28} width={28} />
              }

              <p className="date">{getDate(date) || <Skeleton width={100} />}</p>
            </div>
          </div>

          <h2 className="title text-center">{title || <Skeleton style={{ marginBottom: '20px', maxWidth: '400px' }} />}</h2>

          <div id="desc">
            {description && !loading1 ? <p className="post-description">{description}</p> : <Skeleton count={5} />}
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
                              onClick={!loading2 ? handleAddOrDeleteLike : undefined}
                            />
                          : <IoHeartOutline 
                              className="icon text-danger" 
                              onClick={!loading2 ? handleAddOrDeleteLike : undefined}
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
                      <a 
                        ref={linkRef}
                        href="#comments" 
                        className="text-dark"
                      >
                        <IoChatbubbleOutline className="icon" />
                      </a>
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
                      onClick={() => dispatch(openSharePostModal(post))}
                    />
                  : <Skeleton width={33} height={33} borderRadius={5} />
              }
            </div>
          </div>
        </div>
      </div>


      <div className="about-author">
        {
          author?.avatar !== undefined && !loading1
            ? <img
                className="avatar shadow-sm border border-secondary"
                alt={author.fullname}
                src={author.avatar || process.env.REACT_APP_DEFAULT_AVATAR}
              />
            : <Skeleton className="avatar" />
        }

        <h4 className="name">{author?.fullname || <Skeleton width={150} />}</h4>
        <p className="about">
          {
            author?.about === undefined 
              ? <Skeleton count={3} />
              : author.about
          }
        </p>
      </div>

      {
        previousPost !== null || nextPost !== null
          ? <div className="pagination">
              {
                (loading1 || previousPost !== null)
                  && <PreviousOrNextPostItem 
                        post={previousPost} 
                        type="previous" 
                        isUserPost={isUserPost}
                        reset={reset}
                      />
              }

              {
                (loading1 || nextPost !== null) 
                  && <PreviousOrNextPostItem 
                      post={nextPost} 
                      type="next" 
                      isUserPost={isUserPost}
                      reset={reset}
                    />
              }
            </div>
          : ''
      }

      <CommentForm 
        loading={loading1}
        postId={_id}
        reset={reset}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
        refetchQueries={refetchQueries(_id)?.refetchQueries}
      />

      <CommentList
        postId={_id}
        loading={loading1}
        postAuthor={author?._id}
        setReplyTo={setReplyTo}
        refetchQueries={refetchQueries(_id)?.refetchQueries}
      />
    </div>
  )
}


export default Post