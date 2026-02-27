import express from 'express';

const app = express();
const PORT = 8082;
let behavior = 'normal';

app.use(express.json());

app.get('/movies', (req, res) => {
    if (behavior === 'fail') return res.status(500).json({ error: "Content Service Failed" });
    if (behavior === 'slow') {
        return setTimeout(() => {
            res.json([
                { movieId: 101, title: "Inception", genre: "Sci-Fi" },
                { movieId: 102, title: "The Dark Knight", genre: "Action" }
            ]);
        }, 3000);
    }
    res.json([
        { movieId: 101, title: "Inception", genre: "Sci-Fi" },
        { movieId: 102, title: "The Dark Knight", genre: "Action" }
    ]);
});

app.post('/set-behavior/:newBehavior', (req, res) => {
    behavior = req.params.newBehavior;
    res.send(`Content Service behavior updated to ${behavior}`);
});

app.get('/health', (req, res) => res.sendStatus(200));
app.listen(PORT, () => console.log(`Content Service running on ${PORT}`));