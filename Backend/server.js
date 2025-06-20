const express=require('express')
const mongoose=require('mongoose')
const app=express()
const dotenv=require('dotenv')
const cors=require('cors')
const path=require('path')
const authRoutes=require('./routes/authRoutes')
const designRoutes=require('./routes/designRoutes')


dotenv.config()



if (process.env.NODE_ENV === 'production') {
    app.use(cors({
        origin: 'https://minicanvaproject.netlify.app',
        credentials: true
    }));
} else {
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true
    }));
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
 
// // Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//  app.use(express.static(path.join(__dirname,"./frontend/dist")))

// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
// });
// }


const dbConnect=async()=>{
    try {
        if(process.env.NODE_ENV==='local'){
            await mongoose.connect(process.env.LOCALDB_URI)
            console.log('Local Database is connected...')
        }else{
              await mongoose.connect(process.env.MONGODB_URI)
            console.log('Production  Database is connected...')
        }

    } catch (error) {
        console.log('Database connection failed')
    }

}

app.get('/', (req, res) => {
  res.send('Mini_Canva Backend is running successfully!');
});

 

app.use('/api',authRoutes)
app.use('/api',designRoutes)

dbConnect()




const PORT=process.env.PORT 

app.listen(PORT,()=>console.log(`Server is running on port ${PORT} ..`))
