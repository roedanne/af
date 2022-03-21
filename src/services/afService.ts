import { User, UserModel } from '../models/user';
import { Task, TaskModel } from '../models/task';
import { Event, EventModel } from '../models/event';


import logger from '../logger';
/*

  This service class is responsible for maintaining all data management for articles and products

*/
export default class AfService {

  constructor() {
//    logger.info('AF initialized')
  }

  // TODO should have been named better
  // Loads an array of articles into the database
  /*
  async loadInventory(inventory:Array<Article>) : Promise<void> {
    if (inventory == null) {
      throw new Error('No articles provided');
    }

    for (const article of inventory) {
      const existingArticle = await this.getArticle(article.art_id);
      if (existingArticle == null) {
        const model = new ArticleModel(article);//{art_id: article.art_id, name: article.name, stock: article.stock}
        await model.save();
      } else {
        await this.updateArticleStock(article.art_id, article.stock);
      }
    }
  }

  // Get a single article based on its ID
  async getArticle(artId:number) : Promise<Article> {
    const article = await ArticleModel.findOne({ art_id: artId }).exec();
    return article;
  }

  // Get the stock count for a specific article based on its ID
  async getStock(artId:number) : Promise<number> {
    const article:Article = await ArticleModel.findOne({ art_id: artId }).exec();
    if (article == null) {
      return 0;
    }
    return article.stock;
  }

  // List all articles
  async getArticles() : Promise<Article[]> {
    return await ArticleModel.find().exec();
  }

  // Change the stock count for a specific article
  // The article has to exist for this method to work
  async updateArticleStock(articleId:number, diff:number) : Promise<void> {
    logger.debug('updateArticleStock # id ' + articleId + ', diff ' + diff);
    const article = await this.getArticle(articleId);
    if (article == null) {
      throw new Error('No article width ID ' + articleId + ' found');
    } else {
      article.stock += diff;
      if (article.stock < 0) {
        throw new Error('Negative stock not allow. In stock = ' + article.stock);
      }
      await article.save();
    }
  }

  // Load an array of products into the database
  async loadProducts(products:Array<Product>) : Promise<void> {
    logger.debug('loadProducts # start');
    for (const product of products) {
      logger.debug(product);
      await this.addProduct(product);
    }
    logger.debug('loadProducts # end');
  }
*/
  // Add a product to the database
  async addUsers(users:Array<User>) : Promise<void> {
    logger.debug('addUser ' + users);
    //this.validateProduct(product);
    //const existingProduct = await this.getProduct(product.prod_id);
    //if (existingProduct != null) {
    //  await ProductModel.deleteOne({ prod_id: product.prod_id });
    //}
    for (const user of users) {
      logger.debug(user);
      await new UserModel(user).save();
    }

  }

  async getUser(userId:number) {
    return await UserModel.findOne({ user_id: userId }).exec();
  }

  async getAllTasks() {
    return await TaskModel.find().exec();
  }

  async getTasksInProximity(userId:number,distance:number) {
    const user:User = await UserModel.findOne({ user_id: userId }).exec();
    return await TaskModel.find({
       location:
         { $near:
            {
              $geometry: user.location,
              $minDistance: 0,
              $maxDistance: distance
            }
         },
         state: 'Available'
     });
  }

  async loadTasks(tasks:Array<Task>) : Promise<void> {
    logger.debug('loadTasks # start');
    for (const task of tasks) {
      logger.debug(task);
      await new TaskModel(task).save();
    }
    logger.debug('loadTasks # end');
  }

  async getEvents(taskId:number) {
    return await EventModel.find({task_id : taskId}).exec();
  }

// TODO Update correct value, e.g. changing name. At the moment an event can only update the state
  async applyEvent(event:Event) : Promise<void> {
    const task = await TaskModel.findOne({task_id : event.task_id}).exec();
    if (task == null) {
      logger.warn('Task >' + event.task_id + '< not found');
      throw new Error('Task >' + event.task_id + '< not found');
    }
    const newState = this.nextState(task, event);
    task.state = newState;
    await new EventModel(event).save();
    await task.save().catch(e => logger.error(e));
  }

  nextState(task : Task, event : Event) : string {
    if (task.state === 'New') {
      switch (event.type) {
        case 'Publish':
          return 'Available';
        case 'Cancel':
          return 'Cancelled';
      }
    }
    if (task.state === 'Available') {
      switch (event.type) {
        case 'Assign':
          return 'Assigned';
        case 'Cancel':
          return 'Cancelled';
      }
    }
    logger.error('State change not possible');
    throw new Error('Invalid state change from >' + task.state + '< to >' + event.type + '<');
  }

/*
  // Validates a product
  validateProduct(product:Product) : void {
    if (product == null) {
      throw new Error('Product >' + product + '< not valid');
    }
    if (product.name == null) {
      throw new Error('No product name provided');
    }
    if (product.contain_articles == null) {
      throw new Error('No product articles provided');
    }
    if (product.price == null) {
      throw new Error('No product price provided');
    }
    product.contain_articles.forEach(e => {
      if (e.art_id == null || e.amount_of == null) {
        throw new Error('Contained articles should define art_id and amount_of');
      }
    });
  }
/*
  // Buys a product
  async buyProduct(productId:number) : Promise<void> {
sales ORDER

for (const article of product.contain_articles) {
lock for salesorder
iflocked
  check stock count

}

remove Articles
await this.updateArticleStock(article.art_id, -article.amount_of);

accept order
clear locks


    const product = await this.getProduct(productId);
    if (product == null) {
      throw new Error('Product with ID ' + productId + ' not found');
    }

// Note! Not optimal to perform another query for product here, but there was no time to restructure
    if (await this.getProductQuantity(productId) < 1) {
      throw new Error('Product out of stock');
    }


  }
*/

/*
  // Returns a single product based on its ID
  async getProduct(prodId:number) : Promise<Product> {
    return await ProductModel.findOne({ prod_id: prodId }).exec();
  }

  // Returns all products
  async getProducts() : Promise<Product[]> {
    const products:Array<Product> = await ProductModel.find().exec();
    return products;
  }

  // Returns the number of products that can be sold based on the contained articles' stock
  async getProductQuantity(productId:number) : Promise<number> {
    const product = await ProductModel.findOne({ prod_id: productId }).exec();
    let lowestQuantity: number = Number.MAX_SAFE_INTEGER;
    for (const article of product.contain_articles) {
      const stock = await this.getStock(article.art_id);
      const possibleQuantity = Math.floor(stock / article.amount_of);
      if (possibleQuantity < lowestQuantity) {
        lowestQuantity = possibleQuantity;
      }
    }
    return lowestQuantity;
  }
*/
// This method is just for demo purposes. Error will be throws if executed twice.
  async clearData() : Promise<void> {
    try {
      await TaskModel.deleteMany({}, function(err:Error) {
        logger.info('Tasks truncated')
      });
    } catch (e) {
      logger.warn(e);
    }
    try {
      await UserModel.deleteMany({}, function() {
        logger.info('Users truncated')
      });
    } catch (e) {
      logger.warn(e);
    }
    try {
      await EventModel.deleteMany({}, function(err:Error) {
        logger.info('Events truncated')
      });
    } catch (e) {
      logger.warn(e);
    }
  }

}
