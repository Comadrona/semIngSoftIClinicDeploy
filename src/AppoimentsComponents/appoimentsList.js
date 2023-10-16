import React from 'react'
import './appoimentsList.css'
import { useGetAppoimentsQuery } from './appoimentsApiSlice'
import useAuth from '../hooks/useAuth'
import Swal from 'sweetalert2'
import Calendar from "../Assets/calendar3.png";
import automatic from "../Assets/automatic.png";
import './appoimentsList.css'
import { useGetServicesQuery } from '../ServicesComponents/servicesApiSlice';
import { url } from '../global/url'
function AppoimentsList() {
    const {id } = useAuth()
    let workInfoData;
    let automaticButton,manualButton;
    const {
        data: services,
        isSuccess:isSuccessS
    } = useGetServicesQuery('servicesList', {
        refetchOnFocus: false,
        refetchOnMountOrArgChange: false
    })
    const {
        data: appoiments,
        isSuccess,
        refetch
    } = useGetAppoimentsQuery('appoimentsList', {
        refetchOnFocus: false,
        refetchOnMountOrArgChange: false
    })
    if(isSuccessS){
        let servicesOptions={};
        services.map((data=>{
            servicesOptions[data.service_id]=data.nombre;
            return data;
        }))
        const crearCitaAutomaticaFunction = async()=>{
            try {
            const response = await fetch(`${url}/users/clinicProfile`,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "userid": id
                })
            })
            const json = await response.json();
            if(json.message){
                const {value:service} = await Swal.fire({
                title: 'Selecciona el servicio deseado',
                input: 'select',
                inputOptions: servicesOptions,
                inputPlaceholder: 'Selecciona un servicio',
                showCancelButton: true
                })
                if(service){
                Swal.fire({
                    title: '¿Estas seguro?',
                    text: "El sistema tomara en cuenta tus preferencias de horario.",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Continuar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                    console.log('Creando cita con el servicio con id '+service)
                        try {
                            const response = await fetch(`${url}/appoiments/automatic`,{
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    "user_id": id,
                                    "service_id":service
                                })
                            })
                            const json = await response.json();
                            if(json.message===true){
                                let date = new Date(json.fechayhora);
                                Swal.fire(
                                    '¡Creada!',
                                    'La cita fue creada con la fecha y hora: '+date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
                                    'success'
                                ).then(refetch);
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
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Parece que no contamos con tus preferencias de horario'
                })
            }
            } catch (err) {
            return err.json;
            }
        }
        const crearCitaManualFunction = async()=>{
            let selectservicehtml;
            for(let propiedad in servicesOptions){
                selectservicehtml+=`<option value="${propiedad}">${servicesOptions[propiedad]}</option>`
            }
            await Swal.fire({
                title: 'Crendo la cita de manera manual',
                showCancelButton: true,
                html: `
                <h1>Datos de la cita</h1>
                <p>Servicio</p>
                <select name="select" id="service" class="swal2-select" style="margin:0px">
                    <option value="0">Selecciona el servicio</option>
                    ${selectservicehtml}
                </select>
                <p>Fecha</p>
                <input type="date" id="date" class="swal2-input" placeholder="Password">
                <p>Hora</p>
                <select name="select" id="time" class="swal2-select">
                    <option value="0">Selecciona la hora</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                </select>
                `,
                confirmButtonText: 'Crear',
                focusConfirm: false,
                preConfirm: () => {
                  const service = Swal.getPopup().querySelector('#service').value
                  const date = Swal.getPopup().querySelector('#date').value
                  const time = Swal.getPopup().querySelector('#time').value
                  if (service === '0' || !date || time === '0') {
                    Swal.showValidationMessage(`Es necesario llenar todos los campos`)
                  }
                  let currentDate = new Date();
                  let userDate=new Date(date+'T00:00:00');
                  if(userDate<currentDate || userDate.getDay() === 0){
                    Swal.showValidationMessage(`La fecha no es valida`)
                  }
                  return { service: service, date: date, time: time }
                }
              }).then(async(result) => {
                if(result.isConfirmed){
                    let fechayhorafixed = result.value.date.replaceAll('-','/');
                    fechayhorafixed+=', '+result.value.time+":00";
                    try {
                        const response = await fetch(`${url}/appoiments/`,{
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "fechayhora": fechayhorafixed,
                                "user_id":id,
                                "service_id":parseInt(result.value.service)
                            })
                        })
                        const json = await response.json();
                        if(json.message===true){
                            let date = new Date(json.fechayhora);
                            Swal.fire(
                                '¡Creada!',
                                'La cita fue creada con la fecha y hora: '+date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
                                'success'
                            ).then(refetch);
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
              //console.log(service)
        }
        automaticButton = (
            <button
                className="btn-orange"
                title="Automatic"
                onClick={crearCitaAutomaticaFunction}
            >
                Creamos tu cita
            </button>
        )
        manualButton = (
            <button
                className="btn-orange"
                title="Manual"
                onClick={crearCitaManualFunction}
            >
                 Selecciona la fecha
            </button>
        )
    }
    workInfoData = [
        {
        image: automatic,
        title: "En los proximos 3 dias",
        text: "Te generamos una cita automaticamente.",
        button: automaticButton
        },
        {
        image: Calendar,
        title: "Por fecha",
        text: "Registra tu cita para la fecha que quieras.",
        button: manualButton
        },
    ];
    const cancelarFunction = async(appid)=>{
        Swal.fire({
            title: '¿Estas seguro?',
            text: "¡No podras modificar la cita despues de esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Regresar',
            confirmButtonText: 'Cancelar cita'
          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${url}/appoiments/unique`,{
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "appoiment_id": appid
                        })
                    })
                    const json = await response.json();
                    if(json.message === "Appoiment deleted"){
                        Swal.fire(
                            '¡Cancelada!',
                            'La cita fue cancelada.',
                            'success'
                        ).then(refetch())
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
    const modificarFunction = async(appid)=>{
        Swal.fire({
            title: '¿Estas seguro?',
            text: "¡Solo podras modificar la fecha y hora!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Regresar',
            confirmButtonText: 'Modificar cita'
          }).then(async (result) => {
            if (result.isConfirmed) {
                await Swal.fire({
                    title: 'Actualizando la cita de manera manual',
                    showCancelButton: true,
                    html: `
                    <h1>Datos de la cita</h1>
                    <p>Fecha</p>
                    <input type="date" id="date" class="swal2-input" placeholder="Password">
                    <p>Hora</p>
                    <select name="select" id="time" class="swal2-select">
                        <option value="0">Selecciona la hora</option>
                        <option value="08:00">08:00</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                        <option value="18:00">18:00</option>
                        <option value="19:00">19:00</option>
                    </select>
                    `,
                    confirmButtonText: 'Modificar',
                    focusConfirm: false,
                    preConfirm: () => {
                      const date = Swal.getPopup().querySelector('#date').value
                      const time = Swal.getPopup().querySelector('#time').value
                      if (!date || time === '0') {
                        Swal.showValidationMessage(`Es necesario llenar todos los campos`)
                      }
                      let currentDate = new Date();
                      let userDate=new Date(date+'T00:00:00');
                      if(userDate<currentDate || userDate.getDay() === 0){
                        Swal.showValidationMessage(`La fecha no es valida`)
                      }
                      return {date: date, time: time }
                    }
                  }).then(async(result) => {
                    if(result.isConfirmed){
                        let fechayhorafixed = result.value.date.replaceAll('-','/');
                        fechayhorafixed+=', '+result.value.time+":00";
                        try {
                            const response = await fetch(`${url}/appoiments/unique`,{
                                method: 'PATCH',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    "appoiment_id": appid,
                                    "fechayhora":fechayhorafixed
                                })
                            })
                            const json = await response.json();
                            if(json.message === true){
                                Swal.fire(
                                    'Modificada!',
                                    'La cita fue modificada.',
                                    'success'
                                ).then(refetch())
                            }else{
                                if(json.message === 'Not allowed to change the appoiment'){
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'No puedes modificar citas tan cercanas'
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
                /*
                */
            }
          })
    }
    if(isSuccess){
        const userappoiments = appoiments.filter((item)=> item.user_id === id)
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
                                <th> Servicio </th>
                                <th> Fecha </th>
                                <th colSpan={2}> Opciones </th>
                            </tr>
                        </thead>
                        <tbody>
                            {userappoiments.map((data) => (
                                <tr key={data.appoiment_id}>
                                    <td>
                                        <p className={data.estado === "incumplida" ? "status pending" : data.estado === "cancelada" ? "status cancelled":"status delivered"}>{data.estado === "incumplida" ? "Incumplida" : data.estado === "cancelada" ? "Cancelada":"Cumplida"}</p>
                                    </td> 
                                   <td>{data.servicename}</td>
                                   <td>{data.fechayhora}</td>
                                   <td className='columnabotones'> 
                                        <button
                                            className={data.estado === "incumplida" ? "buttonCancelar" : "buttonCancelarD"}
                                            title="Cancelar"
                                            onClick={()=>{cancelarFunction(data.appoiment_id)}}
                                        >
                                            Cancelar
                                        </button>
                                    </td>
                                    <td  className='columnabotones'>
                                        <button
                                            className={data.estado === "incumplida" ? "buttonModificar" : "buttonModificarD"}
                                            title="Modificar"
                                            onClick={()=>{modificarFunction(data.appoiment_id)}}
                                        >
                                            Cambiar fecha
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
    }else{
        return(
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
        )
    }
  
}

export default AppoimentsList