import * as Yup from 'yup'
import { Formik } from 'formik'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/client'
import { useNavigate, Link } from 'react-router-dom'
import React, { useEffect, useState, useRef } from 'react'
import { showAlert } from '../app/features/alert/alertSlice'
import { RESET_EMAIL } from '../graphql/auth/mutations'
import BtnLoader from '../components/BtnLoader'
import ReCaptcha from '../components/ReCaptcha'


const ForgotPassword = () => {
  const reRef = useRef('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [reToken, setReToken] = useState('')


  const [resetEmail, { data, loading }] = useMutation(RESET_EMAIL)


  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Required')
  })


  useEffect(() => {
    if(data?.result) {
      const { status, message } = data.result
      dispatch(showAlert({ status, message }))
      status === 'success' && navigate('/auth/login')
    }
  }, [data?.result, navigate, dispatch])



  return (
    <div className="forgot-password">
      <h2 className="title">Forgot Password</h2>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        validateOnBlur
        onSubmit={(values) => {
          reRef.current.reset()
          resetEmail({ variables: { ...values, reToken } }) 
        }}
      >
        {({ values, errors, touched, isValid, handleBlur, handleSubmit, handleChange, dirty }) => (
          <form onSubmit={!loading ? handleSubmit : undefined }>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input 
                type="email"
                name="email"
                id="email"
                value={values.email}
                onBlur={handleBlur}
                autoComplete='off'
                onChange={!loading ? handleChange : undefined}
              />

              {touched.email && errors.email && <span className="error">{errors.email}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-info"
              disabled={(!isValid && !dirty) || loading}
            >
              {loading ? <BtnLoader text="Send" /> : "Send"}
            </button>
          </form>
        )}
      </Formik>

      <ReCaptcha setToken={setReToken} reRef={reRef} />

      <p className="text-center">
        Back to <Link to="/auth/login" tabIndex={-1}>Login Page</Link>
      </p>
    </div>
  )
}


export default ForgotPassword