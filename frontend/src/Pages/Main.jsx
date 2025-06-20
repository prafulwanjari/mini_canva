
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { BsGrid1X2, BsFillImageFill } from 'react-icons/bs';
import { FaShapes } from 'react-icons/fa';
import { FiFolder } from 'react-icons/fi';
import { GoUpload } from 'react-icons/go';
import { TfiText } from 'react-icons/tfi';
import { RxTransparencyGrid } from 'react-icons/rx';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import TemplateDesign from '../components/main/TemplateDesign';
import MyImages from '../components/MyImages';
import Projects from '../components/Projects';
import Image from '../components/Image';
import CreateComponent from '../components/CreateComponent';
import api from '../utills/api';
import { useParams } from 'react-router-dom'
import InitialImage from '../components/InitialImage';
import BackgroundImages from '../components/BackgroundImages';


export default function Main() {

   const { design_id } = useParams()
   const [state, setState] = useState('');
   const [currentComponent, setCurrentComponent] = useState('')
   const [color, setColor] = useState('')
   const [image, setImage] = useState('')
   const [rotate, setRotate] = useState(0)
   const [left, setLeft] = useState('')
   const [top, setTop] = useState('')
   const [width, setWidth] = useState('')
   const [height, setHeight] = useState('')
   const [padding, setPadding] = useState('')
   const [font, setFont] = useState('')
   const [weight, setWeight] = useState('')
   const [opacity, setOpacity] = useState('')
   const [zIndex, setzIndex] = useState('')
   const [text, setText] = useState('')
   const [radius, setRadius] = useState('')


   const [show, setShow] = useState({
      status: true,
      name: '',
   });

   const setElement = (type, name) => {
      setState(type);
      setShow({
         status: false,
         name,
      });
   };




   const moveElement = (id, currentInfo) => {
      console.log(id)
      setCurrentComponent(currentInfo);
      let isMoving = true;
      const currentDiv = document.getElementById(id);

      const mouseMove = (e) => {
         if (!isMoving) return;
         const { movementX, movementY } = e;
         const getStyle = window.getComputedStyle(currentDiv);
         const left = parseInt(getStyle.left || 0);
         const top = parseInt(getStyle.top || 0);

         currentDiv.style.left = `${left + movementX}px`;
         currentDiv.style.top = `${top + movementY}px`;
      };

      const mouseUp = () => {
         isMoving = false;

         // Remove only after a slight delay to ensure the last move is handled
         window.removeEventListener('mousemove', mouseMove);
         window.removeEventListener('mouseup', mouseUp);

         // Update state with final position

         setLeft(parseInt(currentDiv.style.left));
         setTop(parseInt(currentDiv.style.top));
      };

      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
   };





   const resizeElement = (id, currentInfo) => {

      setCurrentComponent(currentInfo);

      const currentDiv = document.getElementById(id);
      if (!currentDiv) {
         console.warn(`Element with id "${id}" not found.`);
         return;
      }

      let isMoving = true;

      const mouseMove = (e) => {
         if (!isMoving) return;

         // Defensive: double check currentDiv still exists
         if (!currentDiv || !(currentDiv instanceof Element)) return;

         const { movementX, movementY } = e;
         const getStyle = window.getComputedStyle(currentDiv);
         const width = parseInt(getStyle.width || 0);
         const height = parseInt(getStyle.height || 0);

         currentDiv.style.width = `${width + movementX}px`;
         currentDiv.style.height = `${height + movementY}px`;
      };

      const mouseUp = () => {
         isMoving = false;
         window.removeEventListener('mousemove', mouseMove);
         window.removeEventListener('mouseup', mouseUp);

         setWidth(parseInt(currentDiv.style.width));
         setHeight(parseInt(currentDiv.style.height));
      };

      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
   };

   const rotateElement = (id, currentInfo) => {
      setCurrentComponent('')
      setCurrentComponent(currentInfo)

      const target = document.getElementById(id)
      const mouseMove = ({ movementX, movementY }) => {
         const getStyle = window.getComputedStyle(target)
         const trans = getStyle.transform
         const values = trans.split('(')[1].split(')')[0].split(',')
         const angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI))
         let deg = angle < 0 ? angle + 360 : angle
         setRotate(deg)
         if (movementX) {
            deg = deg + movementX
         }
         target.style.transform = `rotate(${deg}deg)`

      }

      const mouseUp = () => {
         window.removeEventListener('mousemove', mouseMove)
         window.removeEventListener('mouseup', mouseUp)
         const getStyle = window.getComputedStyle(target)
         const trans = getStyle.transform
         const values = trans.split('(')[1].split(')')[0].split(',')
         const angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI))
         let deg = angle < 0 ? angle + 360 : angle
         setRotate(deg)


      }
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
   }


   const removeComponent = (id) => {
      console.log('removeComponent')
      const temp = components.filter(c => c.id !== currentComponent.id)
      setCurrentComponent('')
      setComponents(temp)
   }
   const removeBackground = () => {
      const comp = components.find(c => c.id === currentComponent.id)
      const temp = components.filter(c => c.id !== currentComponent.id)
      comp.image = ''
      setImage("")
      setComponents([...temp, comp])


   }

   const createShape = (name, type) => {
      const style = {
         id:Date.now(),
         name: name,
         type,
         left: 10,
         top: 10,
         opacity: 1,
         width: 200,
         height: 200,
         rotate: 0,
         z_index: 2,
         color: '#3c3c3d',
         setCurrentComponent: (a) => setCurrentComponent(a),

         moveElement,
         resizeElement,
         rotateElement

      }
      setComponents([...components, style])

   }

   const [components, setComponents] = useState([
      {

         name: "main_frame",
         type: "rect",
         id: Math.floor((Math.random() * 100) + 1),
         height: 450,
         width: 650,
         z_index: 1,
         color: "#fff",
         image: "",
         setCurrentComponent: (a) => setCurrentComponent(a)

      }
   ])

   const add_text = (name, type) => {

      const style = {
         id: Date.now(),
         name: name,
         type,
         opacity: 1,
         width: 200,
         height: 200,
         rotate: 0,
         left: 10,
         top: 10,
         z_index: 10,
         padding: 6,
         font: 20,
         title: "Add text",
         weight: 400,
         color: 'black',
         setCurrentComponent: (a) => setCurrentComponent(a),

         moveElement,
         resizeElement,
         rotateElement
      }

      setWeight('')
      setFont('')
      setCurrentComponent(style)
      setComponents([...components, style])

   }

   const opacityHandle = (e) => {
      // const value = parseFloat(e.target.value);

      // setComponents(prevComponents =>
      //    prevComponents.map(comp =>
      //       comp.id === currentComponent.id ? { ...comp, opacity: value } : comp
      //    )
      // );

      // // Also update currentComponent if it's tracked separately
      // setCurrentComponent(prev => ({ ...prev, opacity: value }));

      setOpacity(e.target.value)
   };


   const add_image = (img) => {

      const style = {
         id: Date.now(),
         name: 'image',
         type: 'image',
         opacity: 1,
         width: 200,
         height: 200,
         rotate: 0,
         left: 10,
         top: 10,
         z_index: 10,
         image: img,
         radius: 0,

         setCurrentComponent: (a) => setCurrentComponent(a),

         moveElement,
         resizeElement,
         rotateElement
      }

      setCurrentComponent(style)
      setComponents([...components, style])
   }

   useEffect(() => {
      if (currentComponent) {

         const index = components.findIndex(c => c.id === currentComponent.id)
         const temp = components.filter(c => c.id !== currentComponent.id)


         if (currentComponent.name !== 'text') {
            components[index].width = width || currentComponent.width
            components[index].height = height || currentComponent.height
            components[index].rotate = rotate || currentComponent.rotate

         }


         if (currentComponent.name === 'text') {
            components[index].font = font || currentComponent.font
            components[index].weight = weight || currentComponent.weight
            components[index].padding = padding || currentComponent.padding
            components[index].title = text || currentComponent.title



         }

         if (currentComponent.name === 'image') {
            // console.log(image)
            components[index].radius = radius || currentComponent.radius
         }

         if (currentComponent.name === 'main_frame' && image) {
            // console.log(image)
            components[index].image = image || currentComponent.image
         }




         components[index].color = color || currentComponent.color

         if (currentComponent.name !== 'main_frame') {
            components[index].left = left || currentComponent.left
            components[index].top = top || currentComponent.top
            components[index].rotate = rotate || currentComponent.rotate
            components[index].opacity = opacity || currentComponent.opacity
            components[index].z_index = zIndex || currentComponent.z_index






         }
         setColor('')
         setComponents([...temp, components[index]])
         setWidth('')
         setHeight('')
         setTop('')
         setLeft('')
         setRotate(0)
         setOpacity('')
         setzIndex('')
         setPadding('')
         setWeight('')
         setFont('')
         setText('')
         setRadius('')

      }

   }, [color, image, left, top, width, height, rotate, opacity, zIndex, padding, weight, font, text, radius])

   useEffect(() => {
      const get_design = async () => {
         try {

            const { data } = await api.get(`/api/user-design/${design_id}`)
            const { design } = data
            for (let i = 0; i < design.length; i++) {
               design[i].setCurrentComponent = (a) => setCurrentComponent(a)
               design[i].moveElement = moveElement
               design[i].resizeElement = resizeElement
               design[i].rotateElement = rotateElement
               design[i].removeBackground = removeBackground
            }

            // setCurrentComponent: (a) => setCurrentComponent(a),

            //    moveElement,
            //    resizeElement,
            //    rotateElement


            // console.log(data)
            console.log(design)
            setComponents(design)

         } catch (error) {
            console.log(error)

         }
      }
      get_design()
   },[design_id])




   console.log(currentComponent)



   return (
      <div className='min-w-screen h-screen bg-black'>
         <Header components={components} design_id={design_id} />
         <div className='flex h-[calc(100%-60px)] w-screen'>

            {/* Left Toolbar */}
            <div className='w-[80px] bg-[#18191b] z-50 h-full text-gray-400 overflow-y-auto'>
               <div onClick={() => setElement('design', 'design')} className={` ${show.name === 'design' ? 'bg-[#252627]' : ''}w-full h-[80px] cursor-pointer flex justify-center flex-col items-center gap-1 hover:text-gray-100`}>
                  <span className='text-2xl'><BsGrid1X2 /></span>
                  <span className='text-xs font-medium'>Design</span>
               </div>
               <div onClick={() => setElement('shape', 'shape')} className={`${show.name === 'shape' ? 'bg-[#252627]' : ''} w-full h-[80px] cursor-pointer flex justify-center flex-col items-center gap-1 hover:text-gray-100`}>
                  <span className='text-2xl'><FaShapes /></span>
                  <span className='text-xs font-medium'>Shapes</span>
               </div>
               <div onClick={() => setElement('image', 'uploadImage')} className={`${show.name === 'image' ? 'bg-[#252627]' : ''} w-full h-[80px] cursor-pointer flex justify-center flex-col items-center gap-1 hover:text-gray-100`}>
                  <span className='text-2xl'><GoUpload /></span>
                  <span className='text-xs font-medium'>Upload</span>
               </div>
               <div onClick={() => setElement('text', 'text')} className={`${show.name === 'text' ? 'bg-[#252627]' : ''} w-full h-[80px] cursor-pointer flex justify-center flex-col items-center gap-1 hover:text-gray-100`}>
                  <span className='text-2xl'><TfiText /></span>
                  <span className='text-xs font-medium'>Text</span>
               </div>
               <div onClick={() => setElement('project', 'projects')} className={`${show.name === 'project' ? 'bg-[#252627]' : ''} w-full h-[80px] cursor-pointer flex justify-center flex-col items-center gap-1 hover:text-gray-100`}>
                  <span className='text-2xl'><FiFolder /></span>
                  <span className='text-xs font-medium'>Project</span>
               </div>
               <div onClick={() => setElement('initImage', 'images')} className={`${show.name === 'initImage' ? 'bg-[#252627]' : ''} w-full h-[80px] cursor-pointer flex justify-center flex-col items-center gap-1 hover:text-gray-100`}>
                  <span className='text-2xl'><BsFillImageFill /></span>
                  <span className='text-xs font-medium'>Images</span>
               </div>
               <div onClick={() => setElement('background', 'background')} className={`${show.name === 'background' ? 'bg-[#252627]' : ''} w-full h-[80px] cursor-pointer flex justify-center flex-col items-center gap-1 hover:text-gray-100`}>
                  <span className='text-2xl'><RxTransparencyGrid /></span>
                  <span className='text-xs font-medium'>Background</span>
               </div>
            </div>

            {/* Main Content */}
            <div className='h-full w-[calc(100%-75px)]'>

               {/* Side Panel */}
               <div
                  className={`bg-[#252627] h-full fixed transition-all duration-700 ease-in-out z-30 w-[350px] ${show.status ? '-left-[350px] px-0' : 'left-[75px] px-8 py-5'
                     }`}
               >
                  {/* Arrow to close */}
                  <div
                     onClick={() => setShow({ name: '', status: true })}
                     className='flex absolute justify-center items-center bg-[#252627] w-[20px] -right-2 text-slate-300 top-[40%] cursor-pointer h-[100px] rounded-full transition-transform duration-300'
                  >
                     <MdKeyboardArrowLeft />
                  </div>

                  {/* Panel Content */}
                  {
                     state === 'design' && <div>
                        <TemplateDesign type={'main'} />
                     </div>

                  }
                  {
                     state === 'shape' && <div className='grid grid-cols-3 gap-2'>

                        <div onClick={() => createShape('shape', 'rect')} className='h-[90px] bg-[#3c3c3d] cursor-pointer  '></div>
                        <div onClick={() => createShape('shape', 'circle')} className='h-[90px] bg-[#3c3c3d] cursor-pointer rounded-full '></div>
                        <div onClick={() => createShape('shape', 'triangle')} style={{ clipPath: 'polygon(50% 0% ,100% 100%, 0% 100%)' }} className='h-[90px] bg-[#3c3c3d] cursor-pointer '></div>
                     </div>

                  }
                  {
                     state === 'image' && <MyImages add_image={add_image} />


                  }
                  {
                     state === 'text' && <div>
                        <div className='grid grid-cols-1 gap-2'>
                           <div onClick={() => add_text('text', 'title')} className='bg-[#3c3c3d] cursor-pointer font-bold p-3 text-white tex-xl rounded'>
                              <h2>Add a Text</h2>
                           </div>
                        </div>
                     </div>

                  }
                  {
                     state === 'project' && <Projects type='main' design_id={design_id} />



                  }
                  {
                     state === 'initImage' && <div
                        className='h-[80vh] overflow-x-auto flex justify-start items-start scrollbar-hide'>
                     <InitialImage add_image={add_image}/>
                     </div>

                  }
                  {
                     state === 'background' && <div
                        className='h-[80vh] overflow-x-auto flex justify-start items-start scrollbar-hide'>
                        <BackgroundImages type='background' setImage={setImage}/>
                     </div>

                  }
               </div>

               <div className='w-full  h-full flex'>
                  <div className={`flex justify-center items-center h-full
                      ${!currentComponent ? 'w-full' : 'w-[calc(100%-250px)]'} overflow-hidden`}>
                     <div className='min-w-[650px] min-h-[480px] flex justify-center items-center overflow-hidden'>
                        <div id='main_design' className='w-auto relative h-auto overflow-hidden '>
                           {
                              components.map((c, i) => <CreateComponent key={i} info={c} current_component={currentComponent} removeComponent={removeComponent} />)
                           }
                        </div>
                     </div>
                  </div>

                  {
                     currentComponent && <div className='h-full w-[250px] text-gray-300 bg-[#252627] px-3 py-2  '>
                        <div className='flex gap-3 flex-col items-start h-full px-3 justify-start'>
                           <div className='flex gap-4 justify-start items-start'>
                              <span className=''>Color: </span>
                              <label className='w-[30px] h-[30px] rounded cursor-pointer' style={{ background: `${currentComponent.color && currentComponent.color !== '#fff' ? currentComponent.color : 'gray'}` }} htmlFor="color"></label>
                              <input type="color" name="" id="color" className='invisible' onChange={(e) => setColor(e.target.value)} />
                           </div>
                           {
                              (currentComponent.name === 'main_frame' && currentComponent.image) && <div>
                                 <button className='p-2 bg-slate-700 text-white rounded' onClick={removeBackground}>Remove Background</button>
                              </div>
                           }

                           {
                              currentComponent.name !== 'main_frame' &&
                              <div className='flex gap-6 flex-col '>
                                 <div className='flex gap-1 justify-start items-start '>
                                    <span className='text-md min-w-[70px]'>Opacity : </span>
                                    <input onChange={opacityHandle} type="number" step={0.1} min={0.1} max={1} name="" id="" value={currentComponent.opacity} className='border border-gray-700 outline-none rounded-md  bg-transparent w-full' />

                                 </div>
                                 <div className='flex gap-1 justify-start items-start '>
                                    <span className='text-md  min-w-[70px]'>Z-index : </span>
                                    <input onChange={(e) => setzIndex(parseInt(e.target.value))} type="range" step={1} id="" max={100000} value={currentComponent.z_index} className='border border-gray-700 outline-none rounded-md  bg-transparent w-full' />
                                 </div>

                                 {
                                    currentComponent.name === 'text' &&
                                    <>
                                       <div className='flex gap-1 justify-start items-start '>
                                          <span className='text-md min-w-[70px]'>Padding : </span>
                                          <input onChange={(e) => setPadding(parseInt(e.target.value))} type="number" step={1} min={1} max={50} name="" id="" value={currentComponent.padding} className='border border-gray-700 outline-none rounded-md  bg-transparent w-full' />

                                       </div>
                                       <div className='flex gap-1 justify-start items-start '>
                                          <span className='text-md min-w-[70px]'>Font Size: </span>
                                          <input onChange={(e) => setFont(parseInt(e.target.value))} type="number" step={1} min={1} max={200} name="" id="" value={currentComponent.font} className='border border-gray-700 outline-none rounded-md  bg-transparent w-full' />

                                       </div>

                                       <div className='flex gap-1 justify-start items-start '>
                                          <span className='text-md min-w-[70px]'>Weight: </span>
                                          <input onChange={(e) => setWeight(parseInt(e.target.value))} type="number" step={100} min={100} max={1000} name="" id="" value={currentComponent.weight} className='border border-gray-700 outline-none rounded-md  bg-transparent w-full' />

                                       </div>

                                       <div className='flex gap-2 flex-col'>
                                          <input onChange={(e) => setCurrentComponent({ ...currentComponent, title: e.target.value })} type="text" name="" id="" value={currentComponent.title} className='border  hover:border-purple-500 border-gray-700 outline-none rounded-md  bg-transparent w-full py-2 px-2' />
                                          <button onClick={() => setText(currentComponent.title)} className='py-1 mt-1 bg-purple-500 text-white rounded'>Add text</button>
                                       </div>
                                    </>
                                 }

                                 {
                                    currentComponent.name === 'image' &&
                                    <div className='flex gap-1 justify-start items-start '>
                                       <span className='text-md min-w-[70px]'>Radius: </span>
                                       <input onChange={(e) => setRadius(parseInt(e.target.value))} type="number" step={1} min={1} max={100} name="" id="" value={currentComponent.radius} className='border border-gray-700 outline-none rounded-md  bg-transparent w-full' />

                                    </div>

                                 }

                              </div>
                           }


                        </div>
                     </div>
                  }

               </div>

            </div>
         </div>
      </div>
   );
}