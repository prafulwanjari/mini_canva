import React, { useEffect, useState } from 'react'
import Image from './Image'
import api from '../utills/api'
import BarLoade from 'react-spinners/BarLoader'
import toast  from 'react-hot-toast'


export default function MyImages({add_image}) {
  const [loader,setLoader]=useState(false)
  const [images,setImages]=useState([])

const image_upload=async(e)=>{

  
  if(e.target.files.length>0){
    const formData=new FormData()
    formData.append('image',e.target.files[0])

    try {
      setLoader(true)
      const {data}=await api.post('/api/add-user-image',formData)
     setImages([...images, data.userImage])
      setLoader(false)

    } catch (error) {
    setLoader(false)
    toast.error(error.response.data.message)
      
    }

  }

}


useEffect(()=>{

  const get_Images=async()=>{
    try {
      const {data}=await api.get('/api/get-user-image')
      console.log(data)
      setImages(data.images)
      
    } catch (error) {
      console.log(error)
    }

  }

    get_Images();
},[])

  return (
    <>
    <div className='w-full h-[40px] flex justify-center items-center bg-purple-500 rouded-sm text-white mb-3'>
       <label htmlFor="image" className='text-center cursor-pointer'>Upload Image</label>
       <input readOnly={loader} onChange={image_upload} type="file" name="" id="image" className='hidden'  />
    </div>
    {
      loader &&  <div className='flex justify-center items-center py-2 mb-2'>
      <BarLoade color='#fff'/>
    </div>
    }
   
    <div className='h-[80vh] overflow-x-auto flex justify-start items-start scrollbar-hide'>
        <Image  images={images} add_image={add_image}/>
    </div>
    </>
  )
}
