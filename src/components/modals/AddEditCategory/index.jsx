import * as Yup from 'yup'
import { Formik } from 'formik'
import React, { useCallback } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa'
import { openAddEditCategoryModal, closeAddEditCategoryModal } from '../../../app/features/modals/addEditCategory/addEditCategorySlice'
import BtnLoader from '../../BtnLoader'
import './index.scss'



const AddOrEditCategory = ({ loading, addOrEditCategory }) => {
  const dispatch = useDispatch()
  const { isShow, category } = useSelector(state => state.modals.addEditCategory)


  const handleCloseModal = useCallback(() => dispatch(closeAddEditCategoryModal()), [dispatch])


  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required')
      .min(2, 'Too Short!')
      .max(30, 'Too Long!')
  })


  
  return (
    <Modal 
      show={isShow} 
      id="addOrEditCategoryModal"
      onHide={() => dispatch(openAddEditCategoryModal({}))}
    >
      <Modal.Body>
        <h4 className="title">{category?._id ? 'Edit' : 'Add New'} Category</h4>

        <Formik
          initialValues={{ name: category?.name || '' }}
          validationSchema={validationSchema}
          validateOnBlur
          onSubmit={(values) => {
            addOrEditCategory({ ...category, ...values })
          }}
        >
          {({ values, errors, touched, isValid, handleBlur, handleSubmit, handleChange, dirty }) => (
            <form onSubmit={!loading ? handleSubmit : undefined}>
              <div className="input-group">
                <label htmlFor="name">Category Name:</label>
                <input 
                  type="name"
                  name="name"
                  id="name"
                  value={values.name}
                  onBlur={handleBlur}
                  autoComplete='off'
                  onChange={handleChange}
                />

                {touched.name && errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="btn-group">
                <Button 
                  type="button"
                  variant="dark"
                  onClick={!loading ? handleCloseModal : undefined}
                  disabled={loading}
                >
                  <FaTimesCircle />
                  <span>Cancel</span>
                </Button>

                <Button 
                  type="submit"
                  variant="success"
                  disabled={(!isValid && !dirty) || loading}
                >
                  {
                    loading 
                      ? <BtnLoader />
                      : <>
                          <FaCheckCircle />
                          <span>{category?._id ? 'Save' : 'Add'}</span>
                        </>
                  }
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}


export default AddOrEditCategory