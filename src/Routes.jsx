import { useSelector } from 'react-redux'
import React, { lazy, Suspense } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import PageNotFound from './components/PageNotFound'
import Loader from './components/Loader'
const NewPassword = lazy(() => import('./pages/NewPassword'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'))
const Categories = lazy(() => import('./pages/Categories'))
const CreatePost = lazy(() => import('./pages/CreatePost'))
const Register = lazy(() => import('./pages/Register'))
const EditPost = lazy(() => import('./pages/EditPost'))
const Settings = lazy(() => import('./pages/Settings'))
const MyPosts = lazy(() => import('./pages/MyPosts'))
const Profile = lazy(() => import('./pages/Profile'))
const MyPost = lazy(() => import('./pages/MyPost'))
const Posts = lazy(() => import('./pages/Posts'))
const Login = lazy(() => import('./pages/Login'))
const Post = lazy(() => import('./pages/Post'))



const Pages = () => {
  const { token, user } = useSelector(state => state.auth)

  const pages = token && user._id 
    ? [
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: 'add-post',
          element: <CreatePost />
        },
        {
          path: 'my-posts',
          children: [
            { path: '', element: <MyPosts /> },
            { path: ':id', element: <MyPost /> },
            { path: 'edit/:id', element: <EditPost /> }
          ]
        },
        {
          path: 'settings',
          element: <Settings />
        },
        {
          path: 'auth/login',
          element: <Navigate to="/profile" />
        }
      ]
    : [
        {
          path: 'auth',
          children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'verify-email/:token', element: <VerifyEmail /> },
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'new-password', element: <NewPassword /> }
          ]
        },
        {
          path: 'profile',
          element: <Navigate to="/" />
        }
      ]


  if(user && user?.role === 'admin') {
    pages.push({ path: 'categories', element: <Categories /> })
  }



  return (
    <div className="container">
      <Suspense fallback={<Loader />}>
        {useRoutes([
          {
            path: '/',
            element: <Posts />
          },
          {
            path: 'posts/:id',
            element: <Post />
          },

          ...pages,

          {
            path: '*',
            element: <PageNotFound path={'/'} />
          }
        ])}
      </Suspense>
    </div>
  )
}


export default Pages