import express, { Request, Response } from 'express';

const app = express();
const PORT = 8081;

// Behavior state: 'normal', 'slow', or 'fail'
let currentBehavior: string = 'normal';

app.use(express.json());

// 1. User Data Endpoint
app.get('/user/:userId', (req: Request, res: Response) => {
    if (currentBehavior === 'fail') {
        // Requirement #3: fail state returns 500
        return res.status(500).json({ error: "Internal Server Error" });
    }
    
    if (currentBehavior === 'slow') {
        // Requirement #3: slow state responds with 3s delay
        return setTimeout(() => {
            res.json({ userId: req.params.userId, preferences: ["Action", "Sci-Fi"] });
        }, 3000);
    }

    // Requirement #3: normal behavior fast response
    res.json({ userId: req.params.userId, preferences: ["Action", "Sci-Fi"] });
});

// 2. Simulation Endpoint (FIXED to match Recommendation Service)
// Matches Recommendation Service call: axios.post(`${targetUrl}/simulate`, { behavior });
app.post('/simulate', (req: Request, res: Response) => {
    const { behavior } = req.body;
    
    if (['normal', 'slow', 'fail'].includes(behavior)) {
        currentBehavior = behavior;
        console.log(`User Service behavior changed to: ${currentBehavior}`);
        return res.json({ status: "success", behavior: currentBehavior });
    }
    
    res.status(400).json({ error: "Invalid behavior type" });
});

// 3. Health check for Docker (Requirement #1)
app.get('/health', (req: Request, res: Response) => {
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`User Profile Service running on port ${PORT}`);
});