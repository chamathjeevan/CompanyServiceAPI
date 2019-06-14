var express = require('express');
const router = express.Router();
var dbConnection = require('./database')
const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
    Name: Joi.string().required(),
    Client_ID: Joi.string().required(),
    Address: Joi.string().required(),
    TIN: Joi.number().precision(2).required(),
    BusinessRegNo: Joi.string().allow(null),
    Status: Joi.boolean()
})

router.get('/entity', function (req, res, next) {
    dbConnection.query('SELECT * FROM Entities', function(error, results, fields) {

        if (error) return next(error);

        if (!results || results.length == 0) return res.status(404).send()

        return res.send(results)
    });
});

router.get('/entity/:name', function (req, res, next) {

    let name = req.params.name;

    dbConnection.query('SELECT * FROM Entities where Name = ?', name, function (error, results, fields) {

        if (error) return next(error);

        if (!results || results.length == 0) return res.status(404).send()

        return res.send(results);

    });
});

router.post('/entity', function (req, res, next) {

    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
        
            return res.status(400).send();
        }

        dbConnection.query("INSERT INTO Entities SET ? ", req.body, function (error, results, fields) {

            if (error) return next(error);

            return res.status(201).send();
        });
    });
});

router.put('/entity', function (req, res) {

    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            return res.status(400).send();
        }
        let entity = req.body;
        dbConnection.query("UPDATE Entities SET Name = ?, Client_ID = ?, Address = ?,TIN = ?,BusinessRegNo = ?,Status = ?   WHERE Name = ? ", [entity.Name, entity.Client_ID, entity.Address, entity.TIN, entity.BusinessRegNo, entity.Status, entity.Name], function (error, results, fields) {

            if (error) return next(error);

            if (!results || results.affectedRows == 0) res.status(404).send();

            return res.send(results);
        });
    });
});

router.delete('/entity/:name', function (req, res, next) {

    dbConnection.query("DELETE FROM Entities WHERE Name =  ? ", req.params.name, function (error, results, fields) {

        if (error) return next(error);

        if (!results || results.affectedRows == 0) return res.status(404).send();

        return res.send(results);

    });
});

module.exports = router;