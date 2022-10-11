import React from 'react'
import CategoryItem from './CategoryItem'
import NoData from './NoData'


const CategoryList = ({ categories, handleOpenEditCategoryModal }) => {
  return (
    Array.isArray(categories) && categories.length
      ? <div className="category-list">
          {
            categories.map((category, idx) => {
              return <CategoryItem 
                        category={category} 
                        key={category?._id || idx}
                        handleOpenEditCategoryModal={handleOpenEditCategoryModal}
                      />
            })
          }
        </div>

      : <NoData msg="No categories" />
  )
}


export default CategoryList