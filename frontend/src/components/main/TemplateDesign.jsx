import React, { useEffect, useState } from 'react'
import api from '../../utills/api'
import { useNavigate } from 'react-router-dom'

export default function TemplateDesign({type}) {
    const navigate=useNavigate()

    const [templates, setTemplates] = useState([])

    useEffect(() => {

        const get_templates = async () => {
            try {
                const { data } = await api.get('/api/templates')
                console.log(data)
                setTemplates(data.templates)

            } catch (error) {
                console.log(error)
            }

        }

        get_templates();
    }, [])
  

    const add_template=async(id)=>{


         try {
                const { data } = await api.get(`/api/add-user-template/${id}`)
                console.log(data)
                navigate(`/design/${data.design?._id}/edit`)

            } catch (error) {
                console.log(error)
            }


    }



    return (
        <>
            <div className={`grid gap-2 ${type ? "grid-cols-2":"grid-cols-4 mt-3"} `}>
                {
                    templates.map((design, i) =>
                        <div key={i} onClick={()=>add_template(design._id)} className={`relative cursor-pointer group w-full   ${type ? "h-[100px]" : "h-[170px] px-2"}`} >
                            <div  className={`w-full h-full block bg-[#ffffff12] rounded-md ${type ? '' : 'p-4'}`}>
                                <img src={design.
                                    image_url} alt="" className=' w-full h-full rounded-md overflow-hidden px-1 ' />
                            </div>
                           
                        </div>)
                }
            </div>
        </>
    )
}
