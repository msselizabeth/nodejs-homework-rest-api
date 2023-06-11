const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    password: {
        type: String,
        minlenght: 6,
        required: true,
    },
    token: {
        type: String,
        default: '',
    },
    avatarURL:{
        type: String,
        required: true,
    },
    verify: {
    type: Boolean,
    default: false,
  },
   verificationCode: {
    type: String,
  },

}, { versionKey: false, timestamps: true });

userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

const userEmailSchema = Joi.object({
     email: Joi.string().pattern(emailRegexp).required(),
})

const schemas = {
    registerSchema,
    loginSchema,
    userEmailSchema
}

const User = model('user', userSchema);

module.exports = {
    User,
    schemas
}