import * as chai from 'chai';
import app from '../server.js';

// Dynamically load Chai-HTTP
const chaiHttpModule = await import('chai-http');

// Handle both default and named exports for Chai-HTTP
const chaiHttp = chaiHttpModule.default || chaiHttpModule;

// Register Chai-HTTP with Chai
chai.use(chaiHttp);

const { expect } = chai;

describe('Vehicle-Customer API Integration Tests', () => {
    
    let testCustomerId;
    let testVehicleId;

    // Test case for creating a customer
    it('should create a new customer', (done) => {
        chai.request(app)
            .post('/customers')
            .send({ name: 'John Doe', email: 'john.doe@example.com' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.message).to.equal('Customer created');
                done();
            });
    });

    // Test case for retrieving all customers
    it('should retrieve all customers', (done) => {
        chai.request(app)
            .get('/customers')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                testCustomerId = res.body[0].cid;  // Store the first customer's ID for later use
                done();
            });
    });

    // Test case for retrieving a customer by ID
    it('should retrieve a customer by ID', (done) => {
        chai.request(app)
            .get(`/customers?cid=${testCustomerId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.cid).to.equal(testCustomerId);
                done();
            });
    });

    // Test case for updating a customer
    it('should update a customer', (done) => {
        chai.request(app)
            .put(`/customers?cid=${testCustomerId}`)
            .send({ name: 'Jane Doe', email: 'jane.doe@example.com' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.message).to.equal('Customer updated');
                done();
            });
    });

    // Test case for deleting a customer
    it('should delete a customer', (done) => {
        chai.request(app)
            .delete(`/customers?cid=${testCustomerId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('Customer deleted');
                done();
            });
    });

    // Test case for creating a vehicle
    it('should create a new vehicle for a customer', (done) => {
        chai.request(app)
            .post('/vehicles')
            .send({ make: 'Toyota', model: 'Corolla', customerId: testCustomerId })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('Vehicle created');
                done();
            });
    });

    // Test case for retrieving all vehicles
    it('should retrieve all vehicles', (done) => {
        chai.request(app)
            .get('/vehicles')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                testVehicleId = res.body[0].vid;  // Store the first vehicle's ID for later use
                done();
            });
    });

    // Test case for retrieving vehicles by customer ID
    it('should retrieve all vehicles for a given customer', (done) => {
        chai.request(app)
            .get(`/customers/${testCustomerId}/vehicles`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    // Test case for updating a vehicle
    it('should update a vehicle', (done) => {
        chai.request(app)
            .put(`/vehicles?vid=${testVehicleId}`)
            .send({ make: 'Honda', model: 'Civic', customerId: testCustomerId })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('Vehicle updated');
                done();
            });
    });

    // Test case for deleting a vehicle
    it('should delete a vehicle', (done) => {
        chai.request(app)
            .delete(`/vehicles?vid=${testVehicleId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('Vehicle deleted');
                done();
            });
    });

});
