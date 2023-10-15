import React from 'react'
import './servicesList.css'
import { useGetServicesQuery } from './servicesApiSlice';
function ServicesList() {
  const {
      data: services,
      isSuccess,
      isError
  } = useGetServicesQuery('servicesList', {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
  })
   if (isSuccess) {

            return (
              <div className="work-section-wrapper">
                <div className="work-section-top">
                  <h1 className="primary-heading">Belleza</h1>
                  <p className="primary-text">
                  Realza tu belleza con faciales, masajes y tratamientos especializados excepcionales.
                  </p>
                </div>
                <div className="work-section-bottom">
                  {services.map((data) => (
                    <div className="work-section-info precio" key={data.service_id}>
                      <h2>{data.nombre}</h2>
                      <p>{data.descripcion}</p>
                      <p className='precio'>Precio : ${data.preciosugerido}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
    }
    if(isError){
      return(
        <p>
          No hay servicios por mostrar
        </p>
      )
    }
  
}

export default ServicesList