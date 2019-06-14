var express = require('express');
const router = express.Router();
var dbConnection = require('./database')
const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
    ID : Joi.string().required(),
    NAME : Joi.string().required(),
    BuisnessRegNo : Joi.string().allow(null),
    TIN: Joi.number().precision(2).required(),
    SWIFT : Joi.string().required()

})

router.get ('/bank', function(req, res, next) {
    dbConnection.query('SELECT * FROM Banks', function( error, results, fields) {
        if (error) return next (error);
        if (!results || results.length == 0) return res.status(404).send()
        return res.send(results)
    })
})

router.get ('/bank/:id', function(req, res, next) {
    let id = req.params.id;
    dbConnection.query('SELECT * FROM Banks WHERE ID = ?', id , function (error, results, fields){
        if (error) return next (error);
        if (!results || results.length == 0) return res.status(404).send()
        return res.send(results);
    })
})

router.post('/bank', function (req, res, next) {
    Joi.validation(req.body, schema, (err, results) => {
        if (err) {
            return res.status(400).send();
        }

        dbConnection.query('INSERT INTO Banks SET ? ', req.body, function (error, results, fields) {
            if (error) return next(error);
            return res,status (201).send();

        })
    })
})

router.put('/bank', function(req, res) {
    Joi.validation(req.body, schema, (err, results) => {
        if (err) {
            return res.status(400).send();
        }

        let bank = req.body;
        dbConnection.query('UPDATE Banks SET ID = ?, NAME = ?, BuisnessRegNo =?, TIN = ?, SWIFT = ?', [bank.ID, bank.NAME, bank.BuisnessRegNo, bank.TIN, bank.SWIFT] , function(error, results, fields) {
            if (error) return next(error);
            if (!results || results.affectedRows == 0) res.status(400).send();
            return res.send(results);

        } )
    })

})

router.delete('/bank/:id', function (req, res, next) {
    dbConnection.query('DELETE FROM Banks WHERE ID = ?', req.params.id, function (error, results, fields) {
        if (error) return next(error);
        if (!results || results.affectedRows ==0) return res.status(404).send();
        return res.status(results);

    })

})

module.exports =  router;