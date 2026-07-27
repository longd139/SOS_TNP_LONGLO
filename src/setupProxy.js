// ============================================================
// CRA DEV PROXY — bypass CORS khi gọi API từ localhost
// Request /api-gis/* → api-gisxaydung.tphcm.gov.vn/*
// ============================================================
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api-gis',
    createProxyMiddleware({
      target: 'https://api-gisxaydung.tphcm.gov.vn',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/api-gis': '' },  // ← Bỏ prefix /api-gis trước khi forward
      on: {
        proxyReq: (proxyReq, req) => {
          // Forward Bearer token từ client lên API gốc
          const auth = req.headers['x-gis-auth'] || req.headers['authorization'];
          if (auth) {
            proxyReq.setHeader('Authorization', auth.startsWith('Bearer ') ? auth : `Bearer ${auth}`);
          }
          // Giả lập Referer/Origin
          proxyReq.setHeader('Referer', 'https://gisxaydung.tphcm.gov.vn/');
          proxyReq.setHeader('Origin', 'https://gisxaydung.tphcm.gov.vn');
          console.log(`[GIS Proxy] ${req.method} ${req.url} → ${proxyReq.path}`);
        },
        error: (err, req, res) => {
          console.error('[GIS Proxy Error]', err.message);
        },
      },
    })
  );
};
