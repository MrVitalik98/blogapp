import * as Yup from 'yup'
import { Formik } from 'formik'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLazyQuery } from '@apollo/client'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { showAlert } from '../app/features/alert/alertSlice'
import { SIGN_IN } from '../graphql/auth/queries'
import BtnLoader from '../components/BtnLoader'
import ReCaptcha from '../components/ReCaptcha'
import { authUser } from '../utils/auth'


const Login = () => {
  const [isSeePassword, setIsSeePassword] = useState(false)
  const [reToken, setReToken] = useState('')
  const passwordRef = useRef('')
  const dispatch = useDispatch()
  const reRef = useRef()

  
  const seePassword = useCallback(() => {
    setIsSeePassword(!isSeePassword)
    passwordRef.current.type = !isSeePassword ? 'text' : 'password'
  }, [isSeePassword])


  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(40, 'The password must contain no more than 40 characters')
      .required('Required')
  })


  const [login, { data, loading }] = useLazyQuery(SIGN_IN)


  useEffect(() => {
    if(data?.authData) {
      const { user, token, status, message } = data?.authData  

      if(user && token) {
        dispatch(authUser(token, user))
      }
  
      if(status && message) dispatch(showAlert({ status, message }))
    }
  }, [data?.authData, dispatch])



  return (
    <div className="login-page">
      <h1 className="title">Sign In</h1>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={validationSchema}
        validateOnBlur
        onSubmit={(values) => {
          reRef.current.reset()
          login({ variables: { ...values, reToken } })
        }}
      >
        {({ values, errors, touched, isValid, handleBlur, handleSubmit, dirty, handleChange }) => (
          <form onSubmit={!loading ? handleSubmit : undefined}>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input 
                type="email"
                name="email"
                id="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={!loading ? handleChange : undefined}
              />

              {touched.email && errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-container">
              <label htmlFor="password">Password:</label>
              
              <Link 
                to="/auth/forgot-password" 
                id="forgotPassword"
                tabIndex={-1}
              >
                Forgot Password
              </Link>

              <div className="input-group">
                <input 
                  type="password"
                  name="password"
                  id="password"
                  value={values.password}
                  onBlur={handleBlur}
                  ref={passwordRef}
                  onChange={!loading ? handleChange : undefined}
                />

                <div className="input-group-append">
                  <label>
                    {
                      isSeePassword 
                        ? (
                          <FaRegEye
                            className="text-secondary"
                            onClick={seePassword}
                          />
                        )
                        : (
                          <FaRegEyeSlash
                            className="text-secondary"
                            onClick={seePassword}
                          />
                        )
                    }
                  </label>
                </div>
              </div>

              {touched.password && errors.password && <span className="error">{errors.password}</span>}
            </div>

            <button 
              type="submit"
              className="btn btn-success"
              disabled={(!isValid && !dirty) || loading}
            >
              {loading ? <BtnLoader text="Login" /> : "Login"}
            </button>
          </form>
        )}
      </Formik>

      <ReCaptcha setToken={setReToken} reRef={reRef} />

      <p className="text-center">
        No account yet? {' '}
        <Link to="/auth/register" tabIndex={-1}>Create Account</Link>
      </p>
    </div>
  )
}

export default Login