const router = require('express').Router();
let Employee = require('../models/Employee');

// Add new employee
router.route("/add").post(async (req, res) => {
    const { name, email, mobile, nic, designation, basicsal, empid } = req.body;

    const newEmployee = new Employee({
        name, email, mobile: Number(mobile), nic, designation, basicsal: Number(basicsal), empid
    });

    try {
        await newEmployee.save();
        res.json("Employee Added");
    } catch (err) {
        console.log(err);
        res.status(400).json("Error: " + err);
    }
});

// Get all employees
router.route("/").get(async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        console.log(err);
        res.status(400).json("Error: " + err);
    }
});

// Update employee by ID
router.route("/update/:id").put(async (req, res) => {
    const userID = req.params.id;
    const { name, email, mobile, nic, designation, basicsal, empid } = req.body;

    const updateEmployee = {
        name, email, mobile: Number(mobile), nic, designation, basicsal: Number(basicsal), empid
    };

    try {
        await Employee.findByIdAndUpdate(userID, updateEmployee);
        res.status(200).send({ status: "Employee Updated" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with updating data", error: err.message });
    }
});

// Delete employee by ID
router.route("/delete/:id").delete(async (req, res) => {
    const userID = req.params.id;

    try {
        await Employee.findByIdAndDelete(userID);
        res.status(200).send({ status: "Employee Deleted" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with deleting employee", error: err.message });
    }
});

// Get employee by ID
router.route("/get/:id").get(async (req, res) => {
    const userID = req.params.id;

    try {
        const employee = await Employee.findById(userID);
        if (employee) {
            res.status(200).send({ status: "Employee fetched", employee });
        } else {
            res.status(404).send({ status: "Employee not found" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with get employee", error: err.message });
    }
});

// Login employee by email and mobile
router.route("/login").post(async (req, res) => {
    const { email, mobile } = req.body;

    try {
        const employee = await Employee.findOne({ email });
        if (employee && employee.mobile === Number(mobile)) {
            return res.status(200).json({ employee });
        } else {
            return res.status(404).json({ message: 'Invalid email or mobile number' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
