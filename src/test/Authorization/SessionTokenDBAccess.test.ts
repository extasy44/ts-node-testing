import { SessionTokenDBAccess } from '../../app/Authorization/SessionTokenDBAccess';
import { SessionToken } from '../../app/Models/ServerModels';
import * as Nedb from 'nedb';
import { executionAsyncId } from 'async_hooks';
jest.mock('nedb');

describe('SessionTokenDBAccess test suite', () => {
  let sessionTokenDBAccess: SessionTokenDBAccess;

  const nedbMock = {
    loadDatabase: jest.fn(),
    insert: jest.fn(),
    find: jest.fn(),
  };

  const someToken: SessionToken = {
    accessRights: [1, 2, 3, 4],
    expirationTime: new Date(),
    valid: true,
    tokenId: 'oi3ob6s5hvg',
    userName: 'someuser',
  };

  beforeEach(() => {
    sessionTokenDBAccess = new SessionTokenDBAccess(nedbMock as any);
    expect(nedbMock.loadDatabase).toBeCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('store sessionToken without error', async () => {
    nedbMock.insert.mockImplementation((someToken: any, cb: any) => {
      cb();
    });

    await sessionTokenDBAccess.storeSessionToken(someToken);
    expect(nedbMock.insert).toBeCalledWith(someToken, expect.any(Function));
  });

  test('store sessionToken with error', async () => {
    nedbMock.insert.mockImplementation((someToken: any, cb: any) => {
      cb(new Error('something went wrong'));
    });

    await expect(
      sessionTokenDBAccess.storeSessionToken(someToken)
    ).rejects.toThrow();
    expect(nedbMock.insert).toBeCalledWith(someToken, expect.any(Function));
  });
});
