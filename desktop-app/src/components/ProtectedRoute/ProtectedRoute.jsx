import {useNavigate} from 'react-router-dom'
import isAuthenticated from '../../utils/auth'

const navigate = useNavigate()

export default ProtectedRoute = ({children}) => {
    if(!isAuthenticated)
    {
        navigate('/login')
    }

    return children
}
