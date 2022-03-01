// This file handles all the /api routes.

import AfService from '../services/afService'
const service = new AfService();

import * as express from 'express';
const router = express.Router()

import logger from '../logger';

// Posts articles into inventory
// A more sofisticated solution might implement PUT for updating the existing
// articles, but since we are doing a bulk import/update, this method will handle
// both creating new articles and updating their stock
//
// Also I should've used a 201 response if the articles were created, but again,
// since it is a bulk update I decided to stick with a 200 response.
//
// If I had more time I would probably have structure the create/update process
// a bit differently
//
/*

"location" : {
  "type" : "Point",
  "coordinates": [

  ]
}

{
"users": [
{
"user_id" : 1,
"name" : "Daniel Johnsson",
"location" : {
  "type" : "Point",
  "coordinates": [
    55.577720,
    12.969610
  ]
}
},
{
"user_id" : 2,
"name" : "Tobias Ölander",
"location" : {
  "type" : "Point",
  "coordinates": [
    55.801680,
    12.974160
  ]
}
},
{
"user_id" : 3,
"name" : "Donald Trump",
"location" : {
  "type" : "Point",
  "coordinates": [
    26.6771,
    80.0370
  ]
}
},
{
"user_id" : 4,
"name" : "Oskar Stackerud",
"location" : {
  "type" : "Point",
  "coordinates": [
    55.598660,
    13.013020
  ]
}
}
]
}


*/
router.post('/users', async function (req, res, next) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.json(await service.addUsers(req.body.users));
    res.status(200).end();
  } catch (e)
  {
    next(e)
  }
})

router.get('/users/:userId', async function (req, res, next) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.json(await service.getUser(Number(req.params.userId)));
    res.status(200).end();
  } catch (e)
  {
    res.send('User with ID >' + req.params.userId + '< not found').status(400);
  }
})


router.get('/tasks', async function (req, res, next) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.json(await service.getAllTasks());
    res.status(200).end();
  } catch (e)
  {
    next(e)
  }
})

router.get('/tasks/:taskId/events', async function (req, res, next) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.json(await service.getEvents(Number(req.params.taskId)));
    res.status(200).end();
  } catch (e)
  {
    next(e)
  }
})


router.get('/tasks/user/:userId/proximity/:distance', async function (req, res, next) {
  if (isNaN(req.params.userId as any)) {
    res.send('User ID >' + req.params.userId + '< is not a number').status(400);
    return;
  }
  try {
    const userId = Number(req.params.userId);
    const distance = Number(req.params.distance);
    res.setHeader('Content-Type', 'application/json');
    res.json(await service.getTasksInProximity(userId, distance));
    res.status(200).end();
  } catch (e)
  {
    next(e)
  }
})


/*


{
"tasks": [
{
"task_id" : 1,
"assignee_id" : 0,
"employer_id" : 4,
"name" : "Wipe my ass",
"location" : {
  "type" : "Point",
  "coordinates": [
    26.6771,
    80.0370
  ]
}
},
{
"task_id" : 2,
"assignee_id" : 0,
"employer_id" : 4,
"name" : "Städa Värnhem",
"location" : {
  "type" : "Point",
  "coordinates": [
    55.605660,
    13.023110
  ]
}
},
{
"task_id" : 3,
"assignee_id" : 3,
"employer_id" : 0,
"name" : "Städa Bärnstensvägen",
"location" : {
  "type" : "Point",
  "coordinates": [
    55.764530,
    13.005540
  ]
}
},
{
"task_id" : 4,
"assignee_id" : 0,
"employer_id" : 3,
"name" : "Unknown",
"location" : {
  "type" : "Point",
  "coordinates": [
    55.625660,
    13.123110
  ]
}
}
]
}


*/
router.post('/tasks', async function (req, res, next) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.json(await service.loadTasks(req.body.tasks));
    res.status(200).end();
  } catch (e)
  {
    next(e)
  }
})

/*

{'event':
  'task_id' : 1,
  'type' : 'Publish',
  'user_id' : 1,
  'comment' : 'Made avaiable'
}


*/
router.post('/events', async function (req, res, next) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.json(await service.applyEvent(req.body.event));
    console.log('Returning');
    res.status(200).end();
  } catch (e)
  {
    logger.error(e.message);
    res.json(e.message);
    res.status(400).end();
  }
})

// TODO Only for demo purposes, would be removed in a more mature solution
router.get('/test', function (req, res, next) {
  try {
    service.clearData();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end();
  } catch (e)
  {
    next(e)
  }
})

/*
// Retrieve all articles
router.get('/articles', async function (req, res, next) {
  try {
    res
      .setHeader('Content-Type', 'application/json')
      .json(await service.getArticles())
      .status(200)
      .end();
  } catch (e)
  {
    next(e)
  }
})

// Get a specific article
router.get('/articles/:articleId', async function (req, res, next) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.json(await service.getArticle(parseInt(req.params.articleId)));
    res.status(200).end();
  } catch (e)
  {
    next(e)
  }
})



/*
// Retrieve all products
router.get('/products', async function (req, res, next) {
  try {
    res
      .setHeader('Content-Type', 'application/json')
      .json(await service.getProducts())
      .status(200)
      .end();
  } catch (e)
  {
    next(e)
  }
})

// Return the single product
router.get('/products/:productId', async function (req, res, next) {
  if (isNaN(req.params.productId as any)) {
    res.send('Product ID >' + req.params.productId + '< is not a number').status(400);
    return;
  }
  try {
    const prodId = Number(req.params.productId);
    res.setHeader('Content-Type', 'application/json');
    res.json(await service.getProduct(prodId));
    res.status(200).end();
  } catch (e)
  {
    next(e)
  }
})


// Return the calculated quanity of a given product
router.get('/products/:productId/quantity', async function (req, res, next) {
  if (isNaN(req.params.productId as any)) {
    res.send('Product ID >' + req.params.productId + '< is not a number').status(400);
    return;
  }
  try {
    const prodId = Number(req.params.productId);
    res.setHeader('Content-Type', 'application/json');
    res.json(await service.getProductQuantity(prodId));
    res.status(200).end();
  } catch (e)
  {
    next(e)
  }
})

// This route is for buying a product.
// In a more scaled project I would have used a SalesOrder object instead
// The verb DELETE was the closest I came to describing the action in this limited scope
router.delete('/products/:productId', async function (req, res, next) {
  if (isNaN(req.params.productId as any)) {
    res.send('Product ID >' + req.params.productId + '< is not a number').status(400);
    return;
  }
  try {
    const prodId = Number(req.params.productId);
    res.setHeader('Content-Type', 'application/json');
    res.json(await service.buyProduct(prodId));
    res.status(200).end();
  } catch (e)
  {
    next(e)
  }
})

// Creates/updates products
// The same comments that I wrote for POST /articles applies here as well
router.post('/products', async function (req, res, next) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.json(await service.loadProducts(req.body.products));
    res.status(200).end();
  } catch (e)
  {
    next(e)
  }
})
*/
export default router;
