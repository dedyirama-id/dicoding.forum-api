const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentToThreadByThreadIdHandler = this.postCommentToThreadByThreadIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const owner = request.auth.credentials.id;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentToThreadByThreadIdHandler(request, h) {
    const { threadId } = request.params;
    const owner = request.auth.credentials.id;
    const { content } = request.payload;

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const addedComment = await addCommentUseCase.execute({
      content,
      owner,
      threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
