const { Router } = require('express');
const itemController = require('../controllers/itemControllers');
const router = Router();

/*
This file contains all the routes relevant to the items — 
getting the items, adding a new item, updating items and deleting items. 
*/

router.get('/items', itemController.get_items); //GET req,  DESC:route fetches all the items from the server.
router.post('/items',itemController.post_item);//POST req, DESC:add a new item to the database.
router.put('/items/:id',itemController.update_item);//PUT req, DESC: update an existing item in the database.
router.delete('/items/:id',itemController.delete_item);//DELETE req, DESC: delete an item from the database.

module.exports = router;