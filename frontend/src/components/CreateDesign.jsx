// import React, { useEffect, useRef, useState } from 'react'

// import { useLocation } from 'react-router-dom'
// import CreateComponent from './CreateComponent'
// import api from '../utills/api'
// import * as htmlToImage from 'html-to-image'
// import { useNavigate } from 'react-router-dom'
// import RotateLoader from 'react-spinners/RotateLoader'


// export default function CreateDesign() {
//     const { state } = useLocation()
//     const ref = useRef()
//     // console.log(state)

    


//     const obj = {
//         name: "main_frame",
//         type: "react",
//         id: Date.now(),
//         width:state.width,
//         height:state.height,
//         z_index: 1,
//         color: "#fff",
//         image: ""
//     }

//     const [loader,setLoader]=useState(false)

//     const navigate=useNavigate()

//     const create_design=async()=>{
//         const image=await htmlToImage.toBlob(ref.current)
//        // console.log(dataUrl)
//        const design=JSON.stringify(obj)

//        if(image){
//         const formData=new FormData()
//         formData.append('design',design)
//         formData.append('image',image)
//         try {
//             setLoader(true)
//             const {data}=await api.post('/api/create-user-design',formData)
//             navigate(`/design/${data.designId}/edit`)
            
//         } catch (error) {
//             console.log(error.response.data)
//         }
//        }

//     }

//     useEffect(()=>{
//         if(state && ref.current){
//             create_design()
//         }else{
//             navigate('/')
//         }

//     },[state,ref.current])

//     return (
//         <div className='w-screen h-screen flex justify-center items-center relative '>
//             <div ref={ref} className='relative w-auto h-auto overflow-auto ' >
//                 <CreateComponent current_component={{}} info={obj} />
//             </div>
//             {
//                 loader && <div className='left-0 top-0 w-full h-full flex justify-center items-center bg-black absolute'><RotateLoader color='white'/></div>
//             }

//         </div>
//     )
// }










import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CreateComponent from './CreateComponent'
import api from '../utills/api'
import * as htmlToImage from 'html-to-image'
import RotateLoader from 'react-spinners/RotateLoader'

export default function CreateDesign() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const ref = useRef()
    const createdRef = useRef(false) // ✅ guard to prevent multiple API calls
    const [loader, setLoader] = useState(false)

    const obj = {
        name: "main_frame",
        type: "react",
        id: Date.now(),
        width: state?.width || 400,
        height: state?.height || 500,
        z_index: 1,
        color: "#fff",
        image: ""
    }

    const create_design = async () => {
        if (!ref.current || createdRef.current) return
        createdRef.current = true // ✅ ensure this runs only once

        try {
            setLoader(true)
            const image = await htmlToImage.toBlob(ref.current)
            if (!image) throw new Error("Failed to generate image")

            const design = JSON.stringify(obj)
            const formData = new FormData()
            formData.append('design', design)
            formData.append('image', image)

            const { data } = await api.post('/api/create-user-design', formData)
            navigate(`/design/${data.designId}/edit`)
        } catch (error) {
            console.error(error)
            setLoader(false)
        }
    }

    useEffect(() => {
        if (!state) {
            navigate('/')
            return
        }

        const timer = setTimeout(() => {
            if (ref.current) create_design()
        }, 100)

        return () => clearTimeout(timer)
    }, [state])

    return (
        <div className='w-screen h-screen flex justify-center items-center relative '>
            <div ref={ref} className='relative w-auto h-auto overflow-auto'>
                <CreateComponent current_component={{}} info={obj} />
            </div>
            {loader && (
                <div className='left-0 top-0 w-full h-full flex justify-center items-center bg-black absolute'>
                    <RotateLoader color='white' />
                </div>
            )}
        </div>
    )
}