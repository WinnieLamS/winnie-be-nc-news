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
           article_img_url: expect.any(String),
           comment_count: 2
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


test("404: Responds with 'This article ID does not exist' for non-existent article id", () => {
   return request(app)
       .get("/api/articles/999")
       .expect(404)
       .then(({ body }) => {
           expect(body.msg).toBe("This article ID does not exist.");
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
 test("200: Responds with an array of article objects filtered by specific topic", () => {
   return request(app)
     .get("/api/articles?topic=cats")
     .expect(200)
     .then(({ body }) => {
       const articles = body.articles;
       expect(articles).toBeSortedBy("created_at", {descending: true});
       expect(articles).toHaveLength(1);
       articles.forEach((article) => {
         expect(article).toMatchObject({
           topic: "cats"
         });
       });
     });
 });
 test("200: Responds with an array of article objects filtered by specific topic", () => {
   return request(app)
     .get("/api/articles?topic=cats")
     .expect(200)
     .then(({ body }) => {
       const articles = body.articles;
       expect(articles).toBeSortedBy("created_at", {descending: true});
       expect(articles).toHaveLength(1);
       articles.forEach((article) => {
         expect(article).toMatchObject({
           topic: "cats"
         });
       });
     });
 });
 test("200: Responds with an array of article objects filtered by specific topic", () => {
   return request(app)
     .get("/api/articles?topic=paper")
     .expect(200)
     .then(({ body }) => {
       const articles = body.articles;
       expect(articles).toEqual([]);
     });
 });
 test("404: Responds with 'This topic does not exist' for non-existent topic", () => {
   return request(app)
       .get("/api/articles?topic=dogs")
       .expect(404)
       .then(({ body }) => {
           expect(body.msg).toBe("This topic does not exist.");
       });
 });
 test("200: Responds with an array of articles sorted by valid column", () => {
   return request(app)
     .get("/api/articles?sort_by=title")
     .expect(200)
     .then(({ body }) => {
       const articles = body.articles;
       expect(articles).toBeSortedBy("title", { descending: true });
     });
 });


 test("200: Responds with an array of articles sorted by valid column in ascending order", () => {
   return request(app)
     .get("/api/articles?sort_by=author&order=asc")
     .expect(200)
     .then(({ body }) => {
       const articles = body.articles;
       expect(articles).toBeSortedBy("author", { ascending: true });
     });
 });


 test("400: Responds with 'Bad Request' for invalid sort_by column", () => {
   return request(app)
     .get("/api/articles?sort_by=invalid_column")
     .expect(400)
     .then(({ body }) => {
       expect(body.msg).toBe("Bad Request");
     });
 });


 test("400: Responds with 'Bad Request' for invalid order value", () => {
   return request(app)
     .get("/api/articles?sort_by=title&order=invalid_order")
     .expect(400)
     .then(({ body }) => {
       expect(body.msg).toBe("Bad Request");
     });
 });
 test("200: Responds with an array of article objects filtered by author", () => {
   return request(app)
     .get("/api/articles?author=rogersop")
     .expect(200)
     .then(({ body }) => {
       const articles = body.articles;
       expect(articles).toBeSortedBy("created_at", {descending: true});
       expect(articles).toHaveLength(3);
       articles.forEach((article) => {
         expect(article).toMatchObject({
           author: "rogersop"
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
test("404: Responds with 'This article ID does not exist' for non-existent article id", () => {
   return request(app)
       .get("/api/articles/999/comments")
       .expect(404)
       .then(({ body }) => {
           expect(body.msg).toBe("This article ID does not exist.");
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
 test("404: Responds with 'This article ID does not exist.' for non-existent article id", () => {
   const newCommentData = {
       username: "rogersop",
       body: "What a lovely day!"
   };
   return request(app)
       .post("/api/articles/9999/comments")
       .send(newCommentData)
       .expect(404)
       .then(({ body }) => {
           expect(body.msg).toBe("This article ID does not exist.");
       });
 });
});


describe("PATCH /api/articles/:article_id", () => {
 test("200: Updates the article votes and responds with the updated article", () => {
   return request(app)
       .patch("/api/articles/1")
       .send({ inc_votes: -5 })
       .expect(200)
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
         .send({ inc_votes: 5 })
         .expect(400)
         .then(({ body }) => {
             expect(body.msg).toBe("Bad Request");
         });
 });


 test("404: Responds with 'This article ID does not exist' for non-existent article id", () => {
     return request(app)
         .patch("/api/articles/9999")
         .send({ inc_votes: 5 })
         .expect(404)
         .then(({ body }) => {
             expect(body.msg).toBe("This article ID does not exist.");
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
 test("400: Responds with 'Bad Request' for invalid article id", () => {
   return request(app)
       .patch("/api/articles/1")
       .send({})
       .expect(400)
       .then(({ body }) => {
           expect(body.msg).toBe("Bad Request");
       });
 });
});
    
describe("DELETE /api/comments/:comment_id", () => {
 test("204: should return the deleted specific comment by the given comment_id and send no body back", () => {
   return request(app)
     .delete("/api/comments/1")
     .expect(204)
     .then(async () => {
       const targetComment = await db.query("SELECT * FROM comments WHERE comment_id = 1");
       expect(targetComment.rows).toEqual([]);
     });
 });
 test("400: Responds with 'Bad Request' for invalid comment id", () => {
   return request(app)
       .delete("/api/comments/not-a-valid-id")
       .expect(400)
       .then(({ body }) => {
           expect(body.msg).toBe("Bad Request");
       });
 });


 test("404: Responds with 'This comment ID does not exist.' for non-existent comment id", () => {
   return request(app)
       .delete("/api/comments/999")
       .expect(404)
       .then(({ body }) => {
           expect(body.msg).toBe("This comment ID does not exist.");
       });
 });
});


describe("GET /api/users", () => {
 test("200: Responds with an array of user objects", () => {
   return request(app)
     .get("/api/users")
     .expect(200)
     .then(({ body }) => {
       const users = body.userArr;
       expect(users).toHaveLength(4);
       users.forEach((user) => {
         expect(user).toMatchObject({
           username: expect.any(String),
           name: expect.any(String),
           avatar_url: expect.any(String)
         });
       });
     });
 });
 test("200: Responds with an array of users sorted by valid column", () => {
   return request(app)
     .get("/api/users?sort_by=username")
     .expect(200)
     .then(({ body }) => {
       const users = body.userArr;
       expect(users).toBeSortedBy("username", { descending: true });
     });
 });


 test("200: Responds with an array of users sorted by valid column in ascending order", () => {
   return request(app)
     .get("/api/users?sort_by=name&order=asc")
     .expect(200)
     .then(({ body }) => {
       const users = body.userArr;
       expect(users).toBeSortedBy("name", { ascending: true });
     });
 });


 test("400: Responds with 'Bad Request' for invalid sort_by column", () => {
   return request(app)
     .get("/api/articles?sort_by=invalid_column")
     .expect(400)
     .then(({ body }) => {
       expect(body.msg).toBe("Bad Request");
     });
 });


 test("400: Responds with 'Bad Request' for invalid order value", () => {
   return request(app)
     .get("/api/articles?sort_by=title&order=invalid_order")
     .expect(400)
     .then(({ body }) => {
       expect(body.msg).toBe("Bad Request");
     });
 });
});


describe("GET /api/users/:username", () => {
 test("200: Responds with an user object", () => {
   return request(app)
     .get("/api/users/lurker")
     .expect(200)
     .then(({ body }) => {
       const user = body.userArr[0]
         expect(user).toMatchObject({
           username: 'lurker',
           name: 'do_nothing',
           avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
         });
     });
 });
  test("404: Responds with 'This username does not exist.'", () => {
   return request(app)
     .get("/api/users/winnie")
     .expect(404)
     .then(({ body }) => {
         expect(body.msg).toBe("This username does not exist.");
     });
 });
});
