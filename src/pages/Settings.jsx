import * as Yup from 'yup'
import { Formik } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import { useMutation } from '@apollo/client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { IoPerson, IoPersonOutline, IoMail, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import { openDeleteAccountModal } from '../app/features/modals/deleteAccount/deleteAccountSlice'
import DeleteAccountModal from '../components/modals/DeleteAccount'
import { EDIT_USER_DATA } from '../graphql/user/mutations'
import { showAlert } from '../app/features/alert/alertSlice'
import { GET_USER } from '../graphql/user/queries'
import BtnLoader from '../components/BtnLoader'



const Settings = () => {
  const dispatch = useDispatch()
  const currentPasswordRef = useRef('')
  const newPasswordRef = useRef('')
  const confirmNewPasswordRef = useRef('')
  const [isSeeCurrentPassword, setSeeCurrentPassword] = useState(false)
  const [isSeeNewPassword, setSeeNewPassword] = useState(false)
  const [isSeeConfirmNewPassword, setSeeConfirmNewPassword] = useState(false)
  const { user: { _id, firstname, lastname, email, role } } = useSelector(state => state.auth)


  const [editUser, { data, loading }] = useMutation(EDIT_USER_DATA, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: _id }
      }
    ]
  })


  useEffect(() => {
    data?.result?.status && dispatch(showAlert({ ...data?.result }))
  }, [data?.result, dispatch])


  const seeCurrentPassword = useCallback(() => {
    setSeeCurrentPassword(!isSeeCurrentPassword)
    currentPasswordRef.current.type = !isSeeCurrentPassword ? 'text' : 'password'
  }, [isSeeCurrentPassword])


  const seeNewPassword = useCallback(() => {
    setSeeNewPassword(!isSeeNewPassword)
    newPasswordRef.current.type = !isSeeNewPassword ? 'text' : 'password'
  }, [isSeeNewPassword])


  const seeConfirmNewPassword = useCallback(() => {
    setSeeConfirmNewPassword(!isSeeConfirmNewPassword)
    confirmNewPasswordRef.current.type = !isSeeConfirmNewPassword ? 'text' : 'password'
  }, [isSeeConfirmNewPassword])


  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(3, 'Too Short!')
      .max(30, 'Too Long!')
      .required('Required'),
    lastname: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    currentPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(40, 'The password must contain no more than 40 characters')
      .when('confirmNewPassword', (value, field) => value ? field.required('Required') : field),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(40, 'The password must contain no more than 40 characters')
      .when('currentPassword', (value, field) => value ? field.required('Required') : field)
  })


  return (
    <div id="settings">
      <Formik
        initialValues={{
          firstname,
          lastname,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }}

        validateOnBlur
        validationSchema={validationSchema}

        onSubmit={(values) => {
          const { newPassword, confirmNewPassword } = values

          if(newPassword && newPassword !== confirmNewPassword) return 

          editUser({ variables: { data: values }})
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isValid, handleSubmit, dirty }) => (
          <form onSubmit={!loading ? handleSubmit : undefined}>
            <h2 className="title">Settings</h2>

            <div className="block">
              <div className="col">
                <label htmlFor="firstname">First Name:</label>

                <div className="input-group">
                  <div className="input-group-prepend">
                    <IoPerson />
                  </div>

                  <input 
                    type="text"
                    name="firstname"
                    onChange={!loading ? handleChange : undefined}
                    onBlur={handleBlur}
                    value={values.firstname}
                    id="firstname"
                    className="form-control"
                    disabled={loading}
                  />
                </div>

                {touched.firstname && errors.firstname && <span className="error">{errors.firstname}</span>}
              </div>

              <div className="col">
                <label htmlFor="lastname">Last Name:</label>

                <div className="input-group">
                  <div className="input-group-prepend">
                    <IoPersonOutline />
                  </div>

                  <input 
                    type="text"
                    name="lastname"
                    onChange={!loading ? handleChange : undefined}
                    onBlur={handleBlur}
                    value={values.lastname}
                    id="lastname"
                    className="form-control"
                    disabled={loading}
                  />
                </div>

                {touched.lastname && errors.lastname && <span className="error">{errors.lastname}</span>}
              </div>
            </div>

            <div className="block">
              <div className="col">
                <label htmlFor="email">Email:</label>

                <div className="input-group">
                  <div className="input-group-prepend">
                    <IoMail className="text-warning" />
                  </div>

                  <input 
                    type="text"
                    name="email"
                    value={email}
                    readOnly
                    id="email"
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div className="block passwords">
              <div className="col">
                <label htmlFor="currentPassword">Current Password:</label>

                <div className="input-group">
                  <input 
                    type="password"
                    ref={currentPasswordRef}
                    name="currentPassword"
                    onChange={!loading ? handleChange : undefined}
                    placeholder="********************"
                    value={values.currentPassword}
                    id="currentPassword"
                    className="form-control"
                    disabled={loading}
                  />

                  <div className="input-group-append">
                    <label>
                      {
                        isSeeCurrentPassword 
                          ? (
                            <IoEyeOutline
                              className="text-secondary"
                              onClick={seeCurrentPassword}
                            />
                          )
                          : (
                            <IoEyeOffOutline
                              className="text-secondary"
                              onClick={seeCurrentPassword}
                            />
                          )
                      }
                    </label>
                  </div>
                </div>

                {touched.currentPassword && errors.currentPassword && <span className="error">{errors.currentPassword}</span>}
              </div>

              <div className="col">
                <label htmlFor="newPassword">New Password:</label>

                <div className="input-group">
                  <input 
                    type="password"
                    ref={newPasswordRef}
                    name="newPassword"
                    onChange={!loading ? handleChange : undefined}
                    placeholder="********************"
                    value={values.newPassword}
                    id="newPassword"
                    maxLength={40}
                    className="form-control"
                    disabled={loading}
                  />

                  <div className="input-group-append">
                    <label>
                      {
                        isSeeNewPassword 
                          ? (
                            <IoEyeOutline
                              className="text-secondary"
                              onClick={seeNewPassword}
                            />
                          )
                          : (
                            <IoEyeOffOutline
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

              <div className="col">
                <label htmlFor="confirmNewPassword">Repeat New Password:</label>

                <div className="input-group">
                  <input 
                    type="password"
                    ref={confirmNewPasswordRef}
                    name="confirmNewPassword"
                    onChange={!loading ? handleChange : undefined}
                    placeholder="********************"
                    value={values.confirmNewPassword}
                    id="confirmNewPassword"
                    className="form-control"
                    maxLength={40}
                    disabled={loading}
                  />

                  <div className="input-group-append">
                    <label>
                      {
                        isSeeConfirmNewPassword 
                          ? (
                            <IoEyeOutline
                              className="text-secondary"
                              onClick={seeConfirmNewPassword}
                            />
                          )
                          : (
                            <IoEyeOffOutline
                              className="text-secondary"
                              onClick={seeConfirmNewPassword}
                            />
                          )
                      }
                    </label>
                  </div>
                </div>

                {values.newPassword && values.newPassword !== values.confirmNewPassword && <span className="error">Passwords do not match</span>}
              </div>
            </div>

            <div className="btn-group">
              {
                role !== 'admin'
                  ? <button 
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => !loading ? dispatch(openDeleteAccountModal()) : undefined}
                      disabled={loading}
                    >
                      Delete Account
                    </button>
                  : ''
              }
              
              <button 
                type="submit"
                className="btn btn-success"
                disabled={(!isValid && !dirty) || loading}
              >
                {loading ? <BtnLoader text='Save' /> : 'Save'}
              </button>
            </div>
          </form>
        )}
      </Formik>

      <DeleteAccountModal />
    </div>
  )
}


export default Settings