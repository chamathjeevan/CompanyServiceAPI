var express = require('express');
const router = express.Router();
var dbConnection = require('./database')
const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
    ID:  Joi.string().trim().required(),
    Client_ID:  Joi.string().trim().required(),
    Company_NAME:  Joi.string().trim().required(),
    CompanyInFold:  Joi.string().trim().required(),
    NearestSeaPort:  Joi.string().allow(null),
    NearestAirPort: Joi.string().allow(null),
    SeaTransitTime:  Joi.number().precision(2),
    AirTransitTime:  Joi.number().precision(2),
    SuppliersWebSite:  Joi.string().allow(null),
    LinkToCatalogues:  Joi.string().allow(null),
    Parent_ID:  Joi.string().allow(null),
    IsDeleted: Joi.boolean(),
    IsActive:  Joi.boolean()
})

router.get('/supplier', function(req, res) {

    dbConnection.query('SELECT * FROM Suppliers Where IsActive = true', function(error, results, fields) {
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

router.get('/supplier/:id', function(req, res) {

    let supplier_id = req.params.id;

    if (!supplier_id) {
        res.status(400).send();
        res.end();
        return
    }

    dbConnection.query('SELECT * FROM Suppliers Where IsActive = true and id= ?', supplier_id, function(error, results, fields) {

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

router.post('/supplier', function(req, res) {
    let supplier = req.body;
   
    if (!supplier) {
        res.status(400).send();
        res.end();
        return
    }

    const uuidv4 = require('uuid/v4');
    supplier.ID = uuidv4();

    Joi.validate(supplier, schema, (err, result) => {

        if (err) {
            console.error(err)
            return res.status(400).send();
        }

        dbConnection.query("INSERT INTO Suppliers SET  ? ", supplier, function(error, results, fields) {
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
                        message: supplier.ID 
                    });
                }
            }
            res.end();
            return
        });
    });
});

router.put('/supplier', function(req, res) {

    let supplier = req.body;
    let ParentID = supplier.ID;

    if (!supplier) {
        res.status(400).send();
        res.end();
        return
    }

    /* Begin transaction */
    dbConnection.beginTransaction(function(err) {
        if (err) {
            throw err;
        }

        dbConnection.query("UPDATE Suppliers SET  IsActive = 0 WHERE ID = ? ", ParentID, function(error, results, fields) {
            if (error) {
                dbConnection.rollback(function() {

                    res.status(500).send(error);
                    res.end();
                    return
                });
            }

            const uuidv4 = require('uuid/v4');

            var copySupplier = {
                ID: uuidv4(),
                Client_ID: supplier.Client_ID,
                Company_NAME: supplier.Company_NAME,
                CompanyInFold: supplier.CompanyInFold,
                NearestSeaPort: supplier.NearestSeaPort,
                NearestAirPort: supplier.NearestAirPort,
                SeaTransitTime: supplier.SeaTransitTime,
                AirTransitTime: supplier.AirTransitTime,
                SuppliersWebSite: supplier.SuppliersWebSite,
                LinkToCatalogues: supplier.LinkToCatalogues,
                Parent_ID: ParentID,
                IsDeleted: supplier.IsDeleted,
                IsActive: supplier.IsActive
            }
            
            dbConnection.query("INSERT INTO Suppliers SET  ? ", copySupplier, function(error, results, fields) {

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
                        message: copySupplier.ID
                    });

                    res.end();
                    return
                });
            });
        });
    });
    /* End transaction */
});

router.delete('/supplier/:id', function(req, res) {

    let supplier_id = req.params.id;

    if (!supplier_id) {
        res.status(400).send();
        res.end();
        return
    }

    dbConnection.query("UPDATE Suppliers SET  IsDeleted = 1 WHERE ID = ?", [supplier_id], function(error, results, fields) {

        if (error) {
            res.status(500).send(error);
        } else {

            if (!results || results.length == 0) {
                res.status(404).send();
            } else {
                res.send({
                    error: false,
                    data: results,
                    message: 'Suppliers has been deleted successfully.'
                });
            }
        }
        res.end();
        return
    });
});

module.exports = router;