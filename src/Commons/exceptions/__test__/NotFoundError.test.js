const NotFoundError = require('../NotFoundError');

describe('Authentication Error', () => {
  it('Should create authentication error correctly', () => {
    const notFoundError = new NotFoundError('not found!');

    expect(notFoundError.statusCode).toEqual(404);
    expect(notFoundError.message).toEqual('not found!');
    expect(notFoundError.name).toEqual('NotFoundError');
  });
});
