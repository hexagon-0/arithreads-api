import { client } from "./jest.setup";

describe('Root', function () {
  it('should return hello world', async function () {
    const response = await client.get('/')
      .expect(200);

    expect(response.body).toEqual({ 'hello': 'world' });
  })
});

describe('users', function () {
  describe('create', function () {
    it('should create a user', async function () {
      const response = await client.post('/users/')
        .send({
          username: 'lucas',
          password: '01234567',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');

      expect(response.body).toMatchObject({ username: 'lucas' });
    });

    it('should validate the request body', async function () {
      const response = await client.post('/users/')
        .send({
          username: "me",
          password: "123",
        })
        .expect(400);
      
      expect(response.body).toEqual([
        "username must be at least 3 characters",
        "password must be at least 8 characters",
      ]);
    });
  });
});
