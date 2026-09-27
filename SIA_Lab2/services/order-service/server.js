const express = require('express');
const app = express();
const PORT = 5003;

const orders = [
    {
        id: 1,
        userId: 1,
        productId: 1,
        quantity: 1,
        total: 1299.99,
        status: 'Completed'
    },
    {
        id: 2,
        userId: 2,
        productId: 2,
        quantity: 2,
        total: 59.98,
        status: 'Processing'
    },
    {
        id: 3,
        userId: 3,
        productId: 4,
        quantity: 1,
        total: 349.99,
        status: 'Shipped'
    },
    {
        id: 4,
        userId: 4,
        productId: 5,
        quantity: 1,
        total: 89.99,
        status: 'Completed'
    },
    {
        id: 5,
        userId: 5,
        productId: 3,
        quantity: 3,
        total: 59.97,
        status: 'Cancelled'
    }
];

app.get('/orders', (req, res) => {
    console.log('Order Service: Returning', orders.length, 'orders');

    res.json({
        service: 'Order Service',
        status: 'success',
        count: orders.length,
        data: orders,
        timestamp: new Date().toISOString()
    });
});

app.get('/ping', (req, res) => {
    res.json({
        status: 'online',
        service: 'Order Service'
    });
});

app.listen(PORT, () => {
    console.log('========================================');
    console.log('ORDER SERVICE STARTED');
    console.log('========================================');
    console.log(`Port: ${PORT}`);
    console.log(`GET /orders - Returns ${orders.length} orders`);
    console.log('GET /ping - Health check');
    console.log('========================================');
});