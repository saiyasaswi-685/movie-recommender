import express, { Request, Response } from 'express';
import axios from 'axios';
import CircuitBreaker from 'opossum';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.API_PORT || 8080;

app.use(express.json());

// 1. Circuit Breaker Options (Requirement #5, #6, #10)
const cbOptions = {
    timeout: 2000, // Request timeout: 2 seconds
    errorThresholdPercentage: 50, // Failure threshold: 50%
    resetTimeout: 30000, // OPEN state duration: 30 seconds
};

// 2. Service Call Functions
const fetchUserProfile = async (userId: string) => {
    const res = await axios.get(`${process.env.USER_PROFILE_URL}/user/${userId}`);
    return res.data;
};

const fetchContent = async (preferences: string[]) => {
    const res = await axios.get(`${process.env.CONTENT_URL}/movies`, { 
        params: { genres: preferences.join(',') } 
    });
    return res.data;
};

// 3. Initialize Breakers
const userProfileBreaker = new CircuitBreaker(fetchUserProfile, cbOptions);
const contentBreaker = new CircuitBreaker(fetchContent, cbOptions);

// 4. Fallback Logic (Requirement #8)
userProfileBreaker.fallback(() => ({
    userId: "default",
    preferences: ["Comedy", "Family"], // Default hard-coded preferences
    fallback: true
}));

// 5. Simulation Control Endpoints (Requirement #3)
app.post('/simulate/:service/:behavior', async (req: Request, res: Response) => {
    const { service, behavior } = req.params;
    const targetUrl = service === 'user-profile' 
        ? process.env.USER_PROFILE_URL 
        : process.env.CONTENT_URL;

    try {
        await axios.post(`${targetUrl}/simulate`, { behavior });
        res.json({ message: `Simulation updated: ${service} is now ${behavior}` });
    } catch (err) {
        res.status(500).json({ error: `Failed to notify ${service} service` });
    }
});

// 6. Main Recommendation Endpoint (Requirement #4, #9)
app.get('/recommendations/:userId', async (req: Request, res: Response) => {
    // FIX: Type Casting (as string) to resolve TS2345 error
    const userId = req.params.userId as string;

    try {
        const userProfile = await userProfileBreaker.fire(userId);
        let recommendations: any[] = [];
        
        try {
            recommendations = await contentBreaker.fire(userProfile.preferences);
        } catch (err) {
            recommendations = [];
        }

        if (userProfile.fallback && recommendations.length === 0) {
            const trending = await axios.get(`${process.env.TRENDING_URL}/trending`);
            return res.json({
                message: "Our recommendation service is temporarily degraded. Here are some trending movies.",
                trending: trending.data,
                fallback_triggered_for: "user-profile-service, content-service"
            });
        }

        const response: any = { user: userProfile, movies: recommendations };
        if (userProfile.fallback) response.fallback_triggered_for = "user-profile-service";
        
        res.json(response);

    } catch (error) {
        res.status(500).json({ error: "Critical System Failure" });
    }
});

// 7. Metrics Endpoint (Requirement #11)
app.get('/metrics/circuit-breakers', (req: Request, res: Response) => {
    res.json({
        userProfileCircuitBreaker: {
            state: userProfileBreaker.opened ? "OPEN" : (userProfileBreaker.halfOpen ? "HALF_OPEN" : "CLOSED"),
            successfulCalls: userProfileBreaker.stats.fires - userProfileBreaker.stats.failures,
            failedCalls: userProfileBreaker.stats.failures
        },
        contentCircuitBreaker: {
            state: contentBreaker.opened ? "OPEN" : (contentBreaker.halfOpen ? "HALF_OPEN" : "CLOSED"),
            successfulCalls: contentBreaker.stats.fires - contentBreaker.stats.failures,
            failedCalls: contentBreaker.stats.failures
        }
    });
});

app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));