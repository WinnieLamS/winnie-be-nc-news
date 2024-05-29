const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");
const sorted = require("jest-sorted");


afterAll(() => {
    return db.end();
  });
  
  beforeEach(() => {
    return seed(data);
  });

  describe("GET /api/topics", () => {
    test("200: Responds with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topics = body;
          expect(topics).toHaveLength(3); 
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String)
            });
          });
        });
    });

    test("404: ERROR - responds with an error when endpoint is not exsit", () => {
        return request(app)
        .get("/api/durian")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Route Not Found")
        })
    })
});
  

describe("GET /api", () => {
    test("200: An object describing all the available endpoints on API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpoints);
        });
    });
});


describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an acorrect object by specific id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
          expect(body).toMatchObject({
            article_id: 3,
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
        });
      });
  });

  test("400: Responds with 'Bad Request' for invalid article id", () => {
    return request(app)
        .get("/api/articles/not-a-valid-id")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
        });
});

test("404: Responds with 'Not Found' for non-existent article id", () => {
    return request(app)
        .get("/api/articles/999999")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
        });
});
});


describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toBeSortedBy("created_at", {descending: true});
        expect(articles).toHaveLength(13); 
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          });
        });
      });
  });

  test("400: Responds with 'Bad Request' for invalid endpoind", () => {
    return request(app)
        .get("/api/article")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Route Not Found")
      })
});
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
          expect(body).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3
        });
      });
  });
 
 
  test("400: Responds with 'Bad Request' for invalid article id", () => {
    return request(app)
        .get("/api/articles/not-a-valid-id/comments")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
        });
 });
 
 test("404: Responds with 'Not Found' for non-existent article id", () => {
    return request(app)
        .get("/api/articles/999999/comments")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
        });
 });

 test("404: Responds with 'Not Found' for non-existent article id", () => {
    return request(app)
        .get("/api/articles/3/comment")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Route Not Found");
        });
 });
 });
 