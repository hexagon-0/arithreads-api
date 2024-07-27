import express from 'express';
import 'dotenv/config';

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (_req, res) => {
    return res.json({
        'hello': 'world',
    });
});

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
