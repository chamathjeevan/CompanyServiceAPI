var express = require('express');
const router = express.Router();
var dbConnection = require('./database')
const Joi = require('@hapi/joi');

const schema = Joi.object().keys ( {
    ID : Joi.number().required(),
    Client_ID : Joi.string().required(),
    Supplier_ID : Joi.string().required(), 
    PaymetTerm : Joi.string().required(),
    DueDays: Joi.number().required(),
    DueStartOn :Joi.string().valid('', 'Invoice Date', 'BL Date', 'Delivery Date'),
    PaymentType: Joi.string().valid('', 'Advance','Credit','LC'),
    Status : Joi.boolean()
})

router.get('/paymentTerm', function(req, res, next) {
    dbConnection.query('SELECT * FROM PaymentTerms', function(error, results, fields) {
        if (error) return next (error);
        if (!results || results.length ==0) return res.status(404).send()
        return res.send(results)

    }) 
})

router.get('/paymentTerm/:id', function(req, res, next) {
    let id = req.params.id;
    dbConnection.query('SELECT * FROM PaymentTerms WHERE ID  = ?', id , function(error, results, fields) {
            if (error) return next (error);
            if (!results || results.length == 0) return res.status(404).send()
            return res.send(results);
    })
})

router.post('/paymentTerm', function (req, res, next) {
    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).send();
        }

        dbConnection.query("INSERT INTO PaymentTerms SET ?" , req.body , function(error, results, fields) {
            if (error) return next(error); 
                return res.status(201).send();
                
        })
    })
})


router.put ('/paymentTerm', function(req, res) {
    Joi.validate(req.body,  schema, (err, result) => {
        if(err) {
            return res.status(400).send();

        }
        let paymentTerm = req.body;
        dbConnection.query('UPDATE PaymentTerms SET Client_ID = ?, Supplier_ID = ?, PaymetTerm = ?, DueDays = ?, DueStartOn = ?, PaymentType = ?, Status = ? WHERE ID = ?', [paymentTerm.Client_ID, paymentTerm.Supplier_ID, paymentTerm.PaymetTerm,  paymentTerm.DueDays, paymentTerm.DueStartOn, paymentTerm.PaymentType, paymentTerm.Status], function (error, results, fields) {
            if (error) return next(error);
            if (!results||results.affectedRows == 0) res.status(404).send();
            return res.send(results);
        }) 
    })
})

router.delete('/paymentTerm/:id', function(req, res, next) {
    dbConnection.query("DELETE FROM PaymentTerms WHERE ID = ?", req.params.name, function(error, results, fields) {
        if (error) return next(error);
        if (!results||results.affectedRows==0) return res.status(404).send();
        return res.send(results);
    })
})

module.exports = router;