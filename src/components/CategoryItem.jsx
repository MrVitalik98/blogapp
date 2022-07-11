import React from 'react'
import { useDispatch } from 'react-redux'
import { FaPencilAlt } from 'react-icons/fa'
import Skeleton from 'react-loading-skeleton'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { IoEllipsisVerticalOutline, IoTrash } from 'react-icons/io5'
import { openDeleteCategoryModal } from '../app/features/modals/deleteCategory/deleteCategorySlice'


const CategoryItem = ({ category, handleOpenEditCategoryModal }) => {
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  const { _id, name, posts } = category


  return(
    _id
      ? <div 
          className='category-item shadow'
          // onClick={() => !loading && _id ? handleReadPost() : undefined}
        >
          <DropdownButton
            id="dropdown-btn"
            variant="muted"
            title={<IoEllipsisVerticalOutline className="text-light" />}
            onClick={e => e.stopPropagation()}
          >
            <Dropdown.Item 
              className="edit-category"
              onClick={() => handleOpenEditCategoryModal({ _id, name })}
            >
              <FaPencilAlt />
              <span>Edit</span>
            </Dropdown.Item>

            <Dropdown.Item
              className="delete-category"
              onClick={() => dispatch(openDeleteCategoryModal(_id))}
            >
              <IoTrash />
              <span>Delete</span>
            </Dropdown.Item>
          </DropdownButton>

          <h2 className="category-name">{name}</h2>
          <p className="total-posts">
            <span className="total">{posts?.length}</span>
            <span>{`post${posts?.length > 1 ? 's' : ''}`}</span>
          </p>
        </div>
      : <Skeleton className="category-item bg-light" />
  )
}


export default CategoryItem