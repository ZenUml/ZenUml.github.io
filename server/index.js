const compression = require('compression');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const path = require('path');
const user = require('./user');
const github = require('./github');
const pdf = require('./pdf');
const pandoc = require('./pandoc');

const resolvePath = pathToResolve => path.join(__dirname, '..', pathToResolve);

module.exports = (app, serveV4) => {
  // Use gzip compression
  if (process.env.NODE_ENV === 'production') {
    app.all('*', (req, res, next) => {
      // Force HTTPS on stackedit.io
      if (req.headers.host === 'stackedit.io' && !req.secure && req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect(`https://stackedit.io${req.url}`);
        return;
      }
      // Enable CORS for fonts
      if (/\.(eot|ttf|woff|svg)$/.test(req.url)) {
        res.header('Access-Control-Allow-Origin', '*');
      }
      next();
    });

    app.use(compression());
  }

  app.get('/oauth2/githubToken', github.githubToken);
  app.get('/userInfo', user.userInfo);
  app.post('/pdfExport', pdf.generate);
  app.post('/pandocExport', pandoc.generate);
  app.post('/paypalIpn', bodyParser.urlencoded({
    extended: false,
  }), user.paypalIpn);

  if (serveV4) {
    /* eslint-disable global-require, import/no-unresolved */
    app.post('/sshPublish', require('../stackedit_v4/app/ssh').publish);
    app.post('/picasaImportImg', require('../stackedit_v4/app/picasa').importImg);
    app.get('/downloadImport', require('../stackedit_v4/app/download').importPublic);
    /* eslint-enable global-require, import/no-unresolved */
  }

  // Serve callback.html
  app.get('/oauth2/callback', (req, res) => res.sendFile(resolvePath('static/oauth2/callback.html')));
  // Google Drive action receiver
  app.get('/googleDriveAction', (req, res) =>
    res.redirect(`./app#providerId=googleDrive&state=${encodeURIComponent(req.query.state)}`));

  // Serve static resources
  if (process.env.NODE_ENV === 'production') {
    if (serveV4) {
      // Serve editor.html in /viewer
      app.get('/editor', (req, res) => res.sendFile(resolvePath('stackedit_v4/views/editor.html')));
      // Serve viewer.html in /viewer
      app.get('/viewer', (req, res) => res.sendFile(resolvePath('stackedit_v4/views/viewer.html')));
    }

    // Serve app.html in /app
    app.get('/app', (req, res) => res.sendFile(resolvePath('app.html')));

    // Serve style.css with 1 day max-age
    app.get('/style.css', (req, res) => res.sendFile(resolvePath('dist/style.css'), {
      maxAge: '1d',
    }));

    // Serve the static folder with 1 year max-age
    app.use('/static', serveStatic(resolvePath('dist/static'), {
      maxAge: '1y',
    }));

    app.use(serveStatic(resolvePath('dist')));

    if (serveV4) {
      app.use(serveStatic(path.dirname(resolvePath('stackedit_v4/public/cache.manifest'))));

      // Error 404
      app.use((req, res) => res.status(404).sendFile(resolvePath('stackedit_v4/views/error_404.html')));
    }
  }
};
