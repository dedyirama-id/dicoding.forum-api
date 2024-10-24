const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forum_api_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadByIdHandler,
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentToThreadByThreadIdHandler,
    options: {
      auth: 'forum_api_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentByIdHandler,
    options: {
      auth: 'forum_api_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postCommentRepliesByCommentIdAndThreadId,
    options: {
      auth: 'forum_api_jwt',
    },
  },
]);

module.exports = routes;
