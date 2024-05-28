const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");


afterAll(() => {
    return db.end();
  });
  
  beforeEach(() => {
    return seed(data);
  });

  describe("GET topics", () => {
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
  

describe("GET endpoints", () => {
    test("200: An object describing all the available endpoints on API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            console.log(body);
            expect(body).toEqual(endpoints);
        });
    });
});