import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa'
import { closeDeleteAvatarModal } from '../../../app/features/modals/deleteAvatar/deleteAvatarSlice'
import './index.scss'


const DeleteAvatar = ({ deleteAvatar }) => {
  const dispatch = useDispatch()
  const { isShow } = useSelector(state => state.modals.deleteAvatar)

  const handleCloseModal = () => dispatch(closeDeleteAvatarModal())

  const handleDeleteAvatar = () => {
    deleteAvatar()
    handleCloseModal()
  }


  return (
    <Modal 
      show={isShow} 
      onHide={handleCloseModal}
      id="delete-avatar-modal"
    >
      <Modal.Body>
        <p className="msg">Delete profile picture?</p>

        <div className="btn-group">
          <Button 
            variant="secondary"
            onClick={handleCloseModal}
          >
            <FaTimesCircle />
            <span>Cancel</span>
          </Button>

          <Button 
            variant="danger"
            onClick={handleDeleteAvatar}
          >
            <FaCheckCircle />
            <span>Delete</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default DeleteAvatar