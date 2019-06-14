var express = require('express');
const router = express.Router();
var dbConnection = require('./database')
const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
    ID:  Joi.string().trim().required(),
    ClientInfoID:  Joi.string().trim().required(),
    Address:  Joi.string().trim().required(),
    VAT:  Joi.number().precision(2),
    TIN:  Joi.number().precision(2),
    BusinessRegNo: Joi.string().trim().required(),
    Parent_ID: Joi.string().allow(null),
    IsDeleted: Joi.boolean(),
    IsActive: Joi.boolean(),
    CreatedBy: Joi.string().trim().required(),
    CreatedTime: Joi.string().allow(null)
})

router.get('/client', function(req, res) {

    dbConnection.query('SELECT * FROM Clients Where IsActive = true', function(error, results, fields) {
        if (error) {
            console.error(error)
            res.status(500).send(error);
        } else {
            console.error(results)
            if (!results || results.length == 0) {
                res.status(404).send();
            } else {
                res.json(results);
            }
        }
        res.end();
        return
    });

});

router.get('/client/:id', function(req, res) {

    let client_id = req.params.id;

    if (!client_id) {
        res.status(400).send({
            error: true,
            message: 'Please provide material id'
        });
        res.end();
        return
    }

    dbConnection.query('SELECT * FROM Clients Where IsActive = true and id= ?', client_id, function(error, results, fields) {

        if (error) {
            res.status(500).send(error);
        } else {

            if (!results || results.length == 0) {
                res.status(404).send();
            } else {
                res.json(results);
            }
        }
        res.end();
        return
    });

});

router.post('/client', function(req, res) {
    let client = req.body;
   
    if (!client) {
        res.status(400).send();
        res.end();
        return
    }
    let userID = req.header('InitiatedBy')
    const uuidv4 = require('uuid/v4');

    client.CreatedBy = userID; 
    client.ID = uuidv4();

 

    Joi.validate(client, schema, (err, result) => {

        if (err) {
            return res.status(400).send();
        }

        dbConnection.query("INSERT INTO Clients SET  ? ", client, function(error, results, fields) {
            if (error) {
                res.status(500).send(error);
            } else {

                if (!results || results.length == 0) {
                    res.status(404).send({
                        error: false,
                        message: 'No records found'
                    });
                } else {
                    res.status(201).send({
                        error: false,
                        data: results,
                        message: client.ID 
                    });
                }
            }
            res.end();
            return
        });
    });
});

router.put('/client', function(req, res) {

    let client = req.body;
    let ParentID = client.ID;

    if (!client) {
        res.status(400).send();
        res.end();
        return
    }

    /* Begin transaction */
    dbConnection.beginTransaction(function(err) {
        if (err) {
            throw err;
        }

        dbConnection.query("UPDATE Clients SET  IsActive = 0 WHERE ID = ? ", ParentID, function(error, results, fields) {
            if (error) {
                dbConnection.rollback(function() {

                    res.status(500).send(error);
                    res.end();
                    return
                });
            }
            
            let userID = req.header('InitiatedBy')
            const uuidv4 = require('uuid/v4');

            var copyClient = {
                ID: uuidv4(),
                ClientInfoID: client.ClientInfoID,
                Address: client.Address,
                VAT: client.VAT,
                TIN: client.TIN,
                BusinessRegNo: client.BusinessRegNo,
                Parent_ID: ParentID,
                IsDeleted: client.IsDeleted,
                IsActive: client.IsActive,
                CreatedBy: userID
            }

            dbConnection.query("INSERT INTO Clients SET  ? ", copyClient, function(error, results, fields) {

                console.log(error);

                if (error) {
                    dbConnection.rollback(function() {
                        res.status(500).send(error);
                        res.end();
                        return
                    });
                }
                dbConnection.commit(function(err) {
                    if (error) {
                        dbConnection.rollback(function() {
                            res.status(500).send(error);
                            res.end();
                            return
                        });
                    }

                    res.send({
                        error: false,
                        data: results,
                        message: copyClient.ID
                    });

                    res.end();
                    return
                });
            });
        });
    });
    /* End transaction */
});

router.delete('/client/:id', function(req, res) {

    let client_id = req.params.id;

    if (!client_id) {
        res.status(400).send({
            error: true,
            message: 'Please provide client id'
        });
        res.end();
        return
    }

    dbConnection.query("UPDATE Clients SET  IsDeleted = 1 WHERE ID = ?", [client_id], function(error, results, fields) {

        if (error) {
            res.status(500).send(error);
        } else {

            if (!results || results.length == 0) {
                res.status(404).send({
                    error: false,
                    message: 'No records found'
                });
            } else {
                res.send({
                    error: false,
                    data: results,
                    message: 'client has been deleted successfully.'
                });
            }
        }
        res.end();
        return
    });
});

module.exports = router;