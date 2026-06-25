import { jest } from '@jest/globals';

jest.unstable_mockModule('dotenv', () => ({
  config: () => {},
  default: {
    config: () => {}
  }
}));

const originalEnv = process.env;


//Esta función nos permite cargar env.js con distintas variables de entorno.
async function loadEnv(customEnv = {}, keysToDelete = []) {
  //Limpia el cache de módulos de Jest.
  //Esto es importante porque queremos importar env.js de nuevo en cada test.
  jest.resetModules();

  //Usamos las variables originales y pisamos solo las que necesitamos para ese caso.
  process.env = {
    ...originalEnv,
    ...customEnv,
  };

  //Esto nos permite probar qué pasa cuando una variable no existe.
  keysToDelete.forEach((key) => {
    delete process.env[key];
  });

  //Importamos env.js después de preparar process.env.
  const { env } = await import('../src/config/enviroment.js');

  return env;
};

//Después de cada test, volvemos a dejar process.env como estaba.
//Esto evita que un test contamine al siguiente.
afterEach(() => {
  process.env = originalEnv;
  jest.resetModules();
});

describe('env config', () => {

  test('deberia convertir PORT a number', async () => {
    const env = await loadEnv({ PORT: '8080' });

    expect(env.port).toBe(8080);
  });

  test('debería usar 8080 como puerto por defecto si PORT no existe', async () => {
    //Al enviarlo PORT le estamos diciendo que elimine esa variable de entorno asi toma el valor por defecto
    const env = await loadEnv({}, ['PORT']);

    expect(env.port).toBe(8080);
  });

  test('debería interpretar MAINTENANCE=true como boolean true', async () => {
    const env = await loadEnv({ MAINTENANCE: 'true' });

    expect(env.maintenance).toBe(true);
  });

  test('debería interpretar NODE_ENV=production como isProd true', async () => {
    const env = await loadEnv({ NODE_ENV: 'production' });

    expect(env.isProd).toBe(true);
  });

  test('debería convertir CLUSTER_WORKERS a número', async () => {
    const env = await loadEnv({ CLUSTER_WORKERS: '4' });

    expect(env.workers).toBe(4);
  });

  test('debería usar fallbacks para variables no provistas', async () => {
    const env = await loadEnv({}, ['BASE_URL', 'CLUSTER_WORKERS', 'NODE_ENV', 'Tienda', 'TIENDA', 'MAINTENANCE']);

    expect(env.BASE_URL).toBe('http://localhost:8080');
    expect(env.workers).toBe(2);
    expect(env.NODE_ENV).toBe('development');
    expect(env.TIENDA).toBe('Tienda El Bar del Fondo');
    expect(env.MAINTENANCE).toBe(false);
  });

  test('debería preferir Tienda sobre TIENDA', async () => {
    const env = await loadEnv({ Tienda: 'Tienda Custom', TIENDA: 'TIENDA UPPER' });
    expect(env.TIENDA).toBe('Tienda Custom');
  });

  test('debería usar TIENDA si Tienda no está definida', async () => {
    const env = await loadEnv({ TIENDA: 'TIENDA ONLY' }, ['Tienda']);
    expect(env.TIENDA).toBe('TIENDA ONLY');
  });

  test('debería limpiar comillas simples y dobles de las variables de entorno', async () => {
    const env = await loadEnv({ 
      PORT: '"9090"',
      BASE_URL: "'http://custom-url.com'"
    });

    expect(env.port).toBe(9090);
    expect(env.BASE_URL).toBe('http://custom-url.com');
  });

});