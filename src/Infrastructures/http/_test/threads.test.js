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
      expect(responseJson.status).toBe('fail');
      expect(responseJson.message).toBeDefined();
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
      const { addedThread } = JSON.parse(threadResponse.payload).data;
      const requestPayload = {
        content: 'lorem ipsum',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
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
      const { addedThread } = JSON.parse(threadResponse.payload).data;

      const requestPayload = {
        notContent: 'lorem ipsum',
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
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toBe('fail');
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
      const { addedThread } = JSON.parse(threadResponse.payload).data;
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

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 403 when delete comment with wrong authorization', async () => {
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
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding2',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const auth1Response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const auth2Response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'secret',
        },
      });

      const { accessToken: accessToken1 } = JSON.parse(auth1Response.payload).data;
      const { accessToken: accessToken2 } = JSON.parse(auth2Response.payload).data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'New title',
          body: 'lorem ipsum',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      const { addedThread } = JSON.parse(threadResponse.payload).data;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 'lorem ipsum',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      const { addedComment } = JSON.parse(commentResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toBe('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 404 when delete invalid comment id', async () => {
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

      const { accessToken } = JSON.parse(authResponse.payload).data;

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

      const { addedThread } = JSON.parse(threadResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/wrong-comment-id`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toBe('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 200', async () => {
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

      const { accessToken } = JSON.parse(authResponse.payload).data;

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

      const { addedThread } = JSON.parse(threadResponse.payload).data;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 'lorem ipsum',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { addedComment } = JSON.parse(commentResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toBe('success');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread details correctly', async () => {
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

      const { accessToken } = JSON.parse(authResponse.payload).data;

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

      const { addedThread } = JSON.parse(threadResponse.payload).data;

      await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'First comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'Second comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(addedThread.id);
      expect(responseJson.data.thread.comments).toHaveLength(2);
    });

    it('should response 404 when thread is not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-not-found',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401 when add reply with wrong authorization', async () => {
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
      const { accessToken } = JSON.parse(authResponse.payload).data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'New title', body: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedThread } = JSON.parse(threadResponse.payload).data;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedComment } = JSON.parse(commentResponse.payload).data;

      const requestPayload = { content: 'sebuah balasan' };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toBeDefined();
    });

    it('should response 400 when add reply with invalid payload', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { accessToken } = JSON.parse(authResponse.payload).data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'New title', body: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedThread } = JSON.parse(threadResponse.payload).data;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedComment } = JSON.parse(commentResponse.payload).data;

      const requestPayload = { invalidContent: 'sebuah balasan' };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toBe('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 201 and persisted reply', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { accessToken } = JSON.parse(authResponse.payload).data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'New title', body: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedThread } = JSON.parse(threadResponse.payload).data;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedComment } = JSON.parse(commentResponse.payload).data;

      const requestPayload = { content: 'sebuah balasan' };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 when successfully delete reply', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { accessToken } = JSON.parse(authResponse.payload).data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'New title', body: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedThread } = JSON.parse(threadResponse.payload).data;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedComment } = JSON.parse(commentResponse.payload).data;

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: { content: 'sebuah balasan' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedReply } = JSON.parse(replyResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies/${addedReply.id}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when trying to delete reply by non-owner', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'dicoding1', password: 'secret', fullname: 'Dicoding Indonesia' },
      });
      const authResponse1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding1', password: 'secret' },
      });
      const { accessToken: accessToken1 } = JSON.parse(authResponse1.payload).data;

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'dicoding2', password: 'secret', fullname: 'Dicoding Indonesia' },
      });
      const authResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding2', password: 'secret' },
      });
      const { accessToken: accessToken2 } = JSON.parse(authResponse2.payload).data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'New title', body: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken1}` },
      });
      const { addedThread } = JSON.parse(threadResponse.payload).data;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken1}` },
      });
      const { addedComment } = JSON.parse(commentResponse.payload).data;

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: { content: 'sebuah balasan' },
        headers: { Authorization: `Bearer ${accessToken1}` },
      });
      const { addedReply } = JSON.parse(replyResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies/${addedReply.id}`,
        headers: { Authorization: `Bearer ${accessToken2}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 404 when reply does not exist', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { accessToken } = JSON.parse(authResponse.payload).data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'New title', body: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedThread } = JSON.parse(threadResponse.payload).data;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedComment } = JSON.parse(commentResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies/non-existent-reply`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and like comment when user is not like the comment', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' },
      });
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { accessToken } = JSON.parse(authResponse.payload).data;

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'New title', body: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedThread } = JSON.parse(threadResponse.payload).data;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: 'lorem ipsum' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { addedComment } = JSON.parse(commentResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
