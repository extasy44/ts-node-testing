import { Utils } from '../app/Utils';

describe('Utils test suite', () => {
  test('first test', () => {
    const result = Utils.toUpperCase('abc');
    expect(result).toBe('ABC');
  });

  test('parse simple URL', () => {
    const parsedUrl = Utils.parseUrl('http://localhost:8080/login');
    expect(parsedUrl.href).toBe('http://localhost:8080/login');
    expect(parsedUrl.port).toBe('8080');
    expect(parsedUrl.protocol).toBe('http:');
  });
});
