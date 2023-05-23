const testData = require('../db/data/test-data/index');
const request = require ('supertest');
const app = require('../app.js');
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
            const expectedReview = expect.objectContaining({
                review_id: expect.any(Number),
                title: expect.any(String),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                votes: expect.any(Number),
                category: expect.any(String),
                owner: expect.any(String),
                created_at: expect.any(String),
              });
            
              expect(res.body).toEqual(expect.objectContaining({ review: expectedReview }));
            });
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

describe('GET /api/reviews/:review_id/comments', () => {
    test('GET - STATUS: 200 - responds with an array of the chosen review_id with specified properties', () => {
        const testReviewId = 3
        return request(app).get(`/api/reviews/${testReviewId}/comments`)
        .expect(200)
        .then((res) => {
            let commentLength = (res.body.comments);
            expect(commentLength.length).toBe(3);
            expect(Array.isArray(res.body.comments)).toBe(true);
            res.body.comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id');
                expect(comment).toHaveProperty('votes');
                expect(comment).toHaveProperty('created_at');
                expect(comment).toHaveProperty('author');
                expect(comment).toHaveProperty('body');
                expect(comment).toHaveProperty('review_id', testReviewId);
      
            })

            
    })
})

test('GET - STATUS: 200 - responds with comments sorted by created_at descending; i.e. newest first', () => {
    return request(app)
      .get('/api/reviews/3/comments')
      .expect(200)
      .then((res) => {
            const comments = res.body.comments;
            expect(comments).toBeSortedBy('created_at',
              { descending: true })
          })
      })

      test('GET - STATUS: 404 - responds with "review not found" message for non-existent review ID', () => {
        return request(app)
          .get(`/api/reviews/9021/comments`)
          .expect(404)
          .then((res) => {
            expect(res.body).toEqual({ msg: 'review not found' })
          })
      })
      test('GET - STATUS: 200 - if the review has no comments, it should return an empty array', () => {
        return request(app)
          .get(`/api/reviews/1/comments`)
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toEqual([]);
          });
      });

          })
describe('GET /api/reviews', () => {
    test('GET - STATUS: 200 - responds with a reviews array of all review objects with their relevant properties, excluding review_body', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((res) => {
            expect(res.body.reviews.length).toBe(13);
            expect(Array.isArray(res.body.reviews)).toBe(true);
            res.body.reviews.forEach((review) => {
                expect(typeof review.owner).toBe('string');
                expect(typeof review.title).toBe('string');
                expect(typeof review.review_id).toBe('number');
                expect(typeof review.category).toBe('string');
                expect(typeof review.review_img_url).toBe('string');
                expect(typeof review.created_at).toBe('string');
                expect(typeof review.votes).toBe('number');
                expect(typeof review.designer).toBe('string');
                expect(review).not.toHaveProperty('review_body');
                expect(typeof review.comment_count).toBe('number')
                expect(res.body.reviews[5].comment_count).toBe(3)
                expect(res.body.reviews[3].comment_count).toBe(0)
        
            })
    })
})
})

describe('POST /api/reviews/:review_id/comments', () => {
    test('POST - STATUS: 201 - the request body should accept an object with a username and a body and return the posted comment', () => {
        return request(app)
        .post('/api/reviews/1/comments')
        .send({
            username: 'mallionaire',
            body: 'I love this game'
        })
        .expect(201)
        .then((res) => {
            console.log(res.body);
            expect(res.body.comment.author).toBe('mallionaire')
            expect(res.body.comment.body).toBe('I love this game')
            expect(res.body.comment).toHaveProperty('comment_id', 7)
        })
    })
})