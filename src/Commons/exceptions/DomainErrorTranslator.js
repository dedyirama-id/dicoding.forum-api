const AuthorizationError = require('./AuthorizationError');
const InvariantError = require('./InvariantError');
const NotFoundError = require('./NotFoundError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  /* ENTITIES */
  // RegisterUser Entity
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),

  // UserLogin Entity
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),

  // NewThread Entity
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan title, body, dan owner'),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('title, body, dan owner harus string'),

  // NewComment Entity
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan content, owner, dan threadId'),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('content, userId, dan threadId harus string'),

  /* USE CASE */
  // RefreshAuthenticationUseCase
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),

  // DeleteAuthenticationUseCase
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),

  // AddThreadUseCase
  'ADD_THREAD_USE_CASE.INVALID_USER_ID': new InvariantError('thread owner tidak terdaftar'),

  // DeleteCommentUseCase
  'DELETE_COMMENT_USE_CASE.USER_ID_DO_NOT_MATCH': new AuthorizationError('user bukan pemilik komentar'),
  'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan userId dan commentId'),
  'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('userId dan commentId harus string'),

  // GetThreadDetailsUseCase
  'GET_THREAD_DETAILS_USE_CASE.NOT_CONTAIN_THREAD_ID': new NotFoundError('threadId tidak terdaftar'),
  'GET_THREAD_DETAILS_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('threadId harus string'),
};

module.exports = DomainErrorTranslator;
