
import './App.css'
import {createBrowserRouter,RouterProvider,Navigate} from 'react-router-dom' 
import Index from '../src/Pages/Index'
import Layout from './Pages/Layout'
import Home from './components/Home'
import Templates from './components/Templates'
import Projects from './components/Projects'
import CreateDesign from './components/CreateDesign'
import Main from './Pages/Main'
import { token_decode } from './utills/index'
import { Toaster } from 'react-hot-toast';


const userInfo=token_decode(localStorage.getItem('canva_token'))

const router=createBrowserRouter([{
  path:'/',
  element:userInfo ? <Layout/> : <Index/>,
  children:[
    {
       path:'/',
       element:<Home/>
    },
    {
       path:'/templates',
       element:<Templates/>
    },
    {
       path:'/projects',
       element:<Projects/>
    }
  ]
},
{
  path:'/design/create',
  element:userInfo ? <CreateDesign/> : <Navigate to='/'/>
},
{
  path:'/design/:design_id/edit',
  element:userInfo ? <Main/> : <Navigate to='/'/>
}
])

function App() {



   

  return (
    <>
    <RouterProvider router={router}/>
     <Toaster 
  reverseOrder={false}
  toastOptions={{
    // Default toast style
    style: {
      background: '#6b21a8', // Tailwind purple-800
      color: '#fff',
    },
    success: {
      iconTheme: {
        primary: '#a855f7', // Tailwind purple-500
        secondary: '#f3e8ff',
      },
    },
    error: {
      style: {
        background: '#991b1b',
        color: '#fff',
      },
    },
  }}/>
     </>
     
  )
}

export default App
