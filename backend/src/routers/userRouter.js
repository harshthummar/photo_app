const express = require('express')
const router = new express.Router()
const User = require('../models/userModel')
const {sendWelcomeEmail,sendCancelationEmail} = require('../emails/account')
const auth = require('../middleware/auth')


//signup user
router.post('/register',async (req,res)=>{
    const user = new User(req.body)

    try{

        await user.save()
        sendWelcomeEmail(user.email,user.username);
        const token = await user.generateAuthToken()
        // console.log(token);
        res.status(201).send({user,token})


    }
    catch(e)
    {
        console.log(e);
        res.status(400).send(e)
    }
    
})


//login user
router.post('/login',async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        if(!user)
        {
            res.status(404).send({ message:"Invalid User"})
            return
        }
        const token = await user.generateAuthToken()
        res.send({ user , token})
    }
    catch(e)
    {
        console.log(e);
        res.status(400).send(e.message)
    }
      
})


//logout user
router.post('/logout',auth,async (req,res) => {
    try{
            req.user.tokens = req.user.tokens.filter((token)=>{
                return token.token !== req.token
            })

            await req.user.save()
            res.send()
    }
    catch(e){
        res.status(500).send()
    }
})




module.exports = router