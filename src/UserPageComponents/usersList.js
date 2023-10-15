import {React} from 'react'
import Swal from 'sweetalert2';
import DeleteIco from '../Assets/delete-ico.png';
import AppoimentsIco from '../Assets/appoiments-fullfiled.png';
import EditIco from '../Assets/edit-ico.png';
import SuperUserIco from '../Assets/admin-ico.png';
import { useGetServicesQuery } from '../ServicesComponents/servicesApiSlice';
import { url } from '../global/url';
import { useGetUsersQuery } from './usersApiSlice';
import { useNavigate } from 'react-router-dom';
function UsersList() {
    let workInfoData;
    const navigate = useNavigate();
    const {
        data: services,
        isSuccess:isSuccessS,
        refetch:refetchSer
    } = useGetServicesQuery('servicesList', {
        refetchOnFocus: false,
        refetchOnMountOrArgChange: false
    })
    const {
        data: users,
        isSuccess,
        refetch
    } = useGetUsersQuery('usersList', {
        refetchOnFocus: false,
        refetchOnMountOrArgChange: false
    })
    if(isSuccessS){
        const addUserFunction = async()=>{
            await Swal.fire({
                title: 'Agregando un usuario administrador',
                showCancelButton: true,
                html: `
                <h1>Datos del usuario</h1>
                <p>Nombre</p>
                <input type="text" id="nombre" class="swal2-input" style="margin:0px;width:90%;"placeholder="Nombre"">
                <p>Username</p>
                <input type="text" id="username" class="swal2-input" style="margin:0px;width:90%;"placeholder="Username"">
                <p>Telefono</p>
                <input type="text" id="telefono" class="swal2-input" style="margin:0px;width:90%;"placeholder="Telefono"">
                <p>Correo</p>
                <input type="email" id="email" class="swal2-input" style="margin:0px;width:90%;"placeholder="Correo"">
                <p>Contraseña</p>
                <input type="password" id="password" class="swal2-input" style="margin:0px;width:90%;"placeholder="Contraseña">
                `,
                confirmButtonText: 'Modificar',
                focusConfirm: false,
                preConfirm: () => {
                    const newname = Swal.getPopup().querySelector('#nombre').value
                    const newusername = Swal.getPopup().querySelector('#username').value
                    const newtelefono = Swal.getPopup().querySelector('#telefono').value
                    const newcorreo = Swal.getPopup().querySelector('#email').value
                    const newpassword = Swal.getPopup().querySelector('#password').value
                    if (!newname || !newusername || !newtelefono || !newcorreo || !newpassword) {
                        Swal.showValidationMessage(`Es necesario llenar todos los campos`)
                    }
                    let validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
                    if(!validEmail.test(newcorreo)){
                            Swal.showValidationMessage(`El correo no es valido`)
                    }
                    let usernameRegExp = /^[a-zA-Z]{8,15}$/;
                    if(!usernameRegExp.test(newusername)){
                        Swal.showValidationMessage(`El username no es valido`)
                    }
                    let passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/; 
                    if(!passwordRegExp.test(newpassword)){
                        Swal.showValidationMessage(`La contraseña no es valida`)
                    }
                  return {
                    newname: newname, 
                    newusername: newusername,
                    newtelefono : newtelefono,
                    newcorreo : newcorreo,
                    newpassword : newpassword
                }
                }
              }).then(async(result) => {
                if(result.isConfirmed){
                    try {
                        const response = await fetch(`${url}/users/`,{
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              'username': result.value.newusername,
                              'password':result.value.newpassword,
                              'name':result.value.newname,
                              'administrador':true,
                              'celular':result.value.newtelefono,
                              'correo':result.value.newcorreo
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
                          }).then(refetch())
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
              })
        }
        const editServiceFunction = async()=>{
            Swal.fire({
                title: '¿Estas seguro?',
                text: "Editar el servicio no afectara las citas registradas.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Regresar',
                confirmButtonText: 'Editar servicio'
              }).then(async (result) => {
                if(result.isConfirmed){
                    let selectservicehtml;
                    for(let i=0;i<services.length;i++){
                        selectservicehtml+=`<option value="${services[i].service_id}">${services[i].nombre}</option>`
                    }
                    await Swal.fire({
                        title: 'Edicion de un servicio',
                        showCancelButton: true,
                        html: `
                        <p>Servicio</p>
                        <select name="select" id="service" class="swal2-select" style="margin:0px">
                            <option value="0">Selecciona el servicio</option>
                            ${selectservicehtml}
                        </select>
                        `,
                        confirmButtonText: 'Editar',
                        focusConfirm: false,
                        preConfirm: () => {
                        const service = Swal.getPopup().querySelector('#service').value
                        if (service === '0') {
                            Swal.showValidationMessage(`Es necesario seleccionar el servicio a eliminar`)
                        }
                        return { service: service}
                        }
                    }).then(async(result) => {
                        if(result.isConfirmed){
                            let serviceInfo = services.find((service)=> service.service_id === parseInt(result.value.service))
                            await Swal.fire({
                                title: 'Editando un servicio',
                                showCancelButton: true,
                                html: `
                                <h1>Datos del servicio</h1>
                                <p>Nombre</p>
                                <input type="text" id="nombre" class="swal2-input" style="margin:0px;width:90%;" placeholder="Nombre" value="${serviceInfo.nombre}">
                                <p>Descripcion</p>
                                <textarea name="textarea" rows="10" cols="50" id="descripcion" class="swal2-textarea" style="margin:0px;width:90%;">${serviceInfo.descripcion}</textarea>
                                <p>Precio sugerido</p>
                                <input type="text" id="precio" class="swal2-input" style="margin:0px;width:90%;" placeholder="Precio sugerido" value="${serviceInfo.preciosugerido}">
                                `,
                                confirmButtonText: 'Modificar',
                                focusConfirm: false,
                                preConfirm: () => {
                                    const newname = Swal.getPopup().querySelector('#nombre').value
                                    const newdescripcion = Swal.getPopup().querySelector('#descripcion').value
                                    const newprecio = Swal.getPopup().querySelector('#precio').value
                                    if (!newname || !newdescripcion || !newprecio) {
                                        Swal.showValidationMessage(`Es necesario llenar todos los campos`)
                                    }
                                    if(isNaN(newprecio)){
                                        Swal.showValidationMessage(`Es precio no es un numero`)
                                    }
                                  return {
                                    newname: newname, 
                                    newdescripcion: newdescripcion,
                                    newprecio : parseFloat(newprecio),
                                    service_id: parseInt(result.value.service)
                                }
                                }
                              }).then(async(result) => {
                                if(result.isConfirmed){
                                    try {
                                        const response = await fetch(`${url}/services/`,{
                                            method: 'PATCH',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                service_id: result.value.service_id,
                                                nombre: result.value.newname,
                                                descripcion: result.value.newdescripcion,
                                                preciosugerido: result.value.newprecio
                                            })
                                        })
                                        const json = await response.json();
                                        if(json.message===true){
                                          Swal.fire({
                                            position: 'top-end',
                                            icon: 'success',
                                            title: 'Servicio actualizado',
                                            showConfirmButton: false,
                                            timer: 1500
                                          }).then(refetchSer())
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
                                })
                        }
                    })
                }

              })
        }
        const deleteServiceFunction = async()=>{
            Swal.fire({
                title: '¿Estas seguro?',
                text: "Eliminar el servicio no afectara las citas registradas, solo que no sera seleccionable para los usuarios en un futuro.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Regresar',
                confirmButtonText: 'Eliminar servicio'
              }).then(async (result) => {
                if(result.isConfirmed){
                    let selectservicehtml;
                    for(let i=0;i<services.length;i++){
                        selectservicehtml+=`<option value="${services[i].service_id}">${services[i].nombre}</option>`
                    }
                    await Swal.fire({
                        title: 'Eliminacion de un servicio',
                        showCancelButton: true,
                        html: `
                        <p>Servicio</p>
                        <select name="select" id="service" class="swal2-select" style="margin:0px">
                            <option value="0">Selecciona el servicio</option>
                            ${selectservicehtml}
                        </select>
                        `,
                        confirmButtonText: 'Eliminar',
                        focusConfirm: false,
                        preConfirm: () => {
                        const service = Swal.getPopup().querySelector('#service').value
                        if (service === '0') {
                            Swal.showValidationMessage(`Es necesario seleccionar el servicio a eliminar`)
                        }
                        return { service: service}
                        }
                    }).then(async(result) => {
                        if(result.isConfirmed){
                            try {
                                const response = await fetch(`${url}/services`,{
                                    method: 'DELETE',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        "service_id":parseInt(result.value.service)
                                    })
                                })
                                const json = await response.json();
                                if(json.message===true){
                                    Swal.fire(
                                        '¡Eliminado!',
                                        'El servicio ya no estara disponible para los clientes',
                                        'success'
                                    ).then(refetchSer());
                                }else{
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Algo salio mal!',
                                        footer:json.message
                                    })
                                }
                                } catch (err) {
                                return err.json;
                                }
                        }
                    })
                }

              })
        }
        const appoimentsfulfilledFunction = () =>{
            navigate(`/admin/appoiments/fulfilled`)
        }
        const addUserButton = (
            <button
                className="btn-orange"
                title="Automatic"
                onClick={addUserFunction}
            >
                Agregar usuario
            </button>
        )
        const editServiceButton = (
            <button
                className="btn-orange"
                title="Manual"
                onClick={editServiceFunction}
            >
                 Editar servicio
            </button>
        )
        const deleteServiceButton = (
            <button
                className="btn-orange"
                title="Manual"
                onClick={deleteServiceFunction}
            >
                 Eliminar servicio
            </button>
        )
        const appoimentListButton = (
            <button
                className="btn-orange"
                title="Consultas"
                onClick={appoimentsfulfilledFunction}
            >
                 Visualizar consultas
            </button>
        )
        workInfoData = [
            {
            image: SuperUserIco,
            title: "Crear usuario administrador",
            text: "Agrega nuevos usuarios para administrar la pagina.",
            button: addUserButton
            },
            {
            image: EditIco,
            title: "Edita un servicio",
            text: "Actualiza datos de los servicios prestados.",
            button: editServiceButton
            },
            {
            image: DeleteIco,
            title: "Elimina un servicio",
            text: "Elimina los servicios prestados.",
            button: deleteServiceButton
            },
            {
                image: AppoimentsIco,
                title: "Visualizar consultas",
                text: "Lista de las consultas cumplidas.",
                button: appoimentListButton
            },
        ];
    }
    
    const changeActivityFunction = async(userid,correo)=>{
        if(correo===null){
            Swal.fire({
                title: '¿Estas seguro?',
                text: "Necesitaras un correo y un telefono celular",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Regresar',
                confirmButtonText: 'Activar usuario'
              }).then(async (result) => {
                if (result.isConfirmed) {
                    await Swal.fire({
                        title: 'Activando el usuario',
                        showCancelButton: true,
                        html: `
                        <h1>Datos del usuario</h1>
                        <p>Correo</p>
                        <input type="email" id="email" class="swal2-input" placeholder="Correo">
                        <p>Telefono</p>
                        <input type="text" id="telefono" class="swal2-input" placeholder="Telefono">
                        `,
                        confirmButtonText: 'Modificar',
                        focusConfirm: false,
                        preConfirm: () => {
                          const email = Swal.getPopup().querySelector('#email').value
                          const telefono = Swal.getPopup().querySelector('#telefono').value
                          if (!email || !telefono ) {
                            Swal.showValidationMessage(`Es necesario llenar todos los campos`)
                          }
                          let validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
                          if(!validEmail.test(email)){
                            Swal.showValidationMessage(`El correo no es valido`)
                          }
                          return { email: email, telefono: telefono}
                        }
                      }).then(async(result) => {
                        if(result.isConfirmed){
                            try {
                                const response = await fetch(`${url}/users/activate`,{
                                    method: 'PATCH',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        "user_id": userid,
                                        "telefono":result.value.telefono,
                                        "correo":result.value.email
                                    })
                                })
                                const json = await response.json();
                                if(json.message === 'Not user updated'){
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'No se pudo activar el usuario'
                                    })
                                }else if(json.message === "Correo en uso"){
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'No se pudo activar el usuario',
                                        footer: 'El correo esta en uso'
                                    })
                                }
                                else{
                                    Swal.fire(
                                        'Activado!',
                                        'El usuario fue actualizado.',
                                        'success'
                                    ).then(refetch())
                                }
                            } catch (err) {
                                return err.json;
                            }
                        }
                      })
                    /*
                    */
                }
              });
        }else{
            Swal.fire({
                title: '¿Estas seguro?',
                text: "¡No podras administrar las citas si esta inactivo",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Regresar',
                confirmButtonText: 'Desactivar usuario'
              }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch(`${url}/users/unique`,{
                            method: 'DELETE',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "id": userid
                            })
                        })
                        const json = await response.json();
                        if(json.message === true){
                            Swal.fire(
                                '¡Desactivado!',
                                'El usuario fue desactivado.',
                                'success'
                            ).then(refetch())
                        }else{
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Algo salio mal!'
                            })
                        }
                        } catch (err) {
                        return err.json;
                        }
                }
              })
        }
        
    }
    const modificarFunction = async(user_id,correo,telefono,nombre,username)=>{
        Swal.fire({
            title: '¿Estas seguro?',
            text: "Necesitaras los datos a mandar, si no quieres cambiar la contraseña solo deja el campo vacio.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Regresar',
            confirmButtonText: 'Modificar usuario'
          }).then(async (result) => {
            if (result.isConfirmed) {
                await Swal.fire({
                    title: 'Actualizando el usuario de manera manual',
                    showCancelButton: true,
                    html: `
                    <h1>Datos del usuario</h1>
                    <p>Nombre</p>
                    <input type="text" id="nombre" class="swal2-input" style="margin:0px;width:90%;"placeholder="Nombre" value="${nombre}">
                    <p>Username</p>
                    <input type="text" id="username" class="swal2-input" style="margin:0px;width:90%;"placeholder="Username" value="${username}">
                    <p>Telefono</p>
                    <input type="text" id="telefono" class="swal2-input" style="margin:0px;width:90%;"placeholder="Telefono" value="${telefono}">
                    <p>Correo</p>
                    <input type="email" id="email" class="swal2-input" style="margin:0px;width:90%;"placeholder="Correo" value="${correo}">
                    <p>Contraseña</p>
                    <input type="password" id="password" class="swal2-input" style="margin:0px;width:90%;"placeholder="Contraseña">
                    `,
                    footer:'Recuerda que si no deseas cambiar la contraseña debes dejar el campo sin datos',
                    confirmButtonText: 'Modificar',
                    focusConfirm: false,
                    preConfirm: () => {
                        const newname = Swal.getPopup().querySelector('#nombre').value
                        const newusername = Swal.getPopup().querySelector('#username').value
                        const newtelefono = Swal.getPopup().querySelector('#telefono').value
                        const newcorreo = Swal.getPopup().querySelector('#email').value
                        const newpassword = Swal.getPopup().querySelector('#password').value
                        if (!newname || !newusername || !newtelefono || !newcorreo) {
                            Swal.showValidationMessage(`Es necesario llenar todos los campos`)
                        }
                        let validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
                        if(!validEmail.test(newcorreo)){
                                Swal.showValidationMessage(`El correo no es valido`)
                        }
                        let usernameRegExp = /^[a-zA-Z]{8,15}$/;
                        if(!usernameRegExp.test(newusername)){
                            Swal.showValidationMessage(`El username no es valido`)
                        }
                        let passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/; 
                        if(newpassword && !passwordRegExp.test(newpassword)){
                            Swal.showValidationMessage(`La contraseña no es valida`)
                        }
                      return {
                        newname: newname, 
                        newusername: newusername,
                        newtelefono : newtelefono,
                        newcorreo : newcorreo,
                        newpassword : newpassword === '' ? '-*-*-*' : newpassword
                    }
                    }
                  }).then(async(result) => {
                    if(result.isConfirmed){
                        try {
                            const response = await fetch(`${url}/users/unique`,{
                                method: 'PATCH',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    "id":user_id,
                                    "username":result.value.newusername,
                                    "password":result.value.newpassword,
                                    "name":result.value.newname,
                                    "celular":result.value.newtelefono,
                                    "correo":result.value.newcorreo}
                                )
                            })
                            const json = await response.json();
                            if(json.message === 'user updated'){
                                Swal.fire(
                                    'Modificado!',
                                    'El usuario fue modificado.',
                                    'success'
                                ).then(refetch())
                            }else{
                                if(json.message === 'Username o  correo en uso'){
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'El correo o el nombre de usuario esta en uso'
                                    })
                                }else{
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: json.message
                                    })
                                }
                            }
                        } catch (err) {
                            return err.json;
                        }
                    }
                  })
            }
          })
    }
    const appoimentsFunction = (user_id) =>{
        navigate(`/admin/appoiments/${user_id}`)
    }
    if(isSuccess){
        return (
            <>
            
            <div className="work-section-wrapper">
              <div className="work-section-bottom espaciado">
                {workInfoData.map((data) => (
                  <div className="work-section-info" key={data.title}>
                    <div className="info-boxes-img-container">
                      <img src={data.image} alt="" />
                    </div>
                    <h2>{data.title}</h2>
                    <p>{data.text}</p>
                    {data.button}
                  </div>
                ))}
              </div>
            </div>
            <main className="table">
                <section className="table__header">
                    <h1>Citas registradas</h1>
                </section>
                <section className="table__body">
                    <table>
                        <thead>
                            <tr>
                                <th> Estado </th>
                                <th> Nombre </th>
                                <th colSpan={3}> Opciones </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((data) => (
                                <tr key={data.user_id}>
                                    <td>
                                        <p className={data.correo === null ? "status cancelled" : data.administrador === true ? "status shipped":"status delivered"}>{data.correo === null ? "Inactivo" : data.administrador === true ? "Administrador":"Usuario activo"}</p>
                                    </td> 
                                   <td>{data.name}</td>
                                   <td className='columnabotones'> 
                                        <button
                                            className={data.correo === null || data.administrador === true? "buttonModificarD" : "buttonModificar"}
                                            title="Citas"
                                            onClick={()=>{appoimentsFunction(data.user_id)}}
                                        >
                                            Administrar citas
                                        </button>
                                    </td>
                                    <td  className='columnabotones'>
                                        <button
                                            className="buttonCancelar"
                                            title="Desactivar"
                                            onClick={()=>{changeActivityFunction(data.user_id,data.correo)}}
                                        >
                                            {data.correo === null ? "Activar" : "Desactivar"}
                                        </button>
                                    </td>
                                    <td  className='columnabotones'>
                                        <button
                                            className={data.correo === null ? "buttonModificarD" : "buttonModificar"}
                                            title="Modificar"
                                            onClick={()=>{modificarFunction(data.user_id,data.correo,data.celular,data.name,data.username)}}
                                        >
                                            Modificar
                                        </button>
                                    </td>
                                </tr>
                                
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
            </>
          )
    }
}

export default UsersList