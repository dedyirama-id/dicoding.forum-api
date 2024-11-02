const NewAuth = require('../NewAuth');

describe('NewAuth entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload1 = {
      refreshToken: 'refreshToken',
    };
    const payload2 = {
      accessToken: 'accessToken',
    };

    // Action & Assert
    expect(() => new NewAuth(payload1)).toThrowError('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewAuth(payload2)).toThrowError('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload1 = {
      accessToken: 123,
      refreshToken: 'refreshToken',
    };
    const payload2 = {
      accessToken: 'accessToken',
      refreshToken: 123,
    };

    // Action & Assert
    expect(() => new NewAuth(payload1)).toThrowError('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new NewAuth(payload2)).toThrowError('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewAuth entities correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    // Action
    const newAuth = new NewAuth(payload);

    // Assert
    expect(newAuth).toBeInstanceOf(NewAuth);
    expect(newAuth.accessToken).toEqual('accessToken');
    expect(newAuth.refreshToken).toEqual('refreshToken');
  });
});
