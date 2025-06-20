import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useDownloader from 'react-use-downloader';
import * as  htmlToImage from 'html-to-image'
import api from '../utills/api'
import  { toast }from 'react-hot-toast'


export default function Header({ components, design_id }) {
  const navigate=useNavigate()
  const [loader,setLoader]=useState('')

  const { download } = useDownloader()

  const saveImage = async () => {
    const getDiv = document.getElementById('main_design')
    const image = await htmlToImage.toBlob(getDiv)

    if (image) {

      const obj = {
        design: components
      }
      // console.log(obj)

      const formData = new FormData()
      formData.append('design', JSON.stringify(obj))
      formData.append('image', image)
      try {
            setLoader(true)
        const { data } = await api.put(`/api/update-user-design/${design_id}`, formData)
        toast.success(data.message)
        console.log(data);
        setLoader(false)

      } catch (error) {
        setLoader(false)
        toast.error(error.response.data.message)
        // if (error.response && error.response.data) {
        //   console.log("API Error:", error.response.data);
        // } else {
        //   console.error("Unexpected Error:", error.message || error);
        // }
      }
    }


  }

  const downloadImage = async () => {
    const getDiv = document.getElementById('main_design')
    const dataUrl = await htmlToImage.toPng(getDiv, {
      style: {
        transform: 'scale(1)'
      }
    })


    // -download by using  react-use-downloader library-------------
    download(dataUrl, 'image.png')


    // --------------download design using javascript-----------------

    // async function download() {
    //   const a = document.createElement("a");
    //   a.href =  dataUrl
    //   a.download = "Image.png";
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    // }

    // download()




  }

 


  return (
    <div className='h-[60px] bg-gradient-to-r from-[#212122] via-[#27282b] to-[#2a2b2c] w-full'>
      <div className='flex justify-between px-10 items-center text-gray-300 h-full '>
        <Link to='/'>
          <img src="https://static.canva.com/web/images/8439b51bb7a19f6e65ce1064bc37c197.svg" alt="" />

        </Link>
        <span className='text-xl'>Mini Canva</span>
        <div className='flex justify-center items-center gap-2 text-gray-300'>
          <button className='px-3 py-[6px] outline-none bg-[#252627] rounded ' onClick={saveImage}>Save</button>
          <button className='px-3 py-[6px] outline-none bg-[#252627] rounded ' onClick={downloadImage}>Download</button>
        </div>
      </div>
    </div>
  )
}
