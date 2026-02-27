import express, { Request, Response } from 'express';

const app = express();
const PORT = 8081;

// Behavior state: 'normal', 'slow', leda 'fail'
let behavior: string = 'normal';

app.use(express.json());

// Main Endpoint to fetch user data
app.get('/user/:userId', (req: Request, res: Response) => {
    if (behavior === 'fail') {
        return res.status(500).json({ error: "Service Failed" });
    }
    
    if (behavior === 'slow') {
        // 3 seconds delay simulate chestunnam (Timeout test cheyadaniki)
        return setTimeout(() => {
            res.json({ userId: req.params.userId, preferences: ["Action", "Sci-Fi"] });
        }, 3000);
    }

    // Normal behavior
    res.json({ userId: req.params.userId, preferences: ["Action", "Sci-Fi"] });
});

// Endpoint to change behavior dynamically (Requirement #3)
app.post('/set-behavior/:newBehavior', (req: Request, res: Response) => {
    // FIX: Ikkada 'as string' use chesi Type Casting chestunnam
    const newBehavior = req.params.newBehavior as string; 
    behavior = newBehavior;
    
    console.log(`User Service behavior changed to: ${behavior}`);
    res.send(`Behavior updated to ${behavior}`);
});

// Health check endpoint for Docker Compose
app.get('/health', (req: Request, res: Response) => {
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`User Profile Service running on port ${PORT}`);
});