const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
})

const updatefavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
})

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,  
        ref: 'user',                   
        required: 'true',
    },
}, { versionKey: false, timestamps: true })

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

module.exports = {
    Contact,
    addSchema,
    updatefavoriteSchema,
};