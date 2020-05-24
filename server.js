const express = require ('express');
const PORT = process.env.PORT || 3001 ;
const app = express();
const sqlite3 = require('sqlite3').verbose();
const inputCheck = require('./utils/inputCheck');

app.use(express.urlencoded({extended : false}));
app.use(express.json());

const db  = new sqlite3.Database('db/election.db', err => {
    if (err) {
        return console.err(err.message);
    }
    console.log("Connected to the election database");
});

app.get('/api/candidates', (req, res)=>{
    const sql = 'select * from candidates';
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


app.get('/api/candidates/:id', (req,res)=>{
    const sql = "select * from candidates where id = ?";
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


app.delete('/api/candidates/:id',(req,res)=>{
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

app.post('/api/candidates',(req,res)=>{
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


app.use((req,res)=>{
    res.status('404').end();
})

db.on('open', ()=> {
    app.listen(PORT , () =>{
        console.log(`server running on port ${PORT}`);
    });
});

