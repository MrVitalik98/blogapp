import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { hideAlert } from '../app/features/alert/alertSlice'


function Toast() {
    const dispatch = useDispatch()
    const { message, status } = useSelector(state => state.alert)

    if(status && message) toast[status](message, { 
        onClose(){ 
            dispatch(hideAlert()) 
        } 
    })

    return <ToastContainer autoClose={3000} />
}

export default Toast