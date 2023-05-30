const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const { authenticate } = require('../../middlewares');

const { schemas, User } = require('../../models/user');
const { HttpError } = require('../../helpers');

const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;

router.post('/register', async (req, res, next) => {
    try {
        const { error } = schemas.registerSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });  
        if (user) {
            throw HttpError(409, 'Email in use');
        }

        const hashPassword = await bcrypt.hash(password, 10); //створюємо хеш
        
        const newUser = await User.create({...req.body, password: hashPassword}); //змінюємо пароль на хеш
        res.status(201).json({      
            email: newUser.email,        
            name: newUser.name,
        })

        
    }
    catch(error) {
        next(error);
    }
})

router.post('/login', async (req, res, next) => { 
    try {
        const { error } = schemas.loginSchema.validate(req.body); 
        if (error) {
            throw HttpError(400, error.message);
        }

        const { email, password } = req.body; 
        const user = await User.findOne({ email }); 
        if (!user) {
            throw HttpError(401, 'Email or password invalid');
        }
        const passwordCompare = await bcrypt.compare(password, user.password); 
        if (!passwordCompare) {
            throw HttpError(401, 'Email or password invalid');
        }
      
        const payload = {
            id: user._id
        }; 

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });  
        await User.findByIdAndUpdate(user._id, { token });
        res.json({   
            token
        })
    }
    catch (error) {
        next(error);
    }
})

router.get('/current', authenticate, async (req, res, next)=>{
    try {
        const { email, name } = req.user;
        res.json({
            email,
            name,
        })
    }
    catch(error) {
        next(error);
    }
})

router.post('/logout', authenticate, async (req, res, next) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: '' });
        res.json({message:'Logout success'})
    }
    catch(error) {
        next(error);
    }
})

module.exports = router; 