import db from './database.js';
import Vehicle from '../models/vehicle.js';

const vehicleDao = {
    createVehicle: (vehicle) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO vehicles (make, model, customerId) VALUES (?, ?, ?)`;
            db.run(query, [vehicle.make, vehicle.model, vehicle.customerId], function (err) {
                if (err) reject(err);
                resolve(new Vehicle(this.lastID, vehicle.make, vehicle.model, vehicle.customerId));
            });
        });
    },

    getVehicleById: (vid) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM vehicles WHERE vid = ?`, [vid], (err, row) => {
                if (err) reject(err);
                if (row) {
                    resolve(new Vehicle(row.vid, row.make, row.model, row.customerId));
                } else {
                    resolve(null);
                }
            });
        });
    },

    getAllVehicles: () => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM vehicles`, [], (err, rows) => {
                if (err) reject(err);
                const vehicles = rows.map(row => new Vehicle(row.vid, row.make, row.model, row.customerId));
                resolve(vehicles);
            });
        });
    },

    updateVehicle: (vid, vehicle) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE vehicles SET make = ?, model = ?, customerId = ? WHERE vid = ?`;
            db.run(query, [vehicle.make, vehicle.model, vehicle.customerId, vid], (err) => {
                if (err) reject(err);
                resolve(new Vehicle(vid, vehicle.make, vehicle.model, vehicle.customerId));
            });
        });
    },

    deleteVehicle: (vid) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM vehicles WHERE vid = ?`;
            db.run(query, [vid], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    },

    getVehiclesByCustomerId: (customerId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM vehicles WHERE customerId = ?`;
            db.all(query, [customerId], (err, rows) => {
                if (err) reject(err);
                const vehicles = rows.map(row => new Vehicle(row.vid, row.make, row.model, row.customerId));
                resolve(vehicles);
            });
        });
    },
};

export default vehicleDao;