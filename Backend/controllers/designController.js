const { formidable } = require('formidable');
const cloudinary = require('cloudinary').v2;
const designModel = require('../models/designModel');
const userImageModel = require('../models/userImageModel');

const designImageModel = require('../models/designImageModel');
const backgroundImageModel = require('../models/backgroundImageModel');
const templateModel = require('../models/templateModel');



class designController {
    create_user_design = async (req, res) => {
        const form = formidable({});
        const { _id } = req.userInfo;

        try {

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret
            });


            const [fields, files] = await form.parse(req);
            const { image } = files;

            if (!image || !image[0]) {
                return res.status(400).json({ message: "No image file provided" });
            }


            const result = await cloudinary.uploader.upload(image[0].filepath, {
                folder: 'Mini_Canva'
            });

            console.log(result)

            const design = await designModel.create({
                user_id: _id,
                components: [JSON.parse(fields.design[0])],
                image_url: result.secure_url
            });

            return res.status(200).json({ designId: design._id });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };


    get_user_design = async (req, res) => {
        const { design_id } = req.params
        // console.log(design_id)

        try {
            const design = await designModel.findById(design_id)
            return res.status(200).json({ design: design.components })

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }

    // update_user_design = async (req, res) => {
    //     const form = formidable({})
    //     const { design_id } = req.params

    //     try {

    //         cloudinary.config({
    //             cloud_name: process.env.cloud_name,
    //             api_key: process.env.api_key,
    //             api_secret: process.env.api_secret
    //         });


    //         const [fields, files] = await form.parse(req);
    //         const { image } = files;
    //         // console.log(fields)

    //         const components = JSON.parse(fields.design[0]).design
    //         // console.log(components)

    //         const old_design = await designModel.findById(design_id)
    //         // console.log(old_design)

    //         if (old_design) {
    //             if (old_design.image_url) {
    //                 const splitImage = old_design.image_url.split('/')
    //                 const imageFile = splitImage[splitImage.length - 1]

    //                 const imageName = imageFile.split('.')[0]
    //                 await cloudinary.uploader.destroy(imageName)
    //             }
    //             const { url } = await cloudinary.uploader.upload(image[0].filepath, {
    //                 folder: 'Mini_Canva'
    //             });

    //             await designModel.findByIdAndUpdate(design_id, {
    //                 image_url: url,
    //                 components

    //             })


    //             res.status(200).json({ message: 'Image save Successfully' })
    //         } else {
    //             res.status(500).json({ message: 'Design not found' })

    //         }

    //     } catch (error) {
    //         console.log(error.message)
    //     }


    // }


    update_user_design = async (req, res) => {
        const form = formidable({ multiples: false });
        const { design_id } = req.params;

        try {
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret
            });

            const [fields, files] = await form.parse(req);
            const { image } = files;
            const components = JSON.parse(fields.design[0]).design;

            const old_design = await designModel.findById(design_id);
            if (!old_design) {
                return res.status(404).json({ message: 'Design not found' });
            }




            const result = await cloudinary.uploader.upload(image[0].filepath, {
                public_id: `Mini_Canva/design_${design_id}`,
                overwrite: true,
                invalidate: true,
                use_filename: false,
                unique_filename: false,
                resource_type: 'image'
            });

            await designModel.findByIdAndUpdate(design_id, {
                image_url: result.secure_url,
                components
            });

            res.status(200).json({ message: 'Design updated successfully', image_url: result.secure_url });

        } catch (error) {
            console.error('Error updating design:', error.message);
            res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    };




    add_user_image = async (req, res) => {
        const { _id } = req.userInfo;
        const form = formidable({ multiples: false }); // or true if multiple files

        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret
        });

        try {
            const [_, files] = await form.parse(req);

            const imageFile = files.image?.[0]; // safe optional chaining
            if (!imageFile) {
                return res.status(400).json({ message: 'No image file uploaded' });
            }

            const result = await cloudinary.uploader.upload(imageFile.filepath, {
                folder: 'Mini_Canva'
            });

            const userImage = await userImageModel.create({
                user_id: _id,
                image_url: result.secure_url
            });

            return res.status(200).json({ userImage });

        } catch (error) {
            console.error('Upload Error:', error.message);
            return res.status(500).json({ message: 'Image upload failed' });
        }
    };

    get_user_image = async (req, res) => {
        console.log("Route hit ");

        const { _id } = req.userInfo;
        try {
            const images = await userImageModel.find({ user_id: _id })
            console.log(images)
            return res.status(200).json({ images })


        } catch (error) {

        }

    }


    get_design_image = async (req, res) => {

        try {
            const images = await designImageModel.find({})
            console.log(images)
            return res.status(200).json({ images })


        } catch (error) {

        }

    }


    get_background_image = async (req, res) => {

        try {
            const images = await backgroundImageModel.find({})
            console.log(images)
            return res.status(200).json({ images })


        } catch (error) {

        }

    }

    get_user_designs = async (req, res) => {
        const { _id } = req.userInfo

        try {
            const designs = await designModel.find({ user_id: _id }).sort({ createdAt: -1 })
            return res.status(200).json({ designs })

        } catch (error) {

        }
    }

    delete_user_image = async (req, res) => {
        const { design_id } = req.params
        try {
            await designModel.findByIdAndDelete(design_id)
            return res.status(200).json({ message: 'design delete successfully' })


        } catch (error) {
            res.status(500).json({ message: error.message })

        }

    }

    get_templates = async (req, res) => {
        try {
            const templates = await templateModel.find({}).sort({ createdAt: -1 })
        return res.status(200).json({ templates })

            
        } catch (error) {
            
        }
    }

    add_user_template=async(req,res)=>{
        const {template_id}=req.params
        const {_id}=req.userInfo

         try {
            const template = await templateModel.findById(template_id)
            const design=await designModel.create({
                user_id :_id,
                components:template.components,
                image_url:template.image_url
            })
           
        return res.status(200).json({ design })

            
        } catch (error) {

            return res.status(500).json({message:error.message})
            
        }

    }



}

module.exports = new designController();