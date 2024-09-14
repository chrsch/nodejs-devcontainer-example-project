const http = require('http');
const url = require('url');
const database = require('./db/database');
const customerDao = require('./db/customerDao');
const vehicleDao = require('./db/vehicleDao');

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const path = parsedUrl.pathname;

  res.setHeader('Content-Type', 'application/json');

  const customerVehiclesMatch = path.match(/^\/customers\/(\d+)\/vehicles$/);
    if (customerVehiclesMatch && method === 'GET') {
        const customerId = customerVehiclesMatch[1];
        try {
            const vehicles = await vehicleDao.getVehiclesByCustomerId(customerId);
            res.end(JSON.stringify(vehicles));
        } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to fetch vehicles for the customer' }));
        }
    }

  // Customer CRUD Routes
  if (path.startsWith('/customers')) {
    const cid = parsedUrl.query.cid;

    if (method === 'GET' && cid) {
      // Get a specific customer
      const customer = await customerDao.getCustomerById(cid);
      res.end(JSON.stringify(customer));
    } else if (method === 'GET') {
      // Get all customers
      const customers = await customerDao.getAllCustomers();
      res.end(JSON.stringify(customers));
    } else if (method === 'POST') {
      // Create a customer
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const newCustomer = JSON.parse(body);
        await customerDao.createCustomer(newCustomer);
        res.end(JSON.stringify({ message: 'Customer created' }));
      });
    } else if (method === 'PUT' && cid) {
      // Update a customer
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const updatedCustomer = JSON.parse(body);
        await customerDao.updateCustomer(cid, updatedCustomer);
        res.end(JSON.stringify({ message: 'Customer updated' }));
      });
    } else if (method === 'DELETE' && cid) {
      // Delete a customer
      await customerDao.deleteCustomer(cid);
      res.end(JSON.stringify({ message: 'Customer deleted' }));
    }

    // Vehicle CRUD Routes
  } else if (path.startsWith('/vehicles')) {
    const vid = parsedUrl.query.vid;

    if (method === 'GET' && vid) {
      // Get a specific vehicle
      const vehicle = await vehicleDao.getVehicleById(vid);
      res.end(JSON.stringify(vehicle));
    } else if (method === 'GET') {
      // Get all vehicles
      const vehicles = await vehicleDao.getAllVehicles();
      res.end(JSON.stringify(vehicles));
    } else if (method === 'POST') {
      // Create a vehicle
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const newVehicle = JSON.parse(body);
        await vehicleDao.createVehicle(newVehicle);
        res.end(JSON.stringify({ message: 'Vehicle created' }));
      });
    } else if (method === 'PUT' && vid) {
      // Update a vehicle
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const updatedVehicle = JSON.parse(body);
        await vehicleDao.updateVehicle(vid, updatedVehicle);
        res.end(JSON.stringify({ message: 'Vehicle updated' }));
      });
    } else if (method === 'DELETE' && vid) {
      // Delete a vehicle
      await vehicleDao.deleteVehicle(vid);
      res.end(JSON.stringify({ message: 'Vehicle deleted' }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
