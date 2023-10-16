import React, { useState } from 'react'
import './userInfo.css'
import { useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useSendLogoutMutation } from '../loginComponents/authApiSlice'
import adminpic from "../Assets/3.png";
import basicpic from "../Assets/4.png";
import { url } from '../global/url'
function UserInfoComponent() {
    const { username, roles,id } = useAuth()
    const [sendLogout, {
        isSuccess
    }] = useSendLogoutMutation()
    const navigate = useNavigate()
    const appoiments = () => { 
        navigate("/appoiments"); 
    }
    const admin = () => { 
        navigate("/admin"); 
    }
    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])
    const logoutButton = (
        <button
            className="btn-blue"
            title="Logout"
            onClick={sendLogout}
        >
             Cerrar Sesión
        </button>
    )
    const appoimentsButton = (
        <button
            className="btn-orange"
            title="Appoiments"
            onClick={appoiments}
        >
             Mis citas
        </button>
    )
    const adminButton = (
        <button
            className="btn-orange"
            title="Admin"
            onClick={admin}
        >
             Administracion
        </button>
    )
    const [ info, setInfo] = useState()
    const getInfo = async () => {
    try {
    const response = await fetch(`${url}/users/unique`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "id": id
        })
    })
    const json = await response.json ()
    if(json !== undefined)setInfo(json)
    } catch (err) {
    console.error(err)
    }
    }
    useEffect (() => getInfo(), [])
    console.log(info)
    if(info !==undefined){
        return (
            <div className="wrapper">
                <div className="card">
                    <div className="img">
                        <img src={roles === "Administrador" ? adminpic : basicpic} alt="Icono" width="100%"/>
                    </div>

                    <div className="cnt">
                        <div className="name">{info.name}</div>
                        <div className="txt">
                            <strong>{username}</strong>
                        </div>
                        <strong>{roles === "Adminstrador" ? "Usuario Administrador": "Usuario Basico"}</strong>

                        <div className="card-inf">

                        <div className="item">
                            <div className="title">Email</div>
                            <div className="txt">{info.correo}</div>
                        </div>

                        <div className="item">
                            <div className="title">Telefono</div>
                            <div className="txt">{info.celular}</div>
                        </div>
                        </div>
                        <div className="card-button">
                        {logoutButton}
                        {roles === "Administrador" ? adminButton : appoimentsButton}
                        </div>

                    </div>
                </div>
            </div>
        )
    }else{
        return(
            <div>
                No hay info
                {roles}
                {username}
                {id}
            </div>
        )
    }
}

export default UserInfoComponent