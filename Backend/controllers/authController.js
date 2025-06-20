const userModal = require('../models/userModel.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class authController {

    user_register = async (req, res) => {
        let { name, email, password } = req.body
         name=name.trim()
         email=email.trim()
          password=password.trim()
        try {
            // const get_user = await userModal.findOne({ email }).select('+password')
            const get_user = await userModal.findOne({ email });
            if (get_user) {
                return res.status(404).json({
                    message: "Emil already exist"
                })
            } else {
                const user = await userModal.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10)
                })
                const token = await jwt.sign({
                    name: user.name,
                    email: user.email,
                    _id: user.id
                }, 'praful', {
                    expiresIn: '2d'
                })
                return res.status(201).json({
                    message: "signup success", token
                })
            }


        } catch (error) {
            console.log(error.message)
            return res.status(500).json({
                message: "Internal Server error"
            })
        }

    }

    user_login = async (req,res) => {
        const { email, password } = req.body
        try {
            const user = await userModal.findOne({ email }).select('+password')
            if (user) {
                const match = await bcrypt.compare(password,user.password)
                if (match) {
                    const token = await jwt.sign({
                        name: user.name,
                        email: user.email,
                        _id: user.id
                    }, 'praful', {
                        expiresIn: '2d'
                    })
                    return res.status(200).json({ message: "Signin Succesfully", token })

                } else {
                    return res.status(404).json({ message: "Invalid Password" })
                }

            } else {
                return res.status(404).json({ message: "Email does't exist" })
            }
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({
                message: "Internal Server error"
            })
        }
    }

}

module.exports = new authController()