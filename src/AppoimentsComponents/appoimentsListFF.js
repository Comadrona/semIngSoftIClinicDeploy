import React from 'react'
import { useGetAppoimentsFFQuery } from './appoimentsFFApiSlice';
function AppoimentsListFF() {
    const {
        data: appoiments,
        isSuccess
    } = useGetAppoimentsFFQuery('appoimentsList', {
        refetchOnFocus: false,
        refetchOnMountOrArgChange: false
    })
    if(isSuccess){
        let userappoiments=[]
        for(let i=0;i<appoiments.length;i++){
                let user={
                    "appoiment_id": appoiments[i].appoiment_id,
                    "service_id": appoiments[i].service_id,
                    "fechayhora": appoiments[i].fechayhora,
                    "estado": appoiments[i].estado,
                    "user_id": appoiments[i].user_id,
                    "username": appoiments[i].username,
                    "duracion": appoiments[i].duracion,
                    "servicename": appoiments[i].servicename,
                    "observaciones": appoiments[i].observaciones,
                    "montototal": appoiments[i].montototal,
                }
                let aux = user.fechayhora
                user.fechayhora = aux.split(' ')[0]
                aux = aux.split(' ')[1]
                let hora = parseInt(aux.split(':')[0])-1
                hora = hora.toLocaleString('en-US',{ minimumIntegerDigits: 2,useGrouping: false})
                user.fechayhora += '  ' + hora+':00:00'
                userappoiments.push(user)
        }
        return (
            <>
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
                                <th> Observaciones </th>
                                <th> Monto total </th>
                                <th> Usuario </th>
                            </tr>
                        </thead>
                        <tbody>
                            {appoiments.map((data) => (
                                <tr key={data.appoiment_id}>
                                    <td>
                                        <p className={data.estado === "incumplida" ? "status pending" : data.estado === "cancelada" ? "status cancelled":"status delivered"}>{data.estado === "incumplida" ? "Incumplida" : data.estado === "cancelada" ? "Cancelada":"Cumplida"}</p>
                                    </td> 
                                   <td>{data.servicename}</td>
                                   <td>{data.fechayhora}</td>
                                   <td>{data.observaciones}</td>
                                   <td>{data.montototal}</td>
                                   <td>{data.username}</td>
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

export default AppoimentsListFF