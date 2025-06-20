import React, { useState, useEffect } from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import Item from './Home/Item';
import api from '../utills/api';
import toast from 'react-hot-toast';
import CanvaMagic from 'canva-magical-mouse-effect'

export default function Home() {

    const navigate = useNavigate()

    const [designs, setDesigns] = useState([])
    const [loader,setLoader]=useState(false)
    const [show, setShow] = useState(false)
    const [state, setState] = useState({
        width: 0,
        height: 0,
    })

    const inputHandle = (e) => {

        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 992 },
            items: 3
        },
        mdtablet: {
            breakpoint: { max: 992, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 4
        }
    };

    const create = (e) => {
        e.preventDefault()

        navigate('/design/create', {
            state: {
                type: 'create',
                width: state.width,
                height: state.height
            }
        })
    }

      const delete_design=async(design_id)=>{
    
        try {
          setLoader(true)
          const {data}=await api.put(`/api/delete-user-image/${design_id}`)
           toast.success(data.message)
           get_user_design();
          setLoader(false)
    
        } catch (error) {
        setLoader(false)
        toast.error(error.response.data.message)
          
        }
    }

     const get_user_design = async () => {
            try {
                const { data } = await api.get('/api/user-designs')
                setDesigns(data.designs)


            } catch (error) {
                console.log(error)
            }

        }


    useEffect(() => {
           get_user_design();
    }, [])


    
    
    

    return (
        <div className='pt5'>
            <CanvaMagic>
                 <div className='w-full flex justify-center items-center h-[250px] bg-gradient-to-r from-[#4c76cf] to-[#552ab8] relative rounded-md overflow-hidden'>
                <button onClick={() => setShow(!show)} className='px-4 py-2 text-[15px] overflow-hidden text-center bg-[#8b3dffad] text-white rounded font-medium hover:bg-[#8b3dffd3] absolute top-3 right-3'>Custom Size</button>
                <form onSubmit={create} className={`absolute top-16 right-3 gap-3 bg-[#252627] w-[250px] p-4 text-white
               ${show ? 'visible opacity-100' : 'invisible opacity-30 '} transition-all duration-500`}>
                    <div className='grid grid-cols-2 gap-3'>
                        <div className='flex gap-2 justify-center items-start flex-col'>
                            <label htmlFor="width">Width</label>
                            <input type="number" name='width' id='width' className='w-full outline-none px-2 py-1 bg-[#1b1a1a] border border-[#404040] rounded-md ' onChange={inputHandle}
                                value={state.width} required />

                        </div>
                        <div className='flex gap-2 justify-center items-start flex-col'>
                            <label htmlFor="height">Height</label>
                            <input type="number" name='height' id='height' className='w-full outline-none px-2 py-1 bg-[#1b1a1a] border border-[#404040] rounded-md ' onChange={inputHandle}
                                value={state.height} required />

                        </div>

                    </div>
                    <button className='px-4 py-2 text-[13px] overflow-hidden text-center bg-[#8b3dffad] text-white rounded font-medium hover:bg-[#8b3dffd3] w-full mt-4'>Create New Design</button>

                </form>
                <div>
                    <h2 className='text-3xl pb-10 pt-6 font-semibold text-white'>What will you design today?</h2>
                </div>

            </div>
            </CanvaMagic>
           
            <div>
                <h2 className='text-xl py-6 font-semibold text-white'>Your recent designs</h2>
                <div>
                    <Carousel autoPlay={true} infinite={true} responsive={responsive} transitionDuration={500}>
                        {
                            designs.map((design, i) => (
                                <Item design={design} key={i} el={design} delete_design={delete_design} />
                            ))
                        }
                    </Carousel>
                </div>
            </div>
        </div>
    )
}
