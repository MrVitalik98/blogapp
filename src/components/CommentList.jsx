import { useDispatch } from 'react-redux'
import React, { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useLazyQuery } from '@apollo/client'
import { showAlert } from '../app/features/alert/alertSlice'
import { GET_COMMENTS } from '../graphql/comment/queries'
import CommentItem from './CommentItem'


const CommentList = ({ loading, postId, postAuthor, refetchQueries, setReplyTo }) => {
  const dispatch = useDispatch()
  const [total, setTotal] = useState(0)
  const [comments, setComments] = useState(new Array(3).fill({}))

  const [getComments, { data, loading1 }] = useLazyQuery(GET_COMMENTS)


  useEffect(() => {
    postId && getComments({ variables: { postId } })
  }, [getComments, postId])


  useEffect(() => {
    if(data?.result) {
      const { alert, comments } = data.result

      if(alert?.status === 'error') {
        dispatch(showAlert(alert))
        return
      } 

      setComments(comments)
      setTotal(comments.length)
    }
    
  }, [data?.result, dispatch])


  return (
    <div className="postComments" id="comments">
      {
        !loading && !loading1
          ? <h3 className="numberOfComments">
              {total} {`comment${total > 1 ? 's' : ''}`}
            </h3>
          : <h3>
              <Skeleton width={150} />
            </h3>
      }

      <div className="comment-list">
        {
          comments?.length 
            ? comments?.map((comment, idx) => {
                return <CommentItem 
                          key={comment?._id || idx} 
                          postId={postId}
                          setReplyTo={setReplyTo}
                          postAuthor={postAuthor}
                          queries={refetchQueries}
                          { ...comment } 
                        />
              })
            : <p className="noData text-danger">No comments</p>
        }
      </div>
    </div>
  )
}


export default CommentList