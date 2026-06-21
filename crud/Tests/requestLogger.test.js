import { jest } from '@jest/globals';

import { getLogLevel, requestLogger } from '../src/middlewares/requestLogger.middleware.js';

describe('getLogLevel', () => {

  test('debería devolver info para status codes menores a 400', () => {
    expect(getLogLevel(200)).toBe('info');
    expect(getLogLevel(201)).toBe('info');
  });

  test('debería devolver warn para status codes desde 400 hasta 499', () => {
    expect(getLogLevel(400)).toBe('warn');
    expect(getLogLevel(404)).toBe('warn');
  });

  test('debería devolver error para status codes desde 500', () => {
    expect(getLogLevel(500)).toBe('error');
  });

});

describe('requestLogger middleware', () => {
  
  test('debería registrar el evento finish y llamar a next', () => {
    const req = {
      method: 'GET',
      originalUrl: '/api/products',
      reqId: 'test-req-id',
    };

    //on es un metodo dentro del middleware
    const res = {
      on: jest.fn(),
      statusCode: 200,
    };

    const next = jest.fn();

    requestLogger(req, res, next);

    //Espero que res.on haya sido llamado con el evento 'finish' y una función.
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    //Espero que next haya sido llamado una vez.
    expect(next).toHaveBeenCalledTimes(1);
  });
});