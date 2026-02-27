import express, { Request, Response } from 'express';
import axios from 'axios';
import CircuitBreaker from 'opossum';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.API_PORT || 8080;

app.use(express.json());

// Circuit Breaker Options
const cbOptions = {
    timeout: 2000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000
};

// Functions to call other services
const fetchUserProfile = async (userId: string) => {
    const res = await axios.get(`${process.env.USER_PROFILE_URL}/user/${userId}`);
    return res.data;
};

const fetchContent = async (preferences: string[]) => {
    const res = await axios.get(`${process.env.CONTENT_URL}/movies`, { params: { genres: preferences.join(',') } });
    return res.data;
};

const userProfileBreaker = new CircuitBreaker(fetchUserProfile, cbOptions);
const contentBreaker = new CircuitBreaker(fetchContent, cbOptions);

// Fallback for User Profile
userProfileBreaker.fallback(() => ({
    userId: "default",
    preferences: ["Comedy", "Family"],
    fallback: true
}));

// Main Recommendation Endpoint
app.get('/recommendations/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId as string; // Fix for TS2345 error

    try {
        const userProfile = await userProfileBreaker.fire(userId);
        let recommendations: any[] = [];
        
        try {
            recommendations = await contentBreaker.fire(userProfile.preferences);
        } catch (err) {
            recommendations = [];
        }

        // Final Fallback to Trending
        if (userProfile.fallback && recommendations.length === 0) {
            const trending = await axios.get(`${process.env.TRENDING_URL}/trending`);
            return res.json({
                message: "Service degraded. Showing trending movies.",
                trending: trending.data,
                fallback: "active"
            });
        }

        res.json({ user: userProfile, movies: recommendations });
    } catch (error) {
        res.status(500).json({ error: "Service unavailable" });
    }
});

// Metrics for Interviewer
app.get('/metrics/circuit-breakers', (req: Request, res: Response) => {
    res.json({
        userProfile: userProfileBreaker.opened ? "OPEN" : "CLOSED",
        content: contentBreaker.opened ? "OPEN" : "CLOSED"
    });
});

app.listen(PORT, () => console.log(`Gateway running on ${PORT}`));