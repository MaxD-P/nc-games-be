const testData = require('../db/data/test-data/index');
const request = require ('supertest');
const app = require('../db/app.js');
const seed = require('../db/seeds/seed');
const db = require ('../db/connection');

beforeEach(() => seed(testData))

afterAll(() => {
    db.end()
});

describe('GET api/categories', () => {
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