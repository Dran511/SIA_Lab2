const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const USER_SERVICE = 'http://localhost:5001';
const PRODUCT_SERVICE = 'http://localhost:5002';
const ORDER_SERVICE = 'http://localhost:5003';

// Dashboard - Get data from all services
app.get('/api/dashboard', async (req, res) => {
    try {
        const [users, products, orders] = await Promise.all([
            axios.get(`${USER_SERVICE}/users`),
            axios.get(`${PRODUCT_SERVICE}/products`),
            axios.get(`${ORDER_SERVICE}/orders`)
        ]);

        res.json({
            service: 'API Gateway',
            status: 'success',
            data: {
                users: users.data,
                products: products.data,
                orders: orders.data
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Dashboard Error:', error.message);

        res.status(500).json({
            service: 'API Gateway',
            status: 'error',
            message: 'Failed to connect to one or more services'
        });
    }
});

// Status - Check all services
app.get('/api/status', async (req, res) => {
    const services = {
        users: `${USER_SERVICE}/ping`,
        products: `${PRODUCT_SERVICE}/ping`,
        orders: `${ORDER_SERVICE}/ping`
    };

    const results = {};

    for (const [name, url] of Object.entries(services)) {
        try {
            const response = await axios.get(url);
            results[name] = {
                status: 'online',
                data: response.data
            };
        } catch (error) {
            results[name] = {
                status: 'offline',
                error: error.message
            };
        }
    }

    res.json({
        service: 'API Gateway',
        status: 'success',
        services: results,
        timestamp: new Date().toISOString()
    });
});

// Individual service routes
app.get('/api/users', async (req, res) => {
    try {
        const response = await axios.get(`${USER_SERVICE}/users`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'User Service unavailable'
        });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const response = await axios.get(`${PRODUCT_SERVICE}/products`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Product Service unavailable'
        });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const response = await axios.get(`${ORDER_SERVICE}/orders`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Order Service unavailable'
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        service: 'API Gateway',
        status: 'online',
        message: 'Hub-and-Spoke API Gateway is running'
    });
});

app.listen(PORT, () => {
    console.log('========================================');
    console.log('API GATEWAY STARTED');
    console.log('========================================');
    console.log(`Port: ${PORT}`);
    console.log('GET /api/dashboard - Combined data');
    console.log('GET /api/status - Service health checks');
    console.log('GET /api/users - User data');
    console.log('GET /api/products - Product data');
    console.log('GET /api/orders - Order data');
    console.log('========================================');
});