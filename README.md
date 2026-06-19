# Travelia

Travelia is a premium travel commerce platform that combines AI trip planning, stay booking, activities, event tickets, local marketplace products, loyalty, sustainability scoring, community impact analytics, and traveler safety tools.

This repository currently runs as a Node.js, Express, MongoDB, EJS, Bootstrap, Leaflet, Passport, Cloudinary, and Razorpay application. The UI and routes have been shaped around the larger venture-style product vision, while the Next.js, Redis, AWS S3, JWT/RBAC, OpenAI, Google Maps, and Stripe layers are ready to be introduced as the next architecture phase.

## Product Surfaces

- AI Trip Planner with generated itinerary previews
- Smart destination and weather-aware recommendations
- Homestay and hotel booking flows
- Activity and adventure discovery
- Event discovery with QR-style ticket UI
- Local marketplace for regional products
- Unified trip cart and checkout summary
- Sustainability score and eco signals
- Community Impact Dashboard
- SOS Emergency Assistance surface
- Loyalty points, badges, and rewards
- Reviews and ratings
- Role dashboards for Tourist, Host, Vendor, Event Organizer, and Admin

## Current Tech Stack

- Backend: Node.js, Express.js
- Views: EJS with ejs-mate layouts
- Database: MongoDB with Mongoose
- Auth: Passport Local sessions
- Payments: Razorpay integration hooks
- Uploads: Multer and Cloudinary
- Maps: Leaflet and OpenStreetMap
- Styling: Bootstrap plus custom responsive design system

## Target Production Stack

- Frontend: Next.js
- Backend: Node.js and Express services
- Database: MongoDB
- Cache and queues: Redis
- Media: AWS S3 or Cloudinary
- Auth: JWT, RBAC, and session hardening
- Payments: Razorpay and Stripe
- AI: OpenAI API for itinerary generation and recommendations
- Maps: Google Maps API for places, routes, and geocoding

## Setup

```bash
npm install
node app.js
```

Open:

```text
http://localhost:3000
```

For live payments, add Razorpay credentials in `.env`. For database-backed flows, make sure MongoDB is running and set `MONGO_URL` if you are not using the local default.
