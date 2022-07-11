import { useMutation } from '@apollo/client'
import Skeleton from 'react-loading-skeleton'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showAlert } from '../app/features/alert/alertSlice'
import { ADD_COMMENT } from '../graphql/comment/mutations'
import { GET_COMMENTS } from '../graphql/comment/queries'


const CommentForm = ({ postId, loading, replyTo, setReplyTo, refetchQueries }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [comment, setComment] = useState()
  const { user: { _id }} = useSelector(state => state.auth)


  const [addComment, { loading: loading1, data }] = useMutation(ADD_COMMENT, {
    refetchQueries: [ 
      ...refetchQueries,
      {
        query: GET_COMMENTS,
        variables: { postId }
      }
    ]
  })

  useEffect(() => {
    setComment(replyTo)
  }, [replyTo])


  useEffect(() => {
    if(data?.result) {
      const { status, message } = data.result

      if(status === 'success') {
        setComment('')
        setReplyTo('')
      } 
      
      if(status === 'error') {
        dispatch(showAlert({ status, message }))
      }
    }
  }, [data, dispatch, setReplyTo])


  const handleSubmit = e => {
    e.preventDefault()
    _id ? addComment({ variables: { postId, comment }}) : navigate('/auth/login')
  }


  const handleChange = e => {
    const { value } = e.target
    setComment(value)

    replyTo && !value.includes(replyTo) && setReplyTo('')
  }


  return (
    <div className="comment-form">
      <h4 className="title">{!loading ? 'Leave a reply' : <Skeleton width={170} />}</h4>
      
      <form 
        id="commentForm"
        className="form"
        onSubmit={!loading1 && comment ? handleSubmit : undefined}
      >
        <div className="input-group">
          {
            !loading 
              ? <textarea 
                  placeholder="Comment"
                  maxLength={200}
                  name="comment"
                  className="form-control"
                  onChange={!loading1 ? handleChange : undefined}
                  value={comment}
                  disabled={loading1}
                  required
                ></textarea>
              : <Skeleton height={120} />
          }
        </div>

        {
          !loading 
            ? <button 
                type="submit"
                className="btn btn-info"
                disabled={loading1 || !comment}
              >
                Post Comment
              </button>
            : <Skeleton className="btn-skeleton"  />
        }
      </form>
    </div>
  )
}


export default CommentForm