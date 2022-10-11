import React, { useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa'
import { openDeleteCategoryModal, closeDeleteCategoryModal } from '../../../app/features/modals/deleteCategory/deleteCategorySlice'
import { DELETE_CATEGORY } from '../../../graphql/category/mutations'
import { GET_CATEGORIES } from '../../../graphql/category/queries'
import { showAlert } from '../../../app/features/alert/alertSlice'
import BtnLoader from '../../BtnLoader'
import './index.scss'


const DeleteCategory = () => {
  const dispatch = useDispatch()
  const { isShow, categoryId } = useSelector(state => state.modals.deleteCategory)

  const [deleteCategory, { data, loading }] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [
      {
        query: GET_CATEGORIES
      }
    ]
  })


  const handleDeleteCategory = () => {
    deleteCategory({ variables: { categoryId }})
  }


  useEffect(() => {
    if(data?.result) {
      const { status, message } = data.result

      status === 'success' && dispatch(closeDeleteCategoryModal())
      status === 'error' && dispatch(showAlert({ status, message }))
    }
  }, [data?.result, dispatch])



  return (
    <Modal 
      show={isShow} 
      onHide={() => dispatch(openDeleteCategoryModal(categoryId))}
      id="delete-category-modal"
    >
      <Modal.Body>
        <h3 className="title">Do you want to delete this category?</h3>
        <p className="msg">All posts in this category will be deleted!</p>

        <div className="btn-group">
          <Button 
            variant="secondary"
            onClick={() => !loading ? dispatch(closeDeleteCategoryModal()) : undefined}
            disabled={loading}
          >
            <FaTimesCircle />
            <span>Cancel</span>
          </Button>

          <Button 
            variant="danger"
            onClick={!loading ? handleDeleteCategory : undefined}
            disabled={loading}
          >
            {
              loading 
                ? <BtnLoader text="Deleteing..." />
                : <>
                    <FaCheckCircle />
                    <span>Delete</span>
                  </>
            }
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default DeleteCategory