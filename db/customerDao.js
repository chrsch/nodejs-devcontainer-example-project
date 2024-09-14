const db = require('./database');
const Customer = require('../models/customer');

module.exports = {
    createCustomer: (customer) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO customers (name, email) VALUES (?, ?)`;
            db.run(query, [customer.name, customer.email], function (err) {
                if (err) reject(err);
                resolve(new Customer(this.lastID, customer.name, customer.email));
            });
        });
    },

    getCustomerById: (cid) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM customers WHERE cid = ?`, [cid], (err, row) => {
                if (err) reject(err);
                if (row) {
                    resolve(new Customer(row.cid, row.name, row.email));
                } else {
                    resolve(null);
                }
            });
        });
    },

    getAllCustomers: () => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM customers`, [], (err, rows) => {
                if (err) reject(err);
                const customers = rows.map(row => new Customer(row.cid, row.name, row.email));
                resolve(customers);
            });
        });
    },

    updateCustomer: (cid, customer) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE customers SET name = ?, email = ? WHERE cid = ?`;
            db.run(query, [customer.name, customer.email, cid], (err) => {
                if (err) reject(err);
                resolve(new Customer(cid, customer.name, customer.email));
            });
        });
    },

    deleteCustomer: (cid) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM customers WHERE cid = ?`;
            db.run(query, [cid], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
};
