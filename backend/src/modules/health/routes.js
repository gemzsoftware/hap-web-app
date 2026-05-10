export async function healthRoutes(app) {
  app.get('/', async () => ({
    status: 'ok',
    service: 'hap-web-app',
    name: 'hap-web-app-backend'
  }));
}
