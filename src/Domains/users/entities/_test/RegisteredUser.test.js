const RegisteredUser = require('../RegisteredUser');

describe('a RegisteredUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };
    const payload2 = {
      id: 'user-123',
      fullname: 'Dicoding Indonesia',
    };
    const payload3 = {
      id: 'user-123',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new RegisteredUser(payload1)).toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new RegisteredUser(payload2)).toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new RegisteredUser(payload3)).toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };
    const payload2 = {
      id: 'user-123',
      username: 123,
      fullname: 'Dicoding Indonesia',
    };
    const payload3 = {
      id: 'user-123',
      username: 123,
      fullname: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new RegisteredUser(payload1)).toThrowError('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new RegisteredUser(payload2)).toThrowError('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new RegisteredUser(payload3)).toThrowError('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create registeredUser object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };

    // Action
    const registeredUser = new RegisteredUser(payload);

    // Assert
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});
