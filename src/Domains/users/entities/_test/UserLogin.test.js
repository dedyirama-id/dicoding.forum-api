const UserLogin = require('../UserLogin');

describe('UserLogin entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload1 = {
      password: 'secret',
    };
    const payload2 = {
      username: 'dicoding',
    };

    // Action & Assert
    expect(() => new UserLogin(payload1)).toThrowError('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new UserLogin(payload2)).toThrowError('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload1 = {
      username: 123,
      password: 'secret',
    };
    const payload2 = {
      username: 'dicoding',
      password: 123,
    };

    // Action & Assert
    expect(() => new UserLogin(payload1)).toThrowError('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new UserLogin(payload2)).toThrowError('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create UserLogin entities correctly', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: '12345',
    };

    // Action
    const userLogin = new UserLogin(payload);

    // Assert
    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
