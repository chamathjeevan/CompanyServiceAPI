var express = require('express');
const router = express.Router();
var dbConnection = require('./database')
const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
    NAME: Joi.string().required(),
    Client_ID: Joi.string().required(),
    Address: Joi.string().required()
})

router.get('/company', function (req, res, next) {
    dbConnection.query('SELECT * FROM Companies', function (error, results, fields) {

        if (error) return next(error);

        if (!results || results.length == 0) return res.status(404).send()

        return res.send(results)
    });
});

router.get('/company/:name', function (req, res, next) {

    let name = req.params.name;

    dbConnection.query('SELECT * FROM Companies where Name = ?', name, function (error, results, fields) {

        if (error) return next(error);

        if (!results || results.length == 0) return res.status(404).send()

        return res.send(results);

    });
});

router.post('/company', function (req, res, next) {

    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).send();
        }

        dbConnection.query("INSERT INTO Companies SET ? ", req.body, function (error, results, fields) {

            if (error) return next(error);

            return res.status(201).send();
        });
    });
});

router.put('/company', function (req, res) {

    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            return res.status(400).send();
        }
        let company = req.body;
        dbConnection.query("UPDATE Companies SET Address = ?  WHERE NAME = ?  AND Client_ID = ?", [company.Address,company.NAME, company.Client_ID], function (error, results, fields) {

            if (error) return next(error);

            if (!results || results.affectedRows == 0) res.status(404).send();

            return res.send(results);
        });
    });
});

router.delete('/company/:NAME', function (req, res, next) {

    dbConnection.query("DELETE FROM Companies WHERE NAME =  ? ", req.params.NAME, function (error, results, fields) {

        if (error) return next(error);

        if (!results || results.affectedRows == 0) return res.status(404).send();

        return res.send(results);

    });
});

module.exports = router;