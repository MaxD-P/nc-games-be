const testData = require('../db/data/test-data/index');
const request = require ('supertest');
const app = require('../db/app.js');
const seed = require('../db/seeds/seed');
const db = require ('../db/connection');

const endpoints = require('../db/endpoints.json');

beforeEach(() => seed(testData))

afterAll(() => {
    db.end()
});

describe('GET /api/categories', () => {
    test('should give a 200 response and return an array of category objects', () => {
        return request(app).get('/api/categories').expect(200).then(({body}) => {
            expect(body.categories).toHaveLength(4)
            body.categories.forEach((category) => {
                expect(typeof category.slug).toBe('string');
                expect(typeof category.description).toBe('string');
            })
        })
    })
    test('incorrect path should return an error 404', () => {
        return request(app).get('/api/cdtegories').expect(404).then(({ body } ) => {
            expect(body.msg).toBe('Invalid endpoint');
        })
    })
})

describe('GET /api', () => {
    test('returns the JSON object of endpoints', () => {
        return request(app).get('/api').expect(200).then((res) => {
            expect(res.type).toBe('application/json');
            expect(res.body).toEqual(endpoints)
        })
    })
})

describe('GET /api/reviews/:review_id', () => {
    test('GET - STATUS: 200 - responds with review object of corresponding review_id endpoint', () => {
        return request(app).get('/api/reviews/1')
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
            expect(res.body.review.title).toBe('Agricola');
            expect(res.body.review.designer).toBe('Uwe Rosenberg');
            expect(res.body.review.owner).toBe('mallionaire');
            expect(res.body.review.review_img_url).toBe('https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700');
            expect(res.body.review.review_body).toBe('Farmyard fun!');
            expect(res.body.review.category).toBe('euro game');
            expect(typeof res.body.review.created_at).toBe('string');
            expect(res.body.review.votes).toBe(1);
            })
    })
    test('GET - STATUS: 404 - an review_id that is not in the database should respond with this error', () => {
        return request(app).get('/api/reviews/934')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('review not found')
        })
    })
    test('GET - STATUS: 400 - an invalid review_id syntax should respond with this error', () => {
        return request(app).get('/api/reviews/bad-endpoint')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('invalid endpoint syntax')
        })
    })
})