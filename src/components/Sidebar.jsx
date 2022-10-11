import { useNavigate } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'
import Skeleton from 'react-loading-skeleton'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GET_POPULAR_POSTS } from '../graphql/post/queries'
import { GET_CATEGORIES } from '../graphql/category/queries'
import { setCategory } from '../app/features/posts/allPostsSlice'
import { getDate } from '../utils/getDate'



const PopularPostItem = ({ post }) => {
  const navigate = useNavigate()
  const { loading } = useSelector(state => state.allPosts)

  return (
    <div 
      className={`post ${post?._id ? 'fetched' : ''}`}
      onClick={() => !loading && post?._id ? navigate(`/posts/${post._id}`) : undefined}
    >
      {
        post?.image
          ? <img
              alt={post?.title}
              src={post?.image}
              className="post-image"
            />
          : <Skeleton className="post-image" />
      }
      
      <div className="col-right">
        <p className="date">{getDate(post?.date, false) || <Skeleton />}</p>
        <p className="post-title">{post?.title || <Skeleton />}</p>
      </div>
    </div>
  )
}



const CategoryItem = ({ category }) => {
  const dispatch = useDispatch()
  const { category: categoryId, loading } = useSelector(state => state.allPosts)


  return (
    <>
      {
        category?._id
          ? <li 
              className={`category-name ${category._id === categoryId ? 'active' : ''}`}
              onClick={() => !loading ? dispatch(setCategory(category?._id)) : undefined}
            >
              {category.name}
            </li>
          : <p>
              <Skeleton height={19} />
            </p>
      }
    </>
  )
}



const Sidebar = () => {
  const [popularPosts, setPopularPosts] = useState([])
  const [categories, setCategories] = useState([])
  const { category } = useSelector(state => state.allPosts)


  const [getPopularPosts, { data: data1, loading: loading1 }] = useLazyQuery(GET_POPULAR_POSTS, {
    fetchPolicy: 'cache-and-network'
  })
  
  const [getCategories, { data: data2, loading: loading2 }] = useLazyQuery(GET_CATEGORIES, {
    fetchPolicy: 'cache-and-network'
  })


  useEffect(() => {
    getCategories()
    getPopularPosts({ variables: { category } })
  }, [getPopularPosts, getCategories, category])


  useEffect(() => {
    setCategories(data2?.categories)
  }, [data2?.categories])


  useEffect(() => {
    setPopularPosts(data1?.popularPosts)
  }, [data1?.popularPosts])


  return (
    <div className="sidebar">
      <div className="popular-posts shadow">
        <h3 className="title">{!loading1 ? 'Popular Posts' : <Skeleton />}</h3>
        
        <div className="popular-post-list">
          {
            loading1
              ? new Array(3).fill({}).map((post, idx) => {
                  return <PopularPostItem post={post} key={idx} />
                })

              : popularPosts?.length 
                  ? popularPosts.map(post => {
                      return <PopularPostItem post={post} key={post?._id} />
                    })

                  : <p className="noData text-danger">No posts</p>
          }
        </div>
      </div>

      <div className="categories shadow">
        <h3 className="title">{!loading2 ? 'Categories' : <Skeleton />}</h3>

        {
          loading2
            ? new Array(3).fill({}).map((category, idx) => {
              return <CategoryItem category={category} key={idx} />
            })

            : categories?.length 
              ? <div className='category-list'>
                  {
                    categories.map(category => {
                      return <CategoryItem category={category} key={category?._id} />
                    })
                  }
                </div>

              : <p className="noData text-danger">No categories</p>
        }
      </div>
    </div>
  )
}


export default Sidebar