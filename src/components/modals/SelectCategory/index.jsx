import { useQuery } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa'
import React, { useState, useEffect, useCallback } from 'react'
import { GET_CATEGORIES } from '../../../graphql/category/queries'
import { openSelectCategoryModal, closeSelectCategoryModal } from '../../../app/features/modals/selectCategory/selectCategorySlice'
import BtnLoader from '../../BtnLoader'
import './index.scss'



const SelectCategory = ({ createOrEditPost, form, loading2, status }) => {
  const dispatch = useDispatch()
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const { isShow } = useSelector(state => state.modals.selectCategory)


  const { data: data1, loading: loading1 } = useQuery(GET_CATEGORIES, {
    fetchPolicy: "network-only",
  })


  const handleCloseModal = useCallback(() => dispatch(closeSelectCategoryModal()), [dispatch])

  
  useEffect(() => {
    form?.category && setCategory(form.category)
  }, [form?.category])


  useEffect(() => {
    data1?.categories?.length && setCategories(data1.categories)
  }, [data1?.categories])


  useEffect(() => {
    !loading2 && status === 'success' && handleCloseModal()
  }, [status, loading2, handleCloseModal])
  

  const handleCreateOrEditPost = () => {
    createOrEditPost({ ...form, category })
  }
  

  return (
    <Modal 
      show={isShow} 
      id="select-category-modal"
      onHide={() => dispatch(openSelectCategoryModal())}
    >
      <Modal.Body>
        <h4 className="title">Choose a category to whom you will add your post</h4>

        <div className="form">
          <Form.Select 
            value={category}
            className="form-control"
            onChange={e => setCategory(e.target.value)}
          >
            <option className="d-none">Category not selected</option>
            {
              categories?.length 
                ? categories?.map(({ _id, name }) => {
                  return (
                    <option key={_id} value={_id}>{name}</option>
                  )
                }) 
                : <option disabled={true}>No categories</option>
            }
          </Form.Select>

          <div className="btn-group">
            <Button 
              variant="dark"
              onClick={!loading2 && !loading1 ? handleCloseModal : undefined}
              disabled={loading1 || loading2}
            >
              <FaTimesCircle />
              <span>Cancel</span>
            </Button>

            <Button 
              variant="success"
              onClick={!loading1 && !loading2 && category ? handleCreateOrEditPost : undefined}
              disabled={loading1 || loading2 || !category}
            >
              {
                loading2 
                  ? <BtnLoader />
                  : <>
                      <FaCheckCircle />
                      <span>{form?.category ? 'Save' : 'Create'}</span>
                    </>
              }
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default SelectCategory