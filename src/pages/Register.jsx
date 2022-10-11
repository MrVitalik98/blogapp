import * as Yup from 'yup'
import { Formik } from 'formik'
import { Link } from 'react-router-dom'
import { IoMail } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/client'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { showAlert } from '../app/features/alert/alertSlice'
import { SIGN_UP } from '../graphql/auth/mutations'
import BtnLoader from '../components/BtnLoader'
import ReCaptcha from '../components/ReCaptcha'


const Verify = ({ email }) => {
  return (
    <div className="verifyEmail">
      <div className="header">
        <div className="circle">
          <IoMail />
        </div>
        
        <h4 className="title">Verify your email address</h4>
      </div>

      <div className="body">
        <p>
          We have sent a confirmation email to <b>{email}</b>.
          To start using the system, click the link provided in it!
        </p>

        <p>
          Return to <Link to="/auth/login">Login Page</Link>
        </p>
      </div>
    </div>
  )
}


const Register = () => {
  const reRef = useRef('')
  const dispatch = useDispatch()
  const passwordRef = useRef('')
  const confirmPasswordRef = useRef('')
  const [reToken, setReToken] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isSeePassword, setSeePassword] = useState(false)

  
  const [createAccount, { data, loading }] = useMutation(SIGN_UP)


  useEffect(() => {
    if(data?.result) {
      const { status, message } = data.result
      status === 'error' && dispatch(showAlert({ status, message }))
    }
  }, [data?.result, dispatch])


  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
        .required('Required')
        .min(3, 'Too Short!')
        .max(30, 'Too Long!'),
    lastname: Yup.string()
        .min(3, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(40, 'The password must contain no more than 40 characters')
        .required('Required'),
    confirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Required')
  })


  const seePassword = useCallback(() => {
    setSeePassword(!isSeePassword)
    passwordRef.current.type = confirmPasswordRef.current.type = !isSeePassword ? 'text' : 'password'
  }, [isSeePassword])


  return (
    data?.result?.status === 'success' && userEmail 
      ? <Verify email={userEmail} />
      : <div className="register-page">
          <h1 className="title">Sign Up</h1>
        
          <Formik
            initialValues={{
              firstname: '',
              lastname: '',
              email: '',
              password: '',
              confirm: ''
            }}
            validateOnBlur
            onSubmit={(values) => {
              reRef.current.reset()
              createAccount({ variables: { form: values, reToken }})
              setUserEmail(values.email)
            }}
            validationSchema={validationSchema}
          >
            {({ values, errors, touched, handleChange, handleBlur, isValid, handleSubmit, dirty }) => (
              <form onSubmit={!loading ? handleSubmit : undefined}>
                <div className="input-group">
                  <div className="input">
                    <label htmlFor="firstname">First Name:</label>
                    <input 
                      type="text"
                      name="firstname"
                      onChange={!loading ? handleChange : undefined}
                      onBlur={handleBlur}
                      value={values.firstname}
                      autoComplete="off"
                      id="firstname"
                    />
    
                    {touched.firstname && errors.firstname && <span className="error">{errors.firstname}</span>}
                  </div>
    
                  <div className="input">
                    <label htmlFor="lastname">Last Name:</label>
                    <input 
                      type="text"
                      name="lastname"
                      onChange={!loading ? handleChange : undefined}
                      onBlur={handleBlur}
                      value={values.lastname}
                      autoComplete="off"
                      id="lastname"
                    />
    
                    {touched.lastname && errors.lastname && <span className="error">{errors.lastname}</span>}
                  </div>
                </div>
    
                <div className="input">
                  <label htmlFor="email">Email:</label>
                  <input 
                    type="email"
                    name="email"
                    onChange={!loading ? handleChange : undefined}
                    onBlur={handleBlur}
                    value={values.email}
                    autoComplete="off"
                    id="email"
                  />
    
                  {touched.email && errors.email && <span className="error">{errors.email}</span>}
                </div>
    
                <div className="input-container">
                  <label htmlFor="password">Password:</label>
                  
                  <div className="input-group">
                    <input 
                      type="password"
                      name="password"
                      ref={passwordRef}
                      onChange={!loading ? handleChange : undefined}
                      onBlur={handleBlur}
                      value={values.password}
                      id="password"
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
    
                <div className="input">
                  <label htmlFor="confirm">Confirm Password:</label>
                  <input 
                    type="password"
                    name="confirm"
                    ref={confirmPasswordRef}
                    onChange={!loading ? handleChange : undefined}
                    onBlur={handleBlur}
                    value={values.confirm}
                    id="confirm"
                  />
    
                  {touched.confirm && errors.confirm && <span className="error">{errors.confirm}</span>}
                </div>
    
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={(!isValid && !dirty) || loading}
                >
                  {loading ? <BtnLoader text="Register" /> : 'Register'}
                </button>
              </form>
            )}
          </Formik>

          <ReCaptcha setToken={setReToken} reRef={reRef} />
    
          <p className="text-center">
            Already have an account? {' '}
            <Link to="/auth/login" tabIndex={-1}>Login now</Link>
          </p>
        </div>
  )
}

export default Register