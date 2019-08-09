var express = require('express');
const router = express.Router();
var dbConnection = require('./database')
const Joi = require('@hapi/joi');

const schema = Joi.object().keys ({
    ID : Joi.number().required(),
    Incoterm : Joi.string().required(),
    Description: Joi.string().required(),
    Status : Joi.boolean()
})

router.get('/:Client_ID/incoterm', function(req, res, next) {
    dbConnection.query('SELECT * FROM Incoterms WHERE Client_ID = ? ',req.params.Client_ID, function(error, results, fields) {
        if (error) return next (error);
        if (!results || results.length ==0) return res.status(404).send()
        return res.send(results)

    });
})

router.get('/:Client_ID/incoterm/:id', function(req, res, next) {
    dbConnection.query('SELECT * FROM Incoterms WHERE Client_ID = ? AND ID = ?' , [req.params.Client_ID,req.params.id], function(error,results, fields) {
        if (error) return next (error);
        if (!results || results.length ==0) return res.status(404).send()
        return res.send(results);
    })
})

router.post('/:Client_ID/incoterm' , function (req, res, next) {
    Joi.validate(req.body, schema, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).send();

        }

        dbConnection.query("INSERT INTO Incoterms SET ? " , req.body, function (error, results, fields) {
            if (error) return next (error);
            return res.status (201).send();

        })
    })
})

router.put ('/:Client_ID/incoterm' , function( req, res) {
    Joi.validate(req.body,  schema, (err, result) => {
        if (err) {
            return res.status(400).send();

        }

        let incoterm = req.body;
        dbConnection.query("UPDATE Incoterms SET Incoterm = ?, Description = ?, Status = ? WHERE ID = ?", [incoterm.Incoterm, incoterm.Description, incoterm.Status, incoterm.ID], function(error, results, fields) {
            if (error) return next(error);
            if (!results || results.affectedRows == 0) res.status(404).send();
            return res.send(results);

        })
        
    })
})

router.delete('/:Client_ID/incoterm/:id', function(req , res ,next) {
    dbConnection.query("DELETE FROM Incoterms WHERE ID = ?", req.params.name, function (error,  results, fields) {
        if (error) return next(error);
        if (!results || results.affectedRows == 0) return res.status(404).send();
        return res.send(results);
    })
})

module.exports = router;