import React from 'react'

export default function Image({add_image,images,type,setImage}) {
  return (
   
        <div className='grid grid-cols-2 gap-2  '>
           {
            images?.map((img,i)=>
            <div onClick={()=> type==='background'? setImage(img.image_url) : add_image(img.image_url)} key={i} className='w-full h-[100px] overflow-hidden rounded cursor-pointer '>
             <img className='w-full h-full' src={img.image_url} alt="" />
            </div>)
           }
        </div>

  )
}
