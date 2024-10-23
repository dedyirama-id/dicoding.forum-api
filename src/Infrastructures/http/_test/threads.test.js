const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  beforeAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 401 when add thread with wrong authorization', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {
        title: 'New title',
        body: 'lorem ipsum',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toBeDefined();
    });

    it('should response 400 when add thread with invalid payload', async () => {
      // Arrange
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authResponseJson = JSON.parse(authResponse.payload);
      const { accessToken } = authResponseJson.data;
      const requestPayload = {
        body: 'lorem ipsum',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.message).toBeDefined();
    });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authResponseJson = JSON.parse(authResponse.payload);
      const { accessToken } = authResponseJson.data;
      const requestPayload = {
        title: 'New title',
        body: 'lorem ipsum',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when add comment with wrong authorization', async () => {
      // Arrange
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authResponseJson = JSON.parse(authResponse.payload);
      const { accessToken } = authResponseJson.data;
      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'New title',
          body: 'lorem ipsum',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const requestPayload = {
        content: 'lorem ipsum',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/thread/${thread.id}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toBeDefined();
    });

    it('should response 400 when add comment with invalid payload', async () => {
      // Arrange
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authResponseJson = JSON.parse(authResponse.payload);
      const { accessToken } = authResponseJson.data;
      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'New title',
          body: 'lorem ipsum',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const requestPayload = {
        notContent: 'lorem ipsum',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.message).toBeDefined();
    });

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authResponseJson = JSON.parse(authResponse.payload);
      const { accessToken } = authResponseJson.data;
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'New title',
          body: 'lorem ipsum',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: threadData } = JSON.parse(threadResponse.payload);
      const { addedThread } = threadData;
      const requestPayload = {
        content: 'lorem ipsum',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });
});
