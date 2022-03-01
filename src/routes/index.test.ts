const request = require('supertest');
const express = require('express');
import routes from '../routes';
const path = require('path');
import * as bodyParser from 'body-parser';

const fs = require('fs');

const rawArticleData = fs.readFileSync(path.resolve(__dirname, '../../test-data/inventory.json'));
const articleData = JSON.parse(rawArticleData);

const rawProductData = fs.readFileSync(path.resolve(__dirname, '../../test-data/products.json'));
const productData = JSON.parse(rawProductData);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api", routes);

/*

{
"user_id" : 1,
"name" : "Daniel Johnsson",
"lat" : 55.577720,
"long" : 12.969610
}


{
"user_id" : 2,
"name" : "Tobias Ölander",
"lat" : 55.801680,
"long" : 12.974160
}


*/


const db = require('../tests/db')
beforeAll(async () => await db.connect())
afterEach(async () => await db.clearDatabase())
afterAll(async () => await db.closeDatabase())

describe('article API', () => {
  test('get articles with empty database', async() => {
    const res = await request(app)
      .get('/api/articles')
      .expect('Content-Type', /json/)
      .expect([])
      .expect(200);
  });

  test("upload articles", async() => {
    const res = await request(app)
      .post('/api/articles')
      .type('form')
      .set('Accept', /application\/json/)
      .send(articleData)
      .expect(200);
  });

  test("upload articles, then get articles", async() => {
    await request(app)
      .post('/api/articles')
      .type('form')
      .set('Accept', /application\/json/)
      .send(articleData)
      .expect(200);

    const res = await request(app)
      .get('/api/articles')
      .expect('Content-Type', /json/)
      .expect(200);

    const response = JSON.parse(res.res.text);
    expect(articleData.inventory.length).toEqual(response.length);

    for (let i = 0; i < articleData.inventory.length; i++) {
      expect(articleData.inventory[i].art_id).toEqual(response[i].art_id);
      expect(articleData.inventory[i].name).toEqual(response[i].name);
      expect(articleData.inventory[i].stock).toEqual(response[i].stock);
    }
  });

  test("upload articles, then get article by ID", async() => {
    await request(app)
      .post('/api/articles')
      .type('form')
      .set('Accept', /application\/json/)
      .send(articleData)
      .expect(200);

    for (let i = 0; i < articleData.inventory.length; i++) {
      const res = await request(app)
        .get('/api/articles/' + articleData.inventory[i].art_id)
        .expect('Content-Type', /json/)
        .expect(200);
      const response = JSON.parse(res.res.text);
      expect(articleData.inventory[i].art_id).toEqual(response.art_id);
      expect(articleData.inventory[i].name).toEqual(response.name);
      expect(articleData.inventory[i].stock).toEqual(response.stock);
    }
  });
});

describe('product API', () => {
  test('get products with empty database', async() => {
    const res = await request(app)
      .get('/api/products')
      .expect('Content-Type', /json/)
      .expect([])
      .expect(200);
  });

  test("upload products", async() => {
    const res = await request(app)
      .post('/api/products')
      .type('form')
      .set('Accept', /application\/json/)
      .send(productData)
      .expect(200);
  });

  test("upload products, then get products", async() => {
    await request(app)
      .post('/api/products')
      .type('form')
      .set('Accept', /application\/json/)
      .send(productData)
      .expect(200);

    const res = await request(app)
      .get('/api/products')
      .expect('Content-Type', /json/)
      .expect(200);

    const response = JSON.parse(res.res.text);
    expect(productData.products.length).toEqual(response.length);

    for (let i = 0; i < productData.products.length; i++) {
      expect(productData.products[i].prod_id).toEqual(response[i].prod_id);
      expect(productData.products[i].name).toEqual(response[i].name);
      expect(productData.products[i].price).toEqual(response[i].price);
      for (let j = 0; j < productData.products[i].contain_articles.length; j++) {
        expect(productData.products[i].contain_articles[j].art_id).toEqual(response[i].contain_articles[j].art_id);
        expect(productData.products[i].contain_articles[j].amount_of).toEqual(response[i].contain_articles[j].amount_of);
      }
    }
  });

  test("upload products, then get product by ID", async() => {
    await request(app)
      .post('/api/products')
      .type('form')
      .set('Accept', /application\/json/)
      .send(productData)
      .expect(200);

    for (let i = 0; i < productData.products.length; i++) {
      const res = await request(app)
        .get('/api/products/' + productData.products[i].prod_id)
        .expect('Content-Type', /json/)
        .expect(200);

      const response = JSON.parse(res.res.text);
      expect(productData.products[i].prod_id).toEqual(response.prod_id);
      expect(productData.products[i].name).toEqual(response.name);
      expect(productData.products[i].price).toEqual(response.price);
      for (let j = 0; j < productData.products[i].contain_articles.length; j++) {
        expect(productData.products[i].contain_articles[j].art_id).toEqual(response.contain_articles[j].art_id);
        expect(productData.products[i].contain_articles[j].amount_of).toEqual(response.contain_articles[j].amount_of);
      }
    }
  });

  test("upload products and articles, and get quantity", async() => {

    // Upload a product that requires 1 of article 1 and 2 of article 2
    // Upload 2 of article 1 and 5 of article 2
    // The result should be 2

    await request(app)
      .post('/api/products')
      .type('form')
      .set('Accept', /application\/json/)
      .send(
        {
          products:
          [
            {
              prod_id: 1,
              name: 'Test product',
              price: 10,
              contain_articles:
              [
                {
                  art_id: 1,
                  amount_of: 1
                },
                {
                  art_id: 2,
                  amount_of: 2
                }
              ]
            }
          ]
        }
        )
      .expect(200);

    await request(app)
      .post('/api/articles')
      .type('form')
      .set('Accept', /application\/json/)
      .send(
        {
          inventory:[
            {
              art_id: 1,
              name: 'Test article 1',
              stock: 2
            }
          ]
        }
      )
      .expect(200);

    await request(app)
      .post('/api/articles')
      .type('form')
      .set('Accept', /application\/json/)
      .send(
        {
          inventory:
          [
            {
              art_id: 2,
              name: 'Test article 2',
              stock: 5
            }
          ]
        }
      )
      .expect(200);

    const res = await request(app)
      .get('/api/products/1/quantity')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.res.text).toEqual('2');
  });

  test("upload products and articles, buy an product, and then get quantity", async() => {

    // Upload a product that requires 1 of article 1 and 2 of article 2
    // Upload 2 of article 1 and 5 of article 2
    // Buy one product
    // The result should be 1

    await request(app)
      .post('/api/products')
      .type('form')
      .set('Accept', /application\/json/)
      .send(
        {
          products:
          [
            {
              prod_id: 1,
              name: 'Test product',
              price: 10,
              contain_articles:
              [
                {
                  art_id: 1,
                  amount_of: 1
                },
                {
                  art_id: 2,
                  amount_of: 2
                }
              ]
            }
          ]
        }
        )
      .expect(200);

    await request(app)
      .post('/api/articles')
      .type('form')
      .set('Accept', /application\/json/)
      .send(
        {
          inventory:[
            {
              art_id: 1,
              name: 'Test article 1',
              stock: 2
            }
          ]
        }
      )
      .expect(200);

    await request(app)
      .post('/api/articles')
      .type('form')
      .set('Accept', /application\/json/)
      .send(
        {
          inventory:
          [
            {
              art_id: 2,
              name: 'Test article 2',
              stock: 5
            }
          ]
        }
      )
      .expect(200);

    await request(app)
      .delete('/api/products/1')
      .expect('Content-Type', /json/)
      .expect(200);

    const res = await request(app)
      .get('/api/products/1/quantity')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.res.text).toEqual('1');
  });
});
