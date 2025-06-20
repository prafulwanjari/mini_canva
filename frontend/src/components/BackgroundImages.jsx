import React from 'react'
import Image from './Image'
import { useState } from 'react'
import { useEffect } from 'react'
import api from '../utills/api'

export default function BackgroundImages({setImage,type}) {
    const [images, setImages] = useState([])


    useEffect(() => {

        const get_Images = async () => {
            try {
                const { data } = await api.get('/api/background-images')
              //  console.log(data)
                setImages(data.images)

            } catch (error) {
                console.log(error)
            }

        }

        get_Images();
    }, [])

    return (
        <Image setImage={setImage} images={images} type={type} />

    )
}
