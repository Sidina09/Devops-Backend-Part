const express = require('express');
// const healthcheck = require('healthcheck');
const healthcheck = require('express-healthcheck');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors');
const rateLimit = require("express-rate-limit");

// const healthcheck = require('healthcheck');
// const { healthcheck } = require('healthcheck');
// const healthcheck = require('healthcheck').create()
// const { createTerminus } = require('@godaddy/terminus');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use(cors());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 5, // limite chaque IP à 5 requêtes par windowMs
  message: "Trop de requêtes de cette adresse IP, veuillez réessayer plus tard.",
});

// Appliquez le limiter à toutes les requêtes
// app.use(limiter);

// // Endpoint pour la sonde de démarrage (startupProbe)
// app.get('/health/startup', (req, res) => {
//   // Logique de vérification pour la sonde de démarrage
//   res.status(200).send('OK');
// });

// // Endpoint pour la sonde de vivacité (livenessProbe)
// app.get('/healthz', (req, res) => {
//   // Logique de vérification pour la sonde de vivacité
//   res.status(200).send('OK');
// });

// // Endpoint pour la sonde de disponibilité (readinessProbe)
// app.get('/ready', (req, res) => {
//   // Logique de vérification pour la sonde de disponibilité
//   // Assurez-vous que l'application est prête à gérer le trafic
//   res.status(200).send('OK');
// });

// app.use('/health', healthcheck());

// app.use('/health', healthcheck);

// Configuration de la sonde de démarrage (/health/startup)
app.use('/health/startup', (req, res, next) => {
  // Utiliser le middleware de santé avec la configuration
  healthcheck({
    healthy: function () {
      return { everything: 'is healthy' };
    }
  })(req, res, next);
});

// Configuration de la sonde de santé (/healthz)
app.use('/healthz', (req, res, next) => {
  // Utiliser le middleware de santé avec la configuration
  healthcheck({
    healthy: function () {
      return { Healthcheck: 'réussi' };
    },
  })(req, res, next);
});

// Configuration de la sonde de disponibilité (/ready)
app.use('/ready', (req, res, next) => {
  // Utiliser le middleware de santé avec la configuration
  healthcheck({
    healthy: function () {
      return { Application : 'est prête' };
    },
  })(req, res, next);
});

// Swagger configuration
const swaggerDefinition = {
  info: {
    title: 'Weather API',
    version: '1.0.0',
    description: 'API to manage weather information for cities',
  },
  basePath: '/',
};

const options = {
  swaggerDefinition,
  apis: ['./app.js'], // point to your API file(s)
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /weather:
 *   get:
 *     description: Get weather information for all cities
 *     responses:
 *       200:
 *         description: Successful response
 */

// // Healthcheck configuration
// const healthcheck = createTerminus(app, {
//   // Configuration pour /health/startup
//   '/health/startup': () => Promise.resolve(),
  
//   // Configuration pour /healthz
//   '/healthz': () => Promise.resolve(),

//   // Configuration pour /ready
//   '/ready': () => Promise.resolve(),
// });

// app.use('/health', healthcheck);

app.use('/weather', limiter);

app.get('/weather', (req, res) => {
    // Example weather data for cities
    const weatherData = [
      { city: 'Casablanca', temperature: '25°C', conditions: 'Sunny' },
      { city: 'Kenitra', temperature: '20°C', conditions: 'Cloudy' },
    ];
  
    res.json(weatherData);
  });

// /**
//  * @swagger
//  * /weather:
//  *   post:
//  *     description: Add weather information for a city
//  *     parameters:
//  *       - name: city
//  *         description: City name
//  *         in: body
//  *         required: true
//  *         type: string
//  *     responses:
//  *       201:
//  *         description: Weather information added successfully
//  */
// app.post('/weather', (req, res) => {
//   // Implementation to add weather information for a city
//   res.status(201).json({ message: 'Weather information added successfully' });
// });

// /**
//  * @swagger
//  * /weather/{city}:
//  *   delete:
//  *     description: Delete weather information for a city
//  *     parameters:
//  *       - name: city
//  *         description: City name
//  *         in: path
//  *         required: true
//  *         type: string
//  *     responses:
//  *       204:
//  *         description: Weather information deleted successfully
//  */
// app.delete('/weather/:city', (req, res) => {
//   // Implementation to delete weather information for a city
//   res.status(204).json({ message: 'Weather information deleted successfully' });
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
