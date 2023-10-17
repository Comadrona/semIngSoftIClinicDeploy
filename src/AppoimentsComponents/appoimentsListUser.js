import React from 'react'
import { useGetServicesQuery } from '../ServicesComponents/servicesApiSlice';
import { useGetAppoimentsQuery } from './appoimentsApiSlice';
import { url } from '../global/url';
import Swal from 'sweetalert2';
import Calendar from "../Assets/calendar3.png";
import ClinicProfile from "../Assets/clinic-profile.png";
function AppoimentsListUser({id}) {
    let workInfoData;
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
        const adminClinicProfileFunction = async()=>{
            try {
            const response = await fetch(`${url}/users/clinicProfile/`,{
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
            if(json.message === true){
                Swal.fire({
                    title: 'Parece que el usuario tiene un perfil clinico',
                    text: "¿Desea realizar alguna modificacion?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Regresar',
                    confirmButtonText: 'Modificar perfil clinico'
                  }).then(async (result) => {
                    if(result.isConfirmed){
                        await Swal.fire({
                            title: 'Modificando el perfil clinico de manera manual',
                            showCancelButton: true,
                            html: `
                            <h1>Datos del perfil</h1>
                            <p>CURP *</p>
                            <input type="text" id="curp" class="swal2-input" placeholder="CURP" value="${json.curp}">
                            <p>Fecha de nacimiento *</p>
                            <input type="date" id="date" class="swal2-input" placeholder="Fecha de nacimiento">
                            <p>Peso *</p>
                            <input type="text" id="peso" class="swal2-input" placeholder="Peso" value="${json.peso}">
                            <p>Estatura *</p>
                            <input type="text" id="estatura" class="swal2-input" placeholder="Estatura" value="${json.estatura}">
                            <p>Tipo de sangre *</p>
                            <input type="text" id="tiposangre" class="swal2-input" placeholder="Tipo de sangre" value="${json.tiposangre}">
                            <p>NSS *</p>
                            <input type="text" id="nss" class="swal2-input" placeholder="NSS" value="${json.nss}">
                            <p>Enfermedades</p>
                            <textarea name="textarea" rows="10" cols="50" id="enfermedades" class="swal2-textarea" style="margin:0px;width:90%;" placeholder="Enfermedades">${json.enfermedades}</textarea>
                            <p>Preferencias de horario *</p>
                            <select name="select" id="preferencias" class="swal2-select">
                                <option value="0">Selecciona el horario</option>
                                <option value="08-12" ${json.preferenciashorario === '08-12' ? 'selected' : ''}>08:00 - 12:00</option>
                                <option value="12-16" ${json.preferenciashorario === '12-16' ? 'selected' : ''}>12:00 - 16:00</option>
                                <option value="16-20" ${json.preferenciashorario === '16-20' ? 'selected' : ''}>16:00 - 20:00</option>
                            </select>
                            `,
                            confirmButtonText: 'Modicar perfil',
                            focusConfirm: false,
                            preConfirm: () => {
                              const curp = Swal.getPopup().querySelector('#curp').value
                              const date = Swal.getPopup().querySelector('#date').value
                              const peso = Swal.getPopup().querySelector('#peso').value
                              const estatura = Swal.getPopup().querySelector('#estatura').value
                              const tiposangre = Swal.getPopup().querySelector('#tiposangre').value
                              const nss = Swal.getPopup().querySelector('#nss').value
                              const enfermedades = Swal.getPopup().querySelector('#enfermedades').value
                              const horario = Swal.getPopup().querySelector('#preferencias').value
                              if (horario === '0' || !curp || !date || !peso || !estatura || !tiposangre || !nss) {
                                Swal.showValidationMessage(`Es necesario llenar los campos marcados con un asterisco`)
                              }
                              let currentDate = new Date();
                              let userDate=new Date(date+'T00:00:00');
                              if(userDate>currentDate){
                                Swal.showValidationMessage(`La fecha no es valida`)
                              }
                              if(isNaN(peso)){
                                Swal.showValidationMessage(`El peso debe ser un dato numerico`)
                              }
                              if(isNaN(estatura)){
                                Swal.showValidationMessage(`La estatura debe ser un dato numerico`)
                              }
                              return {
                                curp : curp,
                                date : date,
                                peso : parseFloat(peso),
                                estatura : parseFloat(estatura),
                                tiposangre : tiposangre,
                                nss : nss,
                                enfermedades : enfermedades === '' ? 'N/A' : enfermedades,
                                horario : horario
                              }
                            }
                          }).then(async(result) => {
                            if(result.isConfirmed){
                                let fechafixed = result.value.date.replaceAll('-','/');
                                try {
                                    const response = await fetch(`${url}/clinicalprofile/unique`,{
                                        method: 'PATCH',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            "clinicalprofile_id":json.clinicalprofile_id,
                                            "curp": result.value.curp,
                                            "fechanacimiento":fechafixed,
                                            "peso":result.value.peso,
                                            "estatura":result.value.estatura,
                                            "tiposangre":result.value.tiposangre,
                                            "enfermedades":result.value.enfermedades,
                                            "nss":result.value.nss,
                                            "preferenciahorario":result.value.horario
                                        })
                                    })
                                    const json2 = await response.json();
                                    if(json2.message===true){
                                        Swal.fire(
                                            '¡Creado!',
                                            'El perfil clinico ha sido modificado',
                                            'success'
                                        ).then(refetch);
                                    }else{
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Oops...',
                                            text: 'Algo salio mal!',
                                            footer:json2.message
                                        })
                                    }
                                    } catch (err) {
                                    return err.json;
                                    }
                            }
                          })   
                    }
                  })
            }else{
                Swal.fire({
                    title: 'Parece que no tiene un perfil clinico',
                    text: "¡Es necesario para que el cliente pueda agregar citas de servicios especificos y para usar la creacion de citas automaticas!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Regresar',
                    confirmButtonText: 'Crear perfil clinico'
                  }).then(async (result) => {
                    if(result.isConfirmed){
                        await Swal.fire({
                            title: 'Crendo el perfil clinico de manera manual',
                            showCancelButton: true,
                            html: `
                            <h1>Datos del perfil</h1>
                            <p>CURP *</p>
                            <input type="text" id="curp" class="swal2-input" placeholder="CURP">
                            <p>Fecha de nacimiento *</p>
                            <input type="date" id="date" class="swal2-input" placeholder="Password">
                            <p>Peso *</p>
                            <input type="text" id="peso" class="swal2-input" placeholder="Peso">
                            <p>Estatura *</p>
                            <input type="text" id="estatura" class="swal2-input" placeholder="Estatura">
                            <p>Tipo de sangre *</p>
                            <input type="text" id="tiposangre" class="swal2-input" placeholder="Tipo de sangre">
                            <p>NSS *</p>
                            <input type="text" id="nss" class="swal2-input" placeholder="NSS">
                            <p>Enfermedades</p>
                            <textarea name="textarea" rows="10" cols="50" id="enfermedades" class="swal2-textarea" style="margin:0px;width:90%;" placeholder="Enfermedades"></textarea>
                            <p>Preferencias de horario *</p>
                            <select name="select" id="preferencias" class="swal2-select">
                                <option value="0">Selecciona el horario</option>
                                <option value="08-12">08:00 - 12:00</option>
                                <option value="12-16">12:00 - 16:00</option>
                                <option value="16-20">16:00 - 20:00</option>
                            </select>
                            `,
                            confirmButtonText: 'Crear perfil',
                            focusConfirm: false,
                            preConfirm: () => {
                              const curp = Swal.getPopup().querySelector('#curp').value
                              const date = Swal.getPopup().querySelector('#date').value
                              const peso = Swal.getPopup().querySelector('#peso').value
                              const estatura = Swal.getPopup().querySelector('#estatura').value
                              const tiposangre = Swal.getPopup().querySelector('#tiposangre').value
                              const nss = Swal.getPopup().querySelector('#nss').value
                              const enfermedades = Swal.getPopup().querySelector('#enfermedades').value
                              const horario = Swal.getPopup().querySelector('#preferencias').value
                              if (horario === '0' || !curp || !date || !peso || !estatura || !tiposangre || !nss) {
                                Swal.showValidationMessage(`Es necesario llenar los campos marcados con un asterisco`)
                              }
                              let currentDate = new Date();
                              let userDate=new Date(date+'T00:00:00');
                              if(userDate>currentDate){
                                Swal.showValidationMessage(`La fecha no es valida`)
                              }
                              if(isNaN(peso)){
                                Swal.showValidationMessage(`El peso debe ser un dato numerico`)
                              }
                              if(isNaN(estatura)){
                                Swal.showValidationMessage(`La estatura debe ser un dato numerico`)
                              }
                              return {
                                curp : curp,
                                date : date,
                                peso : parseFloat(peso),
                                estatura : parseFloat(estatura),
                                tiposangre : tiposangre,
                                nss : nss,
                                enfermedades : enfermedades === '' ? 'N/A' : enfermedades,
                                horario : horario
                              }
                            }
                          }).then(async(result) => {
                            if(result.isConfirmed){
                                let fechafixed = result.value.date.replaceAll('-','/');
                                try {
                                    const response = await fetch(`${url}/clinicalprofile/`,{
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            "user_id":id,
                                            "curp": result.value.curp,
                                            "fechanacimiento":fechafixed,
                                            "peso":result.value.peso,
                                            "estatura":result.value.estatura,
                                            "tiposangre":result.value.tiposangre,
                                            "enfermedades":result.value.enfermedades,
                                            "nss":result.value.nss,
                                            "preferenciahorario":result.value.horario
                                        })
                                    })
                                    const json = await response.json();
                                    if(json.message===true){
                                        Swal.fire(
                                            '¡Creado!',
                                            'El perfil clinico ha sido creado',
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
                  })
            }
            } catch (err) {
            return err.json;
            }
        }
        const manualButton = (
            <button
                className="btn-orange"
                title="Manual"
                onClick={crearCitaManualFunction}
            >
                 Selecciona la fecha
            </button>
        )
        const clinicproButton = (
            <button
                className="btn-orange"
                title="Perfil clinico"
                onClick={adminClinicProfileFunction}
            >
                Perfil clinico
            </button>
        )
        workInfoData = [
            {
                image: ClinicProfile,
                title: "Perfil clinico",
                text: "Administrar perfil clinico de cliente.",
                button: clinicproButton
            },
            {
            image: Calendar,
            title: "Por fecha",
            text: "Registra una cita para la fecha que quiera.",
            button: manualButton
            }
        ];
    }
    
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
                        if(json.message === 'Not allowed to change the appoiment'){
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'No puedes cancelar citas tan cercanas'
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
    const completarFunction = async(appid)=>{
        Swal.fire({
            title: '¿Estas seguro?',
            text: "¡No podras modificar la cita despues de esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Regresar',
            confirmButtonText: 'Completar cita'
          }).then(async (result) => {
            if (result.isConfirmed) {
                await Swal.fire({
                    title: 'Completando la cita',
                    showCancelButton: true,
                    html: `
                    <h1>Datos de la consulta realizada</h1>
                    <p>Observaciones</p>
                    <textarea name="textarea" rows="10" cols="50" id="observaciones" class="swal2-textarea" style="margin:0px;width:90%;" placeholder= "Observaciones de la consulta"></textarea>
                    <p>Monto cobrado</p>
                    <input type="text" id="monto" class="swal2-input" placeholder="Monto cobrado">
                    `,
                    confirmButtonText: 'Completar',
                    focusConfirm: false,
                    preConfirm: () => {
                      const observaciones = Swal.getPopup().querySelector('#observaciones').value
                      const monto = Swal.getPopup().querySelector('#monto').value
                      if (!monto) {
                        Swal.showValidationMessage(`Es necesario agregar el monto cobrado`)
                      }
                      if(isNaN(monto)){
                        Swal.showValidationMessage(`El monto debera ser un numero`)
                      }
                      return {observaciones: observaciones, monto: parseFloat(monto) }
                    }
                  }).then(async(result) => {
                    if(result.isConfirmed){
                        console.log()
                        try {
                            const response = await fetch(`${url}/appoiments/fullfiled`,{
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    "appoiment_id": appid,
                                    observaciones: "N/A",
                                    montototal:result.value.monto
                                })
                            })
                            const json = await response.json();
                            if(json.message === true){
                                Swal.fire(
                                    '¡Completada!',
                                    'La cita fue completada.',
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
                                <th colSpan={3}> Opciones </th>
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
                                    <td  className='columnabotones'>
                                        <button
                                            className={data.estado === "incumplida" ? "buttonModificar" : "buttonModificarD"}
                                            title="Completar"
                                            onClick={()=>{completarFunction(data.appoiment_id)}}
                                        >
                                            Completar
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

export default AppoimentsListUser