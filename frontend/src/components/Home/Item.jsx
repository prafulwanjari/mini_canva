import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'

function Item({ design,type,delete_design}) {



  return (
    <div className={`relative group w-full h-[170 px]  ${type ? "h-[100px]":"h-[170px] px-2"}`} >
      <Link to={`/design/${design._id}/edit`}  className={`w-full h-full block bg-[#ffffff12] rounded-md ${type ? '' :'p-4'}`}>
        <img src={design.
          image_url} alt="" className=' w-full h-full rounded-md overflow-hidden px-1 ' />
      </Link>
      <div onClick={()=>delete_design(design._id)} className='absolute hidden cursor-pointer top-1 right-3 text-red-500 transition-all duration-500 group-hover:block'><FaTrash /></div>
    </div>
  )
}

export default Item