import React,{useState,useRef,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import "./LoginPage.css";

import { useDispatch } from 'react-redux'
import { setCredentials } from '../loginComponents/authSlice'
import { useLoginMutation } from '../loginComponents/authApiSlice'
import Swal from 'sweetalert2';
import usePersist from '../hooks/userPersist'
import Navbar from "../publiccomponents/Navbar";
import { FaUserLarge } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import Footer from '../publiccomponents/Footer'
import { url } from '../global/url';
function LoginPage() {
  const userRef = useRef()
  const errRef = useRef()
  const [persist, setPersist] = usePersist()
  //animacion
  const [sign_up_mode, setSign_up_mode] = useState(false);
  //campos de texto de sign in
  const [username, setUsernameSI] = useState('')
  const [password, setPasswordSI] = useState('')
  //campos de texto de register
  const [usernameR, setUsernameR] = useState('')
  const [passwordR, setPasswordR] = useState('')
  const [correoR, setCorreoR] = useState('')
  const [telefonoR, setTelefonoR] = useState('')
  const [nombreR, setNombreR] = useState('')
  // Error message
  const [errMsg, setErrMsg] = useState('')
  //navigate
  const navigate = useNavigate()
  const dispatch = useDispatch()
  //is loading
  const [login, { isLoading }] = useLoginMutation()

  const handleUserInputSI = (e) => setUsernameSI(e.target.value)
  const handlePwdInputSI = (e) => setPasswordSI(e.target.value)
  const handleUsernameInputR = (e) =>setUsernameR(e.target.value)
  const handlePasswordInputR = (e) =>setPasswordR(e.target.value)
  const handleCorreoInputR = (e) =>setCorreoR(e.target.value)
  const handleTelefonoInputR = (e) =>setTelefonoR(e.target.value)
  const handleNombreInputR = (e) =>setNombreR(e.target.value)
  useEffect(() => {
    userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])
  const handleSubmitSignIn = async (e) =>{
    e.preventDefault()
        try {
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsernameSI('')
            setPasswordSI('')
            console.log(accessToken)
            navigate('/')
        } catch (err) {
            if (!err.status) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No hay respuesta del servidor'
            })
            } else if (err.status === 400) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Aun hay campos vacios'
            })
            } else if (err.status === 401) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Credenciales incorrectas'
            })
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
  }
  const handleSubmitRegister = async (e) =>{
    e.preventDefault()
    if(!usernameR || !passwordR || !correoR || !telefonoR || !nombreR){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Aun hay campos vacios'
    })
    }else{
      let validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
      if(!validEmail.test(correoR)){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El correo no es valido'
        })
      }else{
        let passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/; 
        if(!passwordRegExp.test(passwordR)){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'La contraseña no es valida',
            footer:`
            <b><p>La contraseña debe seguir los siguientes parametros:</p></b>
            <p style='text-align:left;'>1. Longitud 8-30 caracteres</p>
            <p style='text-align:left'>2. Al menos una minuscula</p>
            <p style='text-align:left'>3. Al menos una mayuscula</p>
            <p style='text-align:left'>4. Al menos un numero</p>
            `
          })
        }else{
          let usernameRegExp = /^[a-zA-Z]{8,15}$/;
          if(!usernameRegExp.test(usernameR)){
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El username no es valido'
            })
          }else{
              try {
                const response = await fetch(`${url}/users/`,{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      'username': usernameR,
                      'password':passwordR,
                      'name':nombreR,
                      'administrador':false,
                      'celular':telefonoR,
                      'correo':correoR
                    })
                })
                const json = await response.json();
                if(json.message===true){
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Usuario Registrado',
                    showConfirmButton: false,
                    timer: 1500
                  })
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Algo salio mal! ',
                        footer:json.message
                    })
                }
                } catch (err) {
                return err.json;
                }
          }
        }
      }
    }
  }
  const handleToggle = () => setPersist(prev => !prev)
  const errClass = errMsg ? "errmsg" : "offscreen"
  if (isLoading) return <p>Loading...</p>
  return (
    <>
    <Navbar/>
    <div className={`container ${sign_up_mode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form action="#" className="sign-in-form" onSubmit={handleSubmitSignIn}>
            <h2 className="title">Iniciar sesión</h2>
            <div className="input-field">
                <FaUserLarge className='icon'/>
              <input type="text" placeholder="Username" ref={userRef} onChange={handleUserInputSI}/>
            </div>
            <div className="input-field">
                <FaLock className='icon'/>    
              <input type="password" placeholder="Contraseña" onChange={handlePwdInputSI}/>
            </div>
            <label htmlFor="persist" className="form__persist " >
                        <input
                            type="checkbox"
                            className="form__checkbox"
                            id="persist"
                            onChange={handleToggle}
                            checked={persist}
                        />
                        Confio en este dispositivo
            </label>
            <input type="submit" value="Iniciar sesión" className="btn solid" />
            <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
          </form>
          <form action="#" className="sign-up-form" onSubmit={handleSubmitRegister}>
            <h2 className="title">Registrarse</h2>
            <div className="input-field">
                <FaUserLarge className='icon'/>
              <input type="text" placeholder="Nombre completo" onChange={handleNombreInputR}/>
            </div>
            <div className="input-field">
                <FaUserLarge className='icon'/>
              <input type="text" placeholder="Username" onChange={handleUsernameInputR}/>
            </div>
            <div className="input-field">
                <FaRegEnvelope className='icon'/>
              <input type="email" placeholder="Correo" onChange={handleCorreoInputR}/>
            </div>
            <div className="input-field">
                <FaLock className='icon'/>    
              <input type="password" placeholder="Contraseña" onChange={handlePasswordInputR}/>
            </div>
            <div className="input-field">
                <FaPhone className='icon'/>
              <input type="text" placeholder="Telefono" onChange={handleTelefonoInputR}/>
            </div>
            <input type="submit" className="btn" value="Registrarse" />
            
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>¿No tienes cuenta?</h3>
            <p>
              Puedes registrar tus datos aquí!
            </p>
            <button className="btn transparent" id="sign-up-btn" onClick={() => setSign_up_mode(sign_up_mode => !sign_up_mode)}>
              Registrarse
            </button>
          </div>
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>¿Ya formas parte de nuestros clientes registrados?</h3>
            <p>
              Inicia sesión con tus datos aquí!
            </p>
            <button className="btn transparent" id="sign-in-btn" onClick={() => setSign_up_mode(sign_up_mode => !sign_up_mode)}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
    
  )
}

export default LoginPage