import express from 'express';
import cors from 'cors';


const app = express();
app.use(cors());


app.get('/', (req,res) => {
    res.send("DEFAULT")
})


app.listen(3333, () => {
    console.log("Listening on port 3333")
})
