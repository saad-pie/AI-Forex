import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Lightweight pure TypeScript AI prediction logic for Vercel Serverless
app.get('/api/predict', (req: Request, res: Response) => {
    try {
        // Simulated multi-timeframe feature weighting (Gradient Boosting simulation)
        const mockRsi = 58.5;
        const mockMacd = 0.0021;
        const confidence = 78.4; // Percentage
        
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

// For local testing
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}

export default app;
}

// API Endpoint consumed by your GitHub Frontend Dashboard
app.get('/api/predict', async (req, res) => {
    try {
        // Simulated live market vector feed
        const liveSnapshot = tf.tensor2d([[1.0870, 1.0860, 1.0855, 68.5, 0.0025, 0.0035]]);
        const predictionTensor = model.predict(liveSnapshot) as tf.Tensor;
        const confidenceScore = await predictionTensor.data();
        
        const conf = confidenceScore[0];
        const action = conf > 0.5 ? "BUY" : "SELL";
        const confidencePercent = conf > 0.5 ? conf * 100 : (1 - conf) * 100;

        res.json({
            timestamp: new Date().toISOString(),
            symbol: "R_100",
            macro_4h_bias: "BULLISH",
            ai_action: action,
            confidence: Number(confidencePercent.toFixed(2)),
            news_filter_passed: true,
            mtf_aligned: true,
            execute_trade: confidencePercent > 65,
            risk_reward: "1:3.0"
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

initializeAIModel().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 TS AI Backend running locally at http://localhost:${PORT}`);
    });
});
          
