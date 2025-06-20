const jwt=require('jsonwebtoken')
const  auth=async (req,res,next)=>{
    const {authorization}=req.headers

    if(authorization){
        const token=authorization.split(' ')[1]
        // console.log(token)
        if(token){

    try {

        const userInfo=await jwt.verify(token,'praful')
        req.userInfo=userInfo
        next()
        
    } catch (error) {
        return res.status(401).json({message:"unauthorized Access"})
    }

        }else{
             return res.status(401).json({message:"unauthorized Access"})
        }


    }else{
        return res.status(401).json({message:"unauthorized Access"})
    }
}

module.exports=auth