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
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentToThreadByThreadIdHandler,
    options: {
      auth: 'forum_api_jwt',
    },
  },
]);

module.exports = routes;
