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