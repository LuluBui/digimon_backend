const pg = require('pg');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const client = new pg.Client('postgres://lulubui:1andon2o3a4uffy@localhost/digimon_db');

app.get('/api/digimon', async(req, res, next)=> {
    try{
        
        const SQL = `
            SELECT *
            FROM digimon;
        `;
    //console.log(`tagsa`);
        const response = await client.query(SQL);
    //console.log(response);
        res.send(response.rows);
        
    }catch(error){
        next(error);
    }
});

app.get('/api/digimon/:id', async(req, res, next)=> {
    try{
        
        const SQL = `
            SELECT *
            FROM digimon
            WHERE id = $1
        `;
    //console.log(`tagsa`);
    const response = await client.query(SQL, [req.params.id]);
    if (!response.rows.length) {
      next({
        name: "MissingIDError",
        message: `Food with id ${req.params.id} not found`,
      });
    }
    //console.log(response.rows);
    res.send(response.rows[0]);
        
    }catch(error){
        next(error);
    }
});

app.delete('/api/digimon/:id', async(req, res, next)=> {
    try{
        
        const SQL = `
            DELETE
            FROM digimon
            WHERE id = $1
        `;
    //console.log(`tagsa`);
    const response = await client.query(SQL, [req.params.id]);
    if (!response.rows.length) {
        next({
          name: "MissingIDError",
          message: `Food with id ${req.params.id} not found`,
        });
    }
    //console.log(response.rows);
    res.send(response.rows);
        
    }catch(error){
        next(error);
    }
});
app.post('/api/digimon', async(req, res, next)=> {
    // const body = req.body;
    // console.log(body);
    try{
        const SQL= `
        INSERT INTO digimon(name, type, previousDigivolution)
        VALUES($1, $2, $3)
        RETURNING *
        `;
        const response = await client.query(SQL, [req.body.name, req.body.type, req.body.previousDigivolution]);
        res.send(response.rows);
    } catch (error){
        next(error);
    }

})
app.put('/api/digimon/:id', async(req, res, next)=> {
    try{
        const SQL= `
        UPDATE digimon
        SET name = $1, type = $2, previousDigivolution = $3
        WHERE id = $4
        RETURNING *
        `;
        const response = await client.query(SQL, [req.body.name, req.body.type, req.body.previousDigivolution, req.params.id]);
        if (!response.rows.length) {
            next({
              name: "MissingIDError",
              message: `Food with id ${req.params.id} not found`,
            });
        }
        res.send(response.rows);
    } catch (error){
        next(error);
    }

})

app.use('*', (req, res, next)=> {
    res.status(404).send("Invalid Route");
})

app.use((err, req, res, next)=> {
    res.status(500).send(err.message);
})

const start = async() => {
    await client.connect();
    //.log(`connected to db`);
    const PORT = process.env.PORT || 3000;
    const SQL = `
        DROP TABLE IF EXISTS digimon;
        CREATE TABLE digimon(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            type VARCHAR(100),
            previousDigivolution VARCHAR(100)
        );
        INSERT INTO digimon (name,type,previousDigivolution) VALUES ('catmon','mammel digimon','kittenmon');
        INSERT INTO digimon (name,type,previousDigivolution) VALUES ('frogmon','amphibian digimon','tadpolemon');
        INSERT INTO digimon (name,type,previousDigivolution) VALUES ('chickenmon','bird digimon','eggmon');
        INSERT INTO digimon (name,type,previousDigivolution) VALUES ('alligatormon','reptile digimon','babyalligatormon');
        INSERT INTO digimon (name,type,previousDigivolution) VALUES ('humon','mammel digimon','childmon');
    `
    await client.query(SQL);
    //console.log(`table seeded`);
    app.listen(PORT,() => {
        console.log(`listening on ${PORT}`);
    })
}
start();