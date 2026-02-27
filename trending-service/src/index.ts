import express, { Request, Response } from 'express';

const app = express();
const PORT = 8083;

// Mock trending movies data
const trendingMovies = [
    { movieId: 99, title: "Trending Movie 1", genre: "Popular" },
    { movieId: 98, title: "Trending Movie 2", genre: "New Release" },
    { movieId: 97, title: "Trending Movie 3", genre: "Classic" }
];

// Endpoint: Trending movies returns always (Requirement #9)
app.get('/trending', (req: Request, res: Response) => {
    res.json(trendingMovies);
});

// Health check for Docker (Requirement #1)
app.get('/health', (req: Request, res: Response) => {
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Trending Service is stable and running on port ${PORT}`);
});