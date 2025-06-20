import axios from 'axios'
const local_api= 'https://mini-canva.onrender.com'
const production_api=''

const token=localStorage.getItem('canva_token')

const api=axios.create({
    baseURL:local_api,
    headers:{
        'Authorization':token ? `Bearer ${token}` : ""

    },
    withCredentials:true
})

export default api