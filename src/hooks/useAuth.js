import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../loginComponents/authSlice"
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles, id } = decoded.UserInfo

        isAdmin = roles.includes('Admin')

        return { username,id, roles, isAdmin }
    }

    return { username: '', roles: '', isAdmin }
}
export default useAuth