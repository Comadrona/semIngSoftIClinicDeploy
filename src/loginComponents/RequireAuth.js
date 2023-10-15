import { Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Navbar from '../publiccomponents/Navbar'
import { Link } from "react-router-dom"
const RequireAuth = ({ allowedRoles }) => {
    const { roles } = useAuth()
    const content = (
        allowedRoles.includes(roles)
            ? <Outlet />
            : <>
                <Navbar/>
                <div >
                    <div className="overlay-video"></div>
                            <div className="content-video">
                                <h1>No tienes permisos necesarios</h1>
                                <Link to="/login">Por favor ingresa de nuevo</Link>
                            </div>
                </div>
            </>
    )

    return content
}
export default RequireAuth