const express = require('express');
const { HttpError } = require("../../helpers");
const {isValidId, authenticate} = require("../../middlewares")

const {Contact, addSchema, updatefavoriteSchema} = require("../../models/contact");

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite} = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }, '', { skip, limit }).populate('owner', 'name email');
    
    res.json(result);
  }
  catch(error) {
    next(error);
  }
})

router.get('/:contactId', authenticate, isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  }
  catch(error) {
    next(error);
  }
})

router.post('/', authenticate,  async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { _id: owner } = req.user; 
    const result = await Contact.create({...req.body, owner}); 
    res.status(201).json(result);
  }
  catch (error) {
    next(error);
  }
})

router.delete('/:contactId',authenticate, isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json({message: "Contact Delete"})
  }
  catch (error) {
    next(error);
  }
})

router.put('/:contactId', authenticate, isValidId , async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true})
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
})

router.patch('/:contactId/favorite', authenticate,isValidId, async (req, res, next) => {
  try {
    const { error } = updatefavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "missing field favorite");
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true})
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
})

module.exports = router;
