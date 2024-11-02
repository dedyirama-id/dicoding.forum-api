const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordHash = require('../../security/PasswordHash');
const LoginUserUseCase = require('../LoginUserUseCase');
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');

describe('LoginUserUseCase', () => {
  it('should orchestrate the login user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.getPasswordByUsername = jest.fn().mockResolvedValue('encrypted_password');
    mockPasswordHash.comparePassword = jest.fn().mockResolvedValue(true); // Pastikan ini mengembalikan true untuk menunjukkan password cocok
    mockAuthenticationTokenManager.createAccessToken = jest.fn().mockResolvedValue(mockedAuthentication.accessToken);
    mockAuthenticationTokenManager.createRefreshToken = jest.fn().mockResolvedValue(mockedAuthentication.refreshToken);
    mockUserRepository.getIdByUsername = jest.fn().mockResolvedValue('user-123');
    mockAuthenticationRepository.addToken = jest.fn().mockResolvedValue();

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual(new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    }));
    expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith('dicoding');
    expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith('dicoding');
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith(mockedAuthentication.refreshToken);
  });
});
