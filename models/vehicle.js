class Vehicle {
    constructor(vid, make, model, customerId) {
        this.vid = vid;
        this.make = make;
        this.model = model;
        this.customerId = customerId;  // Foreign key to the Customer entity
    }
}

export default Vehicle;
