import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/client'
import { useParams, useNavigate } from 'react-router-dom'
import { VERIFY_EMAIL } from '../graphql/auth/mutations'
import { showAlert } from '../app/features/alert/alertSlice'
import Loader from '../components/Loader'


const VerifyEmail = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const [verifyEmail, { data, loading }] = useMutation(VERIFY_EMAIL)
  

  useEffect(() => {
    params?.token && verifyEmail({ variables: { token: params.token }})
  }, [params?.token, verifyEmail])


  useEffect(() => {
    !loading && data?.result && dispatch(showAlert(data.result)) && navigate('/auth/login')
  }, [loading, data?.result, dispatch, navigate])


  return loading ? <Loader /> : null
}


export default VerifyEmail