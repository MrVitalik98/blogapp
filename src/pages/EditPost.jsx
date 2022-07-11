import { FaPlus, FaTrashAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import React, { useState, useRef, useEffect } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { openSelectCategoryModal } from '../app/features/modals/selectCategory/selectCategorySlice'
import SelectCategoryModal from '../components/modals/SelectCategory'
import { imageValidator, postValidator } from '../utils/validator'
import { showAlert } from '../app/features/alert/alertSlice'
import { GET_USER_POST } from '../graphql/post/queries'
import { EDIT_POST } from '../graphql/post/mutations'


const initialState = {
  image: '',
  title: '',
  category: '',
  imageSize: 0,
  description: ''
}


const EditPost = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fileInputRef = useRef('')
  const postTitleRef = useRef('')
  const postDescriptionRef = useRef('')
  const [post, setPost] = useState()
  const [form, setForm] = useState(initialState)
  const { category } = useSelector(state => state.userPosts)
  const windowSize = useSelector(state => state.windowSize)
  
  
  const [getUserPost, { data: data1 }] = useLazyQuery(GET_USER_POST)
  
  const [editPost, { data: data2, loading: loading2 }] = useMutation(EDIT_POST)


  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])


  useEffect(() => {
    params?.id && getUserPost({ variables: { postId: params.id, category }})
  }, [params?.id, getUserPost, category])


  useEffect(() => {
    if(data1?.result?.post) {
      const { post } = data1.result
      
      setForm(form => ({
        ...form,
        title: post?.title,
        category: post?.category?._id,
        description: post?.description
      }))

      setPost(post)
    }
  }, [data1?.result])


  useEffect(() => {
    data1?.result?.alert && dispatch(showAlert(data1.result.alert)) && navigate('/my-posts')
  }, [data1?.result?.alert, navigate, dispatch])


  useEffect(() => {
    data2?.result?.status === 'success' && post?._id && navigate(`/my-posts/${post._id}`)
  }, [data2, navigate, post?._id])


  useEffect(() => {
    postTitleRef.current.style.height = '60px'

    if(postTitleRef.current.scrollHeight > postTitleRef.current.clientHeight) {
      postTitleRef.current.style.height = `${postTitleRef.current.scrollHeight}px`
    }
  }, [form?.title, windowSize])


  useEffect(() => {
    postDescriptionRef.current.style.height = '160px'

    if(postDescriptionRef.current.scrollHeight > postDescriptionRef.current.clientHeight) {
      postDescriptionRef.current.style.height = `${postDescriptionRef.current.scrollHeight}px`
    }
  }, [form?.description, windowSize])


  const handleChange = e => {
    const { name, value } = e.target
    setForm(form => ({
      ...form,
      [name]: value
    }))
  }


  const handleSelectImage = e => {
    const { status, message, file } = imageValidator(e.target.files[0], 3)
    
    if(status && message) {
      dispatch(showAlert({ status, message }))
      return
    }

    setForm(form => ({
      ...form,
      image: file,
      imageSize: file.size
    }))
  }


  const handleOpenModal = async () => {
    const { status, message } = postValidator(form, 5, 200, false)

    if(status && message) {
      dispatch(showAlert({ status, message }))
      return
    }
    
    dispatch(openSelectCategoryModal())
  }


  const handleEditPost = data => {
    editPost({ variables: { postId: post?._id, data }})
  }


  return (
    <>
      <div className="edit-post-page">
        <div className="post-header">
          <input
            type="file"
            className="d-none"
            ref={fileInputRef}
            onChange={handleSelectImage}
            accept='image/jpg, image/png, image/jpeg'
          />
          
          <div className="post-header_image">
            <img
              src={form?.image ? URL.createObjectURL(form.image) : post?.image}
              alt="post"
            />
          </div>

          <>
            {
              form?.image
                ? <button
                    className="btn btn-danger"
                    id="deletePostImage"
                    onClick={() => setForm(form => ({ ...form, image: '' }))}
                  >
                    <FaTrashAlt />
                  </button>
                
                : <button
                    id="addPostImage"
                    className="btn btn-secondary"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaPlus />
                  </button>
            }
          </>
        </div>

        <div className="post-body">
          <textarea 
            ref={postTitleRef}
            placeholder="Title"
            name="title"
            maxLength={20}
            className="form-control"
            value={form?.title}
            onChange={handleChange}
          >
          </textarea>

          <textarea 
            ref={postDescriptionRef}
            placeholder="Description"
            maxLength={1500}
            name="description"
            className="form-control"
            onChange={handleChange}
            value={form?.description}
          >
          </textarea>

          <button
            className="btn btn-success"
            type="button"
            id="createPost"
            onClick={handleOpenModal}
          >
            Continue
          </button>
        </div>
      </div>

      <SelectCategoryModal 
        form={form}
        loading2={loading2}
        status={data2?.result?.status}
        createOrEditPost={handleEditPost}
      />
    </>
  )
}

export default EditPost