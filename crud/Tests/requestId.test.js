import { jest } from '@jest/globals';
import { requestId } from '../src/middlewares/requestId.middleware.js';

describe('requestId middleware', () => {

  test('debería agregar un reqId a la request', () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    requestId(req, res, next);

    expect(req.reqId).toBeDefined();
    expect(typeof req.reqId).toBe('string');
  });

  test('debería llamar a next para continuar el flujo', () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    requestId(req, res, next);

    //Espero que next haya sido llamado una vez.
    expect(next).toHaveBeenCalledTimes(1);
  });

});