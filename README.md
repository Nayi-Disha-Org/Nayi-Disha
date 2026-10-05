# Nayi-Disha

Nayi-Disha is a full-stack care and support platform designed to connect parents, caretakers, administrators, health professionals, and connected hardware through a single application.

The project combines a React frontend, an Express and PostgreSQL backend, and an ESP32-based hardware component. It provides authentication, role-based workflows, health and counseling services, routines, hardware connectivity, and a foundation for intelligent notifications and weather-aware features.

## Project goals

- Provide a central platform for families and caretakers.
- Support parent, caretaker, admin, and authentication workflows.
- Enable health expert discovery and counseling-session booking.
- Manage routines and care-related activities.
- Connect the application to ESP32 hardware.
- Provide a maintainable foundation for future AI-assisted notifications and automation.

## Architecture

```text
Nayi-Disha
├── hardware/
│   └── esp32_band/
│       ├── config.h
│       └── esp32_band.ino
│
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── hardwareController.js
│   │   ├── healthController.js
│   │   ├── iepController.js
│   │   └── routineController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── rbacMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── hardwareRoutes.js
│   │   ├── healthRoutes.js
│   │   └── routineRoutes.js
│   ├── utils/
│   │   ├── llmNotifier.js
│   │   └── weatherEngine.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── caretaker/
│   │   │   └── parent/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── package.json
└── package-lock.json
```

## Technology stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- `@hello-pangea/dnd` for drag-and-drop interactions

### Backend

- Node.js
- Express
- PostgreSQL
- `pg` connection pooling
- JWT-based authentication
- bcrypt for password hashing
- CORS and dotenv

### Hardware and infrastructure

- ESP32-based band hardware
- Aiven PostgreSQL database
- Cloudinary integration
- Render-compatible backend deployment
- Optional UptimeRobot keep-awake monitoring

## Core features

- User registration and login
- Authentication context and protected application flows
- Role-based access control
- Parent, caretaker, and admin experiences
- Health expert listing
- Counseling-session booking and administration
- Routine management
- Hardware routes and ESP32 integration
- Health and status endpoints
- PostgreSQL database connectivity
- Automatic database heartbeat and recovery support
- Theme management
- Dashboard charts and reusable interface components

## API overview

The backend runs as an Express API. The default local port is `4000`.

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate an existing user |

### Health and counseling

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health/experts` | Retrieve available health experts |
| `POST` | `/api/health/counseling/book` | Book a counseling session |
| `GET` | `/api/health/counseling` | Retrieve counseling sessions |
| `PUT` | `/api/health/counseling/:id` | Update a counseling session |

### Operational endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/status` | Confirm that the API is running |
| `GET` | `/keep-awake` | Check the API and database connection |

Additional routine, hardware, and other domain endpoints are organized under `backend/routes/`.

## Prerequisites

Install the following before running the project locally:

- Node.js 18 or later
- npm
- PostgreSQL or access to a PostgreSQL-compatible database
- Arduino IDE or PlatformIO for the ESP32 hardware project

## Installation

Clone the repository and install the root, backend, and frontend dependencies:

```bash
git clone https://github.com/Nayi-Disha-Org/Nayi-Disha.git
cd Nayi-Disha
npm install
npm run install-all
```

## Environment variables

Create a `.env` file inside `backend/` for server-side configuration. Do not commit secrets to the repository.

```env
PORT=4000
DATABASE_URL=postgresql://username:password@host:5432/database
JWT_SECRET=replace-with-a-strong-secret

# Optional Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional Aiven recovery configuration
AIVEN_TOKEN=your-aiven-api-token
AIVEN_PROJECT=your-aiven-project
AIVEN_SERVICE=your-aiven-service
```

The frontend uses the following optional variable when the backend is not running at its default local address:

```env
VITE_BACKEND_URL=http://localhost:4000/api
```

When `VITE_BACKEND_URL` is not provided, the frontend defaults to `http://localhost:4000/api`.

## Running the project

### Run frontend and backend together

From the repository root:

```bash
npm run dev
```

### Run the backend only

```bash
npm run dev:backend
```

The backend will be available at:

```text
http://localhost:4000
```

### Run the frontend only

```bash
npm run dev:frontend
```

Vite will print the frontend development URL in the terminal, usually:

```text
http://localhost:5173
```

### Create a production frontend build

```bash
npm run build --prefix frontend
```

To preview the production build locally:

```bash
npm run preview --prefix frontend
```

## Database

The backend uses the `DATABASE_URL` environment variable to connect to PostgreSQL through a connection pool. The connection is configured for hosted PostgreSQL deployments and includes connection timeouts, keep-alive support, and recovery-friendly error handling.

Before using database-backed features, make sure that:

1. The PostgreSQL database is running.
2. `DATABASE_URL` is valid.
3. Required tables and schema migrations have been applied.
4. The backend can reach the database from the local or deployed environment.

## ESP32 hardware

The ESP32 project is located in `hardware/esp32_band/`.

1. Open `hardware/esp32_band/esp32_band.ino` in the Arduino IDE or PlatformIO.
2. Configure the required values in `hardware/esp32_band/config.h`.
3. Select the correct ESP32 board and serial port.
4. Install any required board libraries.
5. Compile and upload the sketch to the device.

Keep Wi-Fi credentials, API keys, and device-specific secrets out of source control.

## Deployment notes

The backend is designed to run on services such as Render and connect to a hosted PostgreSQL provider such as Aiven.

For a deployed backend:

- Set all required environment variables in the hosting provider.
- Set `VITE_BACKEND_URL` in the frontend build environment to the deployed API URL, including `/api`.
- Configure CORS for the frontend's deployed origin when moving beyond local development.
- Configure a health or keep-awake monitor against `/keep-awake` only if this behavior is required.
- Never commit `.env` files, database credentials, JWT secrets, or cloud-provider tokens.

The backend includes an optional Aiven power-on request. It is activated only when `AIVEN_TOKEN`, `AIVEN_PROJECT`, and `AIVEN_SERVICE` are configured.

## Development scripts

| Command | Description |
| --- | --- |
| `npm install` | Install root development dependencies |
| `npm run install-all` | Install backend and frontend dependencies |
| `npm run dev` | Run backend and frontend together |
| `npm run dev:backend` | Run the backend with Nodemon |
| `npm run dev:frontend` | Run the frontend with Vite |
| `npm run build --prefix frontend` | Build the frontend for production |
| `npm run preview --prefix frontend` | Preview the frontend production build |

## Contributing

1. Create a feature branch from the current development branch.
2. Keep frontend, backend, and hardware changes focused and documented.
3. Add or update validation and error handling for new API behavior.
4. Verify that secrets and local configuration files are not committed.
5. Run the relevant frontend build and backend checks before opening a pull request.
6. Describe setup changes, environment variables, and API changes in the pull request.

## Project status

Nayi-Disha is under active development. Some modules and integrations may continue to evolve as the frontend, backend, database schema, and ESP32 hardware are developed together.

## License

A license has not yet been specified for this repository. Add a `LICENSE` file before distributing the project outside the organization.
