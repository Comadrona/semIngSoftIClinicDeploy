import React, { useEffect } from 'react'
import '../../AppoimentsComponents/appoimentsList.css'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../publiccomponents/Navbar';
import Footer from '../../publiccomponents/Footer';
import { url } from '../../global/url';
import AppoimentsListUser from '../../AppoimentsComponents/appoimentsListUser';
function AdminPageAppoiments() {
    let navigate = useNavigate();
    let {id} = useParams();
    useEffect(() => {
        if(isNaN(id)){
            navigate('/')
        }else{
            verificarId()
        }
      },[]);
    const verificarId = async()=>{
        try {
        const response = await fetch(`${url}/users/unique`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": parseInt(id)
            })
        })
        const json = await response.json();
        if(json.message !== true){
            navigate('/')
        }
        }catch(err){
            console.log(err);
        }
    }
    return(
        <>
        <Navbar/>
        <AppoimentsListUser id={parseInt(id)}/>
        <Footer/>
        </>
    )
}

export default AdminPageAppoiments