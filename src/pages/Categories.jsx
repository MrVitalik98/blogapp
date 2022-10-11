import { useDispatch } from 'react-redux'
import { IoAddCircle } from 'react-icons/io5'
import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { openAddEditCategoryModal, closeAddEditCategoryModal } from '../app/features/modals/addEditCategory/addEditCategorySlice'
import { ADD_CATEGORY, EDIT_CATEGORY } from '../graphql/category/mutations'
import AddEditCategoryModal from '../components/modals/AddEditCategory'
import DeleteCategoryModal from '../components/modals/DeleteCategory'
import { GET_CATEGORIES } from '../graphql/category/queries'
import { showAlert } from '../app/features/alert/alertSlice'
import CategoryList from '../components/CategoryList'



const Categories = () => {
  const dispatch = useDispatch()
  const [total, setTotal] = useState(0)
  const [type, setType] = useState('addCategory')
  const [categories, setCategories] = useState(new Array(4).fill({}))

  const refetchQueries = [{ query: GET_CATEGORIES }]

  const [getCategories, { data: data1, loading: loading1 }] = useLazyQuery(GET_CATEGORIES, {
    fetchPolicy: 'network-only'
  })

  const [addCategory, { data: data2, loading: loading2 }] = useMutation(ADD_CATEGORY, { refetchQueries })

  const [editCategory, { data: data3, loading: loading3 }] = useMutation(EDIT_CATEGORY, { refetchQueries })


  useEffect(() => {
    getCategories()
  }, [getCategories])


  useEffect(() => {
    if(data2?.result) {
      const { status, message } = data2.result

      status === 'success' && dispatch(closeAddEditCategoryModal())
      status === 'error' && dispatch(showAlert({ status, message }))
    }
  }, [data2?.result, dispatch])


  useEffect(() => {
    if(data3?.result) {
      const { status, message } = data3.result

      status === 'success' && dispatch(closeAddEditCategoryModal())
      status === 'error' && dispatch(showAlert({ status, message }))
    }
  }, [data3?.result, dispatch])


  useEffect(() => {
    if(data1?.categories) {
      setCategories(data1.categories)
      setTotal(data1.categories.length)
    }
  }, [data1])


  const handleOpenAddEditCategoryModal = (type, category = null) => {
    setType(type)
    dispatch(openAddEditCategoryModal({ category }))
  }
    

  const methods = {
    addCategory: ({ name }) => addCategory({ variables: { name }}),
    editCategory: ({ _id, name }) => editCategory({ variables: { categoryId: _id, name }})
  }



  return (
    <>
      <div className="all-categories">
        <div className="header">
          <h1 className="title">All Categories</h1>
          {
            total 
              ? <p className="total-categories">
                  <span className="total text-warning">{total}</span>
                  <span>{total > 1 ? 'categories' : 'category'}</span>
                </p>
              : '' 
          }
        </div>

        <div className={`main ${categories?.length ? '' : 'bg-light'}`}>
          <div className="actions">
            <button 
              id="add-category"
              className="btn btn-dark"
              onClick={() => !loading1 && !loading2 ? handleOpenAddEditCategoryModal('addCategory') : undefined}
              disabled={loading1 || loading2}
            >
              <IoAddCircle />
              <span>Add Category</span>
            </button>
          </div>


          <CategoryList 
            categories={categories}
            handleOpenEditCategoryModal={category => handleOpenAddEditCategoryModal('editCategory', category)}
          />
        </div>
      </div>

      <AddEditCategoryModal 
        loading={loading2 || loading3} 
        addOrEditCategory={methods[type]}
      />

      <DeleteCategoryModal />
    </>
  )
}


export default Categories