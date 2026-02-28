import express from 'express';

const app = express();
const PORT = 8082;
let behavior = 'normal';

app.use(express.json());

// 1. Movies Endpoint
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

// 2. Simulation Endpoint (FIXED to match Recommendation Service call)
app.post('/simulate', (req, res) => {
    const { behavior: newBehavior } = req.body; // Extract from body
    if (newBehavior) {
        behavior = newBehavior;
        console.log(`Content Service behavior updated to ${behavior}`);
        return res.json({ status: "success", behavior });
    }
    res.status(400).json({ error: "Behavior not provided" });
});

app.get('/health', (req, res) => res.sendStatus(200));

app.listen(PORT, () => console.log(`Content Service running on ${PORT}`));