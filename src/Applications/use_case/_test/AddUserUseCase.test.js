const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUsername = jest.fn().mockResolvedValue();
    mockPasswordHash.hash = jest.fn().mockResolvedValue('encrypted_password');
    mockUserRepository.addUser = jest.fn().mockResolvedValue(mockRegisteredUser);

    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(new RegisteredUser({
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    }));

    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith('dicoding');
    expect(mockPasswordHash.hash).toBeCalledWith('secret');
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: 'dicoding',
      password: 'encrypted_password',
      fullname: 'Dicoding Indonesia',
    }));
    expect(mockUserRepository.addUser).toBeCalledTimes(1);
  });

  it('should throw error when username is not available', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUsername = jest.fn().mockRejectedValue(new Error());
    mockPasswordHash.hash = jest.fn();

    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action & Assert
    await expect(getUserUseCase.execute(useCasePayload)).rejects.toThrowError();
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith('dicoding');
    expect(mockPasswordHash.hash).not.toBeCalled();
  });
});
