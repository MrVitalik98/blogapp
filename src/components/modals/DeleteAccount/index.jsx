import { IoWarningSharp } from 'react-icons/io5'
import { FaTimesCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useLazyQuery } from '@apollo/client'
import React, { useState, useEffect, useCallback } from 'react'
import { closeDeleteAccountModal, openDeleteAccountModal } from '../../../app/features/modals/deleteAccount/deleteAccountSlice'
import { DELETE_ACCOUNT } from '../../../graphql/user/mutations'
import { GET_REASONS } from '../../../graphql/other/queries'
import { showAlert } from '../../../app/features/alert/alertSlice'
import { logout } from '../../../utils/auth'
import './index.scss'


const DeleteAccount = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [reason, setReason] = useState('')
  const [reasonList, setReasonList] = useState([])
  const { isShow } = useSelector(state => state.modals.deleteAccount)


  const [getReasons, { data: data1 }] = useLazyQuery(GET_REASONS)

  const [deleteAccount, { data: data2, loading }] = useMutation(DELETE_ACCOUNT)


  const handleCloseModal = useCallback(() => {
    dispatch(closeDeleteAccountModal())
    setReason('')
  }, [dispatch])


  useEffect(() => {
    getReasons()
  }, [getReasons])


  useEffect(() => {
    data1?.reasonList && setReasonList(data1.reasonList)
  }, [data1])
  

  useEffect(() => {
    if(data2?.result?.status === 'success') {
      dispatch(logout())
      handleCloseModal()
      navigate('/auth/login')
      dispatch(showAlert(data2.result))
    }
  }, [data2, navigate, dispatch, handleCloseModal])



  const handleDeleteAccount = () => {
    if(!reason) {
      dispatch(showAlert({ status: 'error', message: 'Please select a reason for deleting your account' }))
      return
    }
    
    deleteAccount({ variables: { reason }})
  }


  return (
    <Modal 
      show={isShow} 
      onHide={() => dispatch(openDeleteAccountModal())}
      id="delete-account-modal"
    >
      <Modal.Header>
        <h3 className="title">Choose a reason for deleting your account</h3>

        <FaTimesCircle
          id="closeModal"
          onClick={!loading ? handleCloseModal : undefined}
        />
      </Modal.Header>
      
      <Modal.Body>
        <ul>
          {
            reasonList?.map(reason => {
              return (
                <li key={reason?.id}>
                  <label>
                    <input 
                      type="radio"
                      name="reason"
                      onChange={() => setReason(reason?.title)}
                      required
                    /> 
                    <span className="reason">{reason?.title}</span>
                  </label>
                </li>
              )
            })
          }
        </ul>

        <div className="warning">
          <IoWarningSharp className="text-warning" />
          <span>Account will be permanently deleted</span>
        </div>

        <Button 
          variant="danger"
          onClick={!loading ? handleDeleteAccount : undefined}
          disabled={loading}
        >
          Delete
        </Button>
      </Modal.Body>
    </Modal>
  )
}


export default DeleteAccount