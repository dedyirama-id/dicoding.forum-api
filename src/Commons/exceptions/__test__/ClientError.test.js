const ClientError = require('../ClientError');

describe('Client Error', () => {
  it('Should throw error when directly use it', () => {
    expect(() => new ClientError()).toThrow('cannot instantiate abstract class');
  });
});
