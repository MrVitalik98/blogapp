import * as Yup from 'yup'
import { Formik } from 'formik'
import queryString from 'query-string'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { CREATE_NEW_PASSWORD } from '../graphql/auth/mutations'
import { showAlert } from '../app/features/alert/alertSlice'
import { CHECK_TOKEN } from '../graphql/auth/queries'
import BtnLoader from '../components/BtnLoader'
import ReCaptcha from '../components/ReCaptcha'


const NewPassword = () => {
  const reRef = useRef('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const newPasswordRef = useRef('')
  const [token, setToken] = useState('')
  const confirmNewPasswordRef = useRef('')
  const [reToken, setReToken] = useState('')
  const [isSeeNewPassword, setSeeNewPassword] = useState(false)
  const [isSeeConfirmNewPassword, setSeeConfirmNewPassword] = useState(false)


  const [checkToken, { data: data1 }] = useLazyQuery(CHECK_TOKEN)

  const [createNewPassword, { data: data2, loading }] = useMutation(CREATE_NEW_PASSWORD)


  useEffect(() => {
    const parsed = queryString.parse(window.location?.search)
    parsed?.token ? setToken(parsed.token) : navigate('/auth/login')
  }, [navigate])


  useEffect(() => {
    token && checkToken({ variables: { token } })
  }, [token, checkToken])


  useEffect(() => {
    if(data1?.result) {
      const { status, message } = data1.result
      dispatch(showAlert({ status, message }))

      status === 'error' && navigate('/auth/login')
    }
  }, [data1?.result, navigate, dispatch])


  useEffect(() => {
    if(data2?.result) {
      const { status, message } = data2.result
      dispatch(showAlert({ status, message }))

      status === 'success' && navigate('/auth/login')
    }
  }, [data2?.result, navigate, dispatch])


  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(40, 'The password must contain no more than 40 characters')
        .required('Required'),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
        .required('Required')
  })


  const seeNewPassword = useCallback(() => {
    setSeeNewPassword(!isSeeNewPassword)
    newPasswordRef.current.type = !isSeeNewPassword ? 'text' : 'password'
  }, [isSeeNewPassword])


  const seeConfirmNewPassword = useCallback(() => {
    setSeeConfirmNewPassword(!isSeeConfirmNewPassword)
    confirmNewPasswordRef.current.type = !isSeeConfirmNewPassword ? 'text' : 'password'
  }, [isSeeConfirmNewPassword])


  return (
    <div className="new-password">
      <h2 className="title">Create New Password</h2>

      <Formik
        initialValues={{
          newPassword: '',
          confirmNewPassword: ''
        }}
        validationSchema={validationSchema}
        validateOnBlur
        onSubmit={(values) => {
          reRef.current.reset()
          createNewPassword({ variables: { token, form: { ...values }, reToken } }) 
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isValid, handleSubmit, dirty }) => (
          <form onSubmit={!loading ? handleSubmit : undefined}>
            <div className="input-container">
              <label htmlFor="newPassword">New Password:</label>
              
              <div className="input-group">
                <input 
                  type="password"
                  name="newPassword"
                  ref={newPasswordRef}
                  onChange={!loading ? handleChange : undefined}
                  onBlur={handleBlur}
                  value={values.newPassword}
                  id="newPassword"
                />

                <div className="input-group-append">
                  <label>
                    {
                      isSeeNewPassword 
                        ? (
                          <FaRegEye
                            className="text-secondary"
                            onClick={seeNewPassword}
                          />
                        )
                        : (
                          <FaRegEyeSlash
                            className="text-secondary"
                            onClick={seeNewPassword}
                          />
                        )
                    }
                  </label>
                </div>
              </div>

              {touched.newPassword && errors.newPassword && <span className="error">{errors.newPassword}</span>}
            </div>

            <div className="input-container">
              <label htmlFor="confirmNewPassword">Repeat Password:</label>
              
              <div className="input-group">
                <input 
                  type="password"
                  name="confirmNewPassword"
                  ref={confirmNewPasswordRef}
                  onChange={!loading ? handleChange : undefined}
                  onBlur={handleBlur}
                  value={values.confirmNewPassword}
                  id="confirmNewPassword"
                />

                <div className="input-group-append">
                  <label>
                    {
                      isSeeConfirmNewPassword 
                        ? (
                          <FaRegEye
                            className="text-secondary"
                            onClick={seeConfirmNewPassword}
                          />
                        )
                        : (
                          <FaRegEyeSlash
                            className="text-secondary"
                            onClick={seeConfirmNewPassword}
                          />
                        )
                    }
                  </label>
                </div>
              </div>

              {touched.confirmNewPassword && errors.confirmNewPassword && <span className="error">{errors.confirmNewPassword}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={(!isValid && !dirty) || loading}
            >
              {loading ? <BtnLoader text="Create" /> : 'Create'}
            </button>
          </form>
        )}
      </Formik>

      <ReCaptcha reRef={reRef} setToken={setReToken} />
    </div>
  )
}


export default NewPassword