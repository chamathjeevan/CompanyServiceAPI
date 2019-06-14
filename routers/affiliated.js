var express = require('express');
const router = express.Router();
var dbConnection = require('./database')
const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
    Client_ID: Joi.string().required(),
    Incoterm_ID:  Joi.number().integer().required(),
    PaymentTerm_ID: Joi.number().integer().required(),
    Company_NAME: Joi.string().required(),
    Type: Joi.string().required(),
    Bank: Joi.string().required(),
    IsDeleted: Joi.boolean(),
    IsActive: Joi.boolean()
})

router.get('/affiliated', function (req, res, next) {
    dbConnection.query('SELECT * FROM AffiliatedCompany', function (error, results, fields) {

        if (error) return next(error);

        if (!results || results.length == 0) return res.status(404).send()

        return res.send(results)
    });
});

router.get('/affiliated/:id', function (req, res, next) {

    let contact_id = req.params.id;

    dbConnection.query('SELECT * FROM AffiliatedCompany where ID = ?', contact_id, function (error, results, fields) {

        if (error) return next(error);

        if (!results || results.length == 0) return res.status(404).send()

        return res.send(results);

    });
});

router.post('/affiliated', function (req, res, next) {

    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).send();
        }

        dbConnection.query("INSERT INTO AffiliatedCompany SET ? ", req.body, function (error, results, fields) {

            if (error) return next(error);

            return res.status(201).send();
        });
    });
});

router.put('/affiliated', function (req, res) {

    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            return res.status(400).send();
        }
        let contact = req.body;
        dbConnection.query("UPDATE AffiliatedCompany SET Incoterm_ID = ?, PaymentTerm_ID = ?, Type = ?, Bank = ?, IsDeleted = ?, IsActive = ? WHERE Client_ID = ? AND Company_NAME = ?", [contact.Company_NAME, contact.ContactNo, contact.Address, contact.Email, contact.ID], function (error, results, fields) {

            if (error) return next(error);

            if (!results || results.affectedRows == 0) res.status(404).send();

            return res.send(results);
        });
    });
});

router.delete('/affiliated/:id', function (req, res, next) {

    dbConnection.query("DELETE FROM AffiliatedCompany WHERE ID =  ? ", req.params.id, function (error, results, fields) {

        if (error) return next(error);

        if (!results || results.affectedRows == 0) return res.status(404).send();

        return res.send(results);

    });
});

module.exports = router;