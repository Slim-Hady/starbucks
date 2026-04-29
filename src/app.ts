import express from 'express';

import morgan from 'morgan';

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.set('query parser', 'extended');

app.get('/' , (req , res) => {
    res.send("Hello From the server");
})

