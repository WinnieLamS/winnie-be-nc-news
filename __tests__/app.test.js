const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");


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
    
    test("ERROR - responds with an error when endpoint is not exsit", () => {
        return request(app)
        .get("/api/2")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Route Not Found")
        })
    })
});
  