import { useMutation } from '@apollo/client'
import { FaPencilAlt } from 'react-icons/fa'
import Skeleton from 'react-loading-skeleton'
import { useSelector, useDispatch } from 'react-redux'
import React, { useRef, useState, useEffect } from 'react'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { IoEllipsisVertical, IoTrash, IoArrowUndoSharp } from 'react-icons/io5'
import { showAlert } from '../app/features/alert/alertSlice'
import { EDIT_COMMENT, DELETE_COMMENT } from '../graphql/comment/mutations'
import { GET_COMMENTS } from '../graphql/comment/queries'
import { getDate } from '../utils/getDate'


const CommentItem = ({ _id, comment, author, date, postId, queries, postAuthor, setReplyTo }) => {
  const textareaRef = useRef('')
  const dispatch = useDispatch()
  const [_comment, setComment] = useState('')
  const [isActiveTextarea, setActiveTextarea] = useState(false)
  const { user: { _id: userId, role } } = useSelector(state => state.auth)


  const refetchQueries = [
    ...queries,
    {
      query: GET_COMMENTS,
      variables: { postId }
    }
  ]


  const [editComment, { data: data1 }] = useMutation(EDIT_COMMENT, { refetchQueries })
  const [deleteComment, { data: data2 }] = useMutation(DELETE_COMMENT, { refetchQueries })


  useEffect(() => {
    data1?.result?.status === 'error' && dispatch(showAlert(data1?.result))
    data2?.result?.status === 'error' && dispatch(showAlert(data2?.result))
  }, [data1?.result, data2?.result, dispatch])


  const handleActiveTextarea = () => {
    setActiveTextarea(true)
    setComment(comment)
    setTimeout(() => textareaRef.current.focus(), 150)
  }


  const handleEditComment = () => {
    if(comment !== _comment && _comment) {
      editComment({ variables: { postId, data: { _id, comment: _comment } } })
    }

    setActiveTextarea(false)
  }


  const handleReply = () => {
    setReplyTo(`${author?.fullname}, `)
    
    const commentForm = document.querySelector('#commentForm')
    const height = commentForm?.clientHeight
    const offsetTop = commentForm?.offsetTop
    
    const top = offsetTop - height
    setTimeout(() => {
      window.scrollTo({ top })
      commentForm.querySelector('textarea').focus()
    }, 150)
  }


  const handleDeleteComment = () => {
    deleteComment({ variables: { postId, commentId: _id }})
  }


  return (
    <div className="comment-item">
      <div className="col">
        {
          author?.avatar !== undefined
            ? <img 
                className="author-avatar" 
                src={author?.avatar || process.env.REACT_APP_DEFAULT_AVATAR}
                alt={author?.fullname} 
              />
            : <Skeleton className="author-avatar" />
        }
        
        <div className="content">
          <div className="header">
            <p className="author-name">{author?.fullname || <Skeleton width={120} />}</p>
            <p className="date">{getDate(date) || <Skeleton width={80} />}</p>
          </div>
          
          <div className="body">
            {
              isActiveTextarea
                ? <textarea
                    ref={textareaRef}
                    value={_comment}
                    onChange={e => setComment(e.target.value)}
                    onBlur={handleEditComment}
                    maxLength={200}
                    className="form-control"
                    required
                  ></textarea>
                  
                : <p className="comment">{comment || <Skeleton width={200} />}</p>
            }
          </div>
        </div>
      </div>

      {
        _id && author && postAuthor
          ? userId
            ? <DropdownButton
                id="dropdown-btn"
                variant="muted"
                title={<IoEllipsisVertical />}
              >
                {
                  author?._id === userId 
                    ? <Dropdown.Item 
                        className="edit-comment"
                        onClick={handleActiveTextarea}
                      >
                        <FaPencilAlt />
                        <span>Edit</span>
                      </Dropdown.Item>
                    : null
                }

                {
                  author?._id !== userId
                    ? <Dropdown.Item
                        className="delete-comment"
                        onClick={handleReply}
                      >
                        <IoArrowUndoSharp />
                        <span>Reply</span>
                      </Dropdown.Item>
                    : null
                }

                {
                  author?._id === userId || postAuthor === userId || role === 'admin'
                    ? <Dropdown.Item
                        className="delete-comment"
                        onClick={handleDeleteComment}
                      >
                        <IoTrash />
                        <span>Delete</span>
                      </Dropdown.Item>
                    : null
                }
              </DropdownButton>
            : ''

          : <Skeleton width={16} height={22} />
      }
    </div>
  )
}


export default CommentItem