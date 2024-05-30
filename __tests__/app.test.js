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
          const topics = body.topics;
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
  test("200: Responds with an correct object by specific id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
          expect(body.article).toMatchObject({
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
        const articles = body.articles;
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
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments by the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
          expect(body.comment.length).toBe(2)
          expect(body.comment[0]).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3
        });
      });
  });
 
  test("200: Responds with 'No Comment' for the given existent article_id", () => {
     return request(app)
         .get("/api/articles/2/comments")
         .expect(200)
         .then(({ body }) => {
          const {comment} = body;
          expect(comment).toEqual([]);
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
 });

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment by the given article_id", () => {
    const newCommentData = {
      username: "rogersop",
      body: "What a lovely day!"
    }
    return request(app)
    .post("/api/articles/3/comments")
    .send(newCommentData)
    .expect(201)
    .then(({ body }) => {
        expect(body.comment).toMatchObject({
            comment_id: expect.any(Number),
            body: "What a lovely day!",
            article_id: 3,
            author: "rogersop",
            votes: 0,
            created_at: expect.any(String)
        });
    });
  });

  test("400: Responds with 'Bad Request' when the request body is missing any properties", () => {
    const newCommentData = {
        body: "What a lovely day!"
    };
    return request(app)
        .post("/api/articles/3/comments")
        .send(newCommentData)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
        });
  }); 
  test("400: Responds with 'Bad Request' for invalid article id", () => {
    const newCommentData = {
      username: "rogersop",
      body: "What a lovely day!"
  };
    return request(app)
        .post("/api/articles/not-a-valid-id/comments")
        .send(newCommentData)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
        });
});
  test("404: Responds with 'Not Found' for non-existent article id", () => {
    const newCommentData = {
        username: "rogersop",
        body: "What a lovely day!"
    };
    return request(app)
        .post("/api/articles/9999/comments")
        .send(newCommentData)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
        });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("202: Updates the article votes and responds with the updated article", () => {
    return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -5 })
        .expect(202)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 95,
            article_img_url: expect.any(String)
        });
      });
    });
    test("400: Responds with 'Bad Request' for invalid article id", () => {
      return request(app)
          .patch("/api/articles/not-a-valid-id")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
          });
  });

  test("404: Responds with 'Not Found' for non-existent article id", () => {
      return request(app)
          .patch("/api/articles/9999")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
              expect(body.msg).toBe("Not Found");
          });
  });
  test("400: Responds with 'Bad Request' for invalid article id", () => {
    return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 'string' })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
        });
});
});
      
