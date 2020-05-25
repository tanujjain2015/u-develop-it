const express = require('express');
const router = express.Router();
const db = require('../../db/database');

router.get('/parties',(req,res)=>{
    const sql = `select * from parties`;
    const params = [];

    db.all(sql, params,function(err,rows){
        if (err) {
            res.status(500).json({error: err});
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

router.get('/parties/:id', (req, res)=>{
    const sql = "select * from parties where id = ?";
    const params = [req.params.id];

    db.get(sql, params, function(err,result){
        if (err) {
            res.status(400).json({error: err});
        }
        res.json({
            message: "success",
            data: result
        });
    });
});

router.delete('/parties/:id', function(req, res){
    const sql  = "delete from parties where id = ?";
    const params = [req.params.id];

    db.run(sql, params, function(err, result) {
        if (err) {
          res.status(400).json({ error: res.message });
          return;
        }
        res.json({ message: 'successfully deleted', changes: this.changes });
    });
});

module.exports = router;