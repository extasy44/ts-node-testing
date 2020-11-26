import { Authorizer } from '../../app/Authorization/Authorizer';
import { SessionTokenDBAccess } from '../../app/Authorization/SessionTokenDBAccess';
import { UserCredentialsDbAccess } from '../../app/Authorization/UserCredentialsDbAccess';
import { SessionToken, Account } from '../../app/Models/ServerModels';

jest.mock('../../app/Authorization/SessionTokenDBAccess');
jest.mock('../../app/Authorization/UserCredentialsDbAccess');

const someAccount: Account = {
  username: 'someuser',
  password: 'password',
};

describe('Authorizer test suite', () => {
  let authorizer: Authorizer;

  const sessionTokenDBAccessMock = {
    storeSessionToken: jest.fn(),
  };

  const userCredentialsDBAccessMock = {
    getUserCredential: jest.fn(),
  };

  beforeEach(() => {
    authorizer = new Authorizer(
      sessionTokenDBAccessMock as any,
      userCredentialsDBAccessMock as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('constructor arguments', () => {
    new Authorizer();
    expect(SessionTokenDBAccess).toBeCalledTimes(1);
    expect(UserCredentialsDbAccess).toBeCalledTimes(1);
  });

  describe('login user tests suite', () => {
    test('should return null if invalid credentials', async () => {
      userCredentialsDBAccessMock.getUserCredential.mockReturnValue(null);
      const loginResult = await authorizer.generateToken(someAccount);
      expect(loginResult).toBeNull;
      expect(userCredentialsDBAccessMock.getUserCredential).toBeCalledWith(
        someAccount.username,
        someAccount.password
      );
    });

    test('should return session token for valid credentials', async () => {
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0);
      jest.spyOn(global.Date, 'now').mockReturnValueOnce(0);
      userCredentialsDBAccessMock.getUserCredential.mockReturnValue({
        accessRights: [1, 2, 3],
        username: 'someUser',
        password: 'somePassword',
      });
      const expectedSessionToken: SessionToken = {
        accessRights: [1, 2, 3],
        userName: 'someUser',
        valid: true,
        expirationTime: new Date(1000 * 60 * 60),
        tokenId: '',
      };
      const sessionToken = await authorizer.generateToken(someAccount);
      expect(expectedSessionToken).toStrictEqual(sessionToken);
      expect(sessionTokenDBAccessMock.storeSessionToken).toHaveBeenCalledWith(
        sessionToken
      );
    });
  });

  test('should return sessionToken for valid credentials', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValueOnce(0);
    jest.spyOn(global.Date, 'now').mockReturnValueOnce(0);
    userCredentialsDBAccessMock.getUserCredential.mockResolvedValueOnce({
      username: 'someuser',
      accessRight: [1, 2, 3],
    });

    const expectedSessionToken: SessionToken = {
      userName: 'someuser',
      accessRights: [1, 2, 3],
      valid: true,
      tokenId: '',
      expirationTime: new Date(60 * 60 * 1000),
    };

    const sessionToken = await authorizer.generateToken(someAccount);

    expect(expectedSessionToken).toEqual(sessionToken);
    expect(sessionTokenDBAccessMock.storeSessionToken).toBeCalledWith(
      SessionTokenDBAccess
    );
  });
});
