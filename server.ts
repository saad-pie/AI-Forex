import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Determine correct static files path for Vercel vs Local
const publicPath = path.join(__dirname, '../');
app.use(express.static(publicPath));
app.use(express.static(path.join(__dirname, './')));

// AI prediction endpoint for Vercel Serverless
app.get('/api/predict', (req: Request, res: Response) => {
    try {
        const mockRsi = 58.5;
        const confidence = 78.4;
        
        const action = mockRsi > 50 ? "BUY" : "SELL";
        const executeTrade = confidence > 65;

        res.json({
            timestamp: new Date().toISOString(),
            symbol: "R_100",
            macro_4h_bias: "BULLISH",
            ai_action: action,
            confidence: confidence,
            news_filter_passed: true,
            mtf_aligned: true,
            execute_trade: executeTrade,
            risk_reward: "1:3.0"
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Fallback route to serve index.html safely
app.get('*', (req: Request, res: Response) => {
    const indexPath = path.resolve(__dirname, '../index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.sendFile(path.resolve(__dirname, './index.html'), (err2) => {
                if (err2) res.status(404).send("Index.html not found in server bundle.");
            });
        }
    });
});

// Local testing fallback
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}

export default app;
