import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaTrashAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useRef, useEffect } from 'react'
import { openSelectCategoryModal } from '../app/features/modals/selectCategory/selectCategorySlice'
import SelectCategoryModal from '../components/modals/SelectCategory'
import { imageValidator, postValidator } from '../utils/validator'
import { showAlert } from '../app/features/alert/alertSlice'
import { CREATE_POST } from '../graphql/post/mutations'


const initialState = {
  image: '',
  title: '',
  imageSize: 0,
  description: ''
}


const CreatePost = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fileInputRef = useRef('')
  const postTitleRef = useRef('')
  const postDescriptionRef = useRef('')
  const [form, setForm] = useState(initialState)
  const windowSize = useSelector(state => state.windowSize)

  
  const [createPost, { data, loading }] = useMutation(CREATE_POST)


  useEffect(() => {
    data?.result?.alert?.status === 'success' && data?.result?.postId && navigate(`/my-posts/${data.result.postId}`)
  }, [data, navigate])


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
    const { status, message } = postValidator(form, 5, 200)

    if(status && message) {
      dispatch(showAlert({ status, message }))
      return
    }
    
    dispatch(openSelectCategoryModal())
  }


  const handleCreateOrEditPost = post => createPost({ variables: { post }})


  return (
    <>
      <div className="create-post-page">
        <div className="post-header">
          <input
            type="file"
            className="d-none"
            ref={fileInputRef}
            onChange={handleSelectImage}
            accept='image/jpg, image/png, image/jpeg'
          />

          {
            form.image 
              ? (
                <>
                  <div className="post-header_image">
                    <img
                      src={URL.createObjectURL(form?.image)}
                      alt="post"
                    />
                  </div>

                  <button
                    className="btn btn-danger"
                    id="deletePostImage"
                    onClick={() => setForm(form => ({ ...form, image: '' }))}
                  >
                    <FaTrashAlt />
                  </button>
                </>
              )
              : <button
                  className="btn btn-secondary"
                  id="addPostImage"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FaPlus />
                </button>
          }
        </div>

        <div className="post-body">
          <textarea 
            ref={postTitleRef}
            placeholder="Title"
            name="title"
            maxLength={20}
            className="form-control"
            value={form.title}
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
            value={form.description}
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
        loading2={loading}
        status={data?.result?.alert?.status}
        createOrEditPost={handleCreateOrEditPost}
      />
    </>
  )
}

export default CreatePost