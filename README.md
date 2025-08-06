# Weather API

Una API REST en Node.js/Express que provee datos meteorológicos por ciudad, consumiendo la API de Visual Crossing y usando Redis para caché.

## Características

- **Datos meteorológicos en tiempo real** mediante Visual Crossing API.
- **Sistema de caché con Redis** para reducir llamadas a la API externa.
- **Rate limiting** configurable para proteger contra abuso.
- **Validación robusta** de parámetros de entrada.
- **Manejo de errores** estructurado y consistente.
- **Middlewares de seguridad** con CORS y Helmet.
- **Logging** de peticiones para monitoreo.

## Estructura de archivos

```bash
weather-api/
├── src/
│   ├── config/
│   │   └── redisConnection.js    # Configuración cliente Redis
│   ├── controllers/
│   │   └── weatherController.js  # Lógica de controladores
│   ├── middlewares/
│   │   ├── rateLimiter.js       # Limitación de peticiones
│   │   ├── security.js          # Middlewares de seguridad
│   │   └── validateCity.js      # Validación de parámetros
│   ├── services/
│   │   ├── weatherService.js    # Servicio API externa
│   │   └── cacheService.js      # Servicio de caché Redis
│   └── routes/
│       └── weather.js           # Definición de rutas
│   └── app.js/                  # Aplicación principal Express
├── .env.example                 # Variables de entorno ejemplo
├── .gitignore                   # Archivos ignorados por Git
└── package.json                 # Dependencias y scripts
```

## Tecnologías usadas

- **Node.js**  
- **Express**  
- **Redis** (cliente `redis`)  
- **Axios** (HTTP client)  
- **express-rate-limit**  
- **express-validator**  
- **CORS**, **Helmet**, **Morgan**  
- **dotenv** (configuración de entorno)  

## Cómo ejecutar

### Clonar el repositorio

```bash
git clone <repository-url>
cd weather-api
```

### Instala dependencias

`npm install`

### Configurar variables de entorno

`cp .env.example .env`

### Editar `.env` con tus valores

```env
PORT=3000
API_KEY=your_visual_crossing_api_key_here
CLIENT_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
CACHE_EXPIRATION=43200
RATE_LIMIT_WINDOW=600000
RATE_LIMIT_CITY=300000
RATE_LIMIT_MAX=25
REDIS_TTL=43200
```

### Arranca Redis localmente o configura REDIS_URL hacia un servicio cloud.

`redis-server`

### Levanta la API en modo desarrollo:

`npm run dev`

### En producción:

`npm start`

### Accede a:

`GET / → Bienvenida`

`GET /status → Health check`

`GET /weather/:city → Datos de clima (e.g. /weather/Madrid)`

## Descripción de endpoints

| Endpoint	| Método	| Parámetros	| Descripción	|
| ----------| ----------|---------------|---------------|
| /	| GET	—	| Mensaje de bienvenida| - | - |
| /status	| GET	—	| Estado de la API y timestamp | - | - |
| /weather/:city	|  GET	:city (string)	| Clima actual de la ciudad, cache-first con Redis | - | - |

## Seguridad y Rate Limiting

### Rate Limiting

- **General**: 25 peticiones por IP cada 10 minutos
- **Weather endpoint**: 25 peticiones por IP cada 5 minutos

### Middlewares de Seguridad

- **CORS**: Configurado para orígenes específicos
- **Helmet**: Headers de seguridad HTTP
- **Validación**: Sanitización de parámetros de entrada

### Validación de Ciudad

- **Longitud**: 2-25 caracteres
- **Caracteres permitidos**: letras, espacios, guiones, acentos
- **Sanitización** automática contra XSS

### Caché Redis

- **TTL**: 12 horas por defecto
- **Patrón de keys**: `weather:ciudad`
- **Serialización**: JSON automática
- **Fallback**: API directa si Redis falla

## Ejemplos de uso

```bash
# Obtener clima de Madrid
curl -X GET "http://localhost:3000/weather/madrid"

# Verificar estado de la API
curl -X GET "http://localhost:3000/status"
```

## Fases de desarrollo

- **Configuración inicial**: Node.js, Express, estructura de carpetas, variables de entorno.

- **API básica (hardcoded)**: Ruta /weather/:city con datos ficticios.

- **Integración externa**: Servicio weatherService con Axios y Visual Crossing.

- **Caché**: Cliente Redis, cacheService con getCache, setCache, TTL 12h.

- **Seguridad**: Rate limiting global y por endpoint, CORS, Helmet, Morgan.

- **Validación**: validateCity con express-validator.

## Tips y buenas prácticas

- **Desacopla lógica**: Controladores solo orquestan; servicios manejan API y caché.

- **Cache-first**: Reduce latencia y uso de cuotas en la API externa.

- **Variables de entorno**: Nunca hardcodees claves ni URLs sensibles.

- **Rate limiting**: Protege tu API de abusos y DoS.

- **Validación y sanitización**: Evita inyecciones y entradas maliciosas.

- **Logging**: Usa Morgan y logs de errores para facilitar debugging.

- **CSP y Helmet**: Asegura cabeceras HTTP y política de contenido.

## Licencia

Este proyecto está bajo la Licencia MIT - ver archivo [LICENSE](./LICENSE) para detalles.

##  Autor

Sergio Jiménez de la Cruz

- [Github](https://github.com/DjSurgeon)
- [Linkedin](https://www.linkedin.com/in/sergiojimenez42dev/)
- [Email](djsurgeon83@gmail.com)
