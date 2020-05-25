const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.get('/candidates', (req, res)=>{
    const sql = `SELECT candidates.*, parties.name AS party_name FROM candidates LEFT JOIN parties ON candidates.party_id = parties.id` ;
    const params = [];

    db.all(sql,params,function(err, rows){
        if (err){
            res.status('500').json({error : 'error message'});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


router.get('/candidates/:id', (req,res)=>{
    const sql = `SELECT candidates.*, parties.name AS party_name FROM candidates LEFT JOIN parties ON candidates.party_id = parties.id where candidates.id = ?` ;
    const params = [req.params.id];

    db.get(sql,params,function(err,result){
        if (err){
            res.status('500').json({message: err.message});
            return;
        }
        res.json({
            message: "success",
            data: result
        });
    });
});

router.delete('/candidates/:id',(req,res)=>{
    const sql = "delete from candidates where id = ?";
    const params = [req.params.id];

    db.run(sql,params,function(err, result){
        if (err){
            res.status('500').json({error: error.message});
            return;
        }
        res.json({
            message: "successfully deleted",
            changes: this.changes
        });
    });
});

router.post('/candidates',(req,res)=>{
    const errors = inputCheck(req.body, 'first_name','last_name', 'industry_connected');
    if (errors){
        res.status('400').json({error: errors});
    }
    const sql = "insert into candidates (first_name, last_name, industry_connected,id) values (?,?,?,?)";
    const params = [req.body.first_name, req.body.last_name, req.body.industry_connected];

    db.run(sql, params,function(err, result){
        if (err){
            res.status('500').json({error: err.message});
        }
        res.json({
            message: 'success',
            data: req.body,
            id: this.lastID
        });
    });
});

router.put('/candidate/:id', (req,res)=>{
    const errors = inputCheck(req.body, 'party_id');
    if (errors) {
    res.status(400).json({ error: errors });
    return;
    }
    const sql = "update candidates set party_id = ? where id = ?";
    const params = [req.body.party_id, req.params.id];

    db.run(sql, params, function(err, result) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({
          message: 'success',
          data: req.body,
          changes: this.changes
        });
    });
});

module.exports = router;

