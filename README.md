# 📦 Delivery Tracking App

A real-time web application to **track deliveries** using **React** (frontend), **Node.js** (backend), and **WebSocket/MQTT** for real-time updates.

---

## Overview

Track deliveries in real-time. Drivers update their location and status, while customers monitor their orders on a live map interface.  

Real-time updates are handled via **WebSockets** and **MQTT**.

---

## Features

- Real-time delivery tracking on a map  
- Role-based access: Super Admin, Company Admin, Driver, Customer  
- Super Admin manages companies and their admins  
- Company Admin manages drivers and orders  
- Driver updates delivery status  
- Customer receives delivery notifications  

---

## Tech Stack

- **Frontend:** React.js, HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB   
- **Real-time:** WebSocket (Socket.IO) & MQTT  

---

## User Roles

- **Super Admin:** Manages all companies and company admins  
- **Admin:** Manages drivers and orders for their company  
- **Driver:** Updates delivery location and status  
- **Customer:** Tracks deliveries in real-time  

---

## Installation

### Prerequisites

- Node.js & npm  
- MongoDB or MySQL  
- MQTT broker  

### Steps

```bash
# Clone repo
git clone https://github.com/yourusername/delivery-tracking-app.git
cd delivery-tracking-app

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start servers
cd backend && npm run dev
cd ../frontend && npm start
