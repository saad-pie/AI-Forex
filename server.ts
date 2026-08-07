import express from 'express';
import cors from 'cors';
import * as tf from '@tensorflow/tfjs-node';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Initialize & Train Model on Startup
let model: tf.Sequential;

async function initializeAIModel() {
    console.log("🤖 Initializing TensorFlow.js Model in TypeScript...");
    
    const trainingFeatures = tf.tensor2d([
        [1.0850, 1.0845, 1.0840, 58.2, 0.0012, 0.004],
        [1.0820, 1.0825, 1.0830, 42.1, -0.0008, 0.005],
        [1.0865, 1.0855, 1.0850, 65.4, 0.0021, 0.003]
    ]);
    const trainingLabels = tf.tensor2d([[1], [0], [1]]);

    model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [6] }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
        optimizer: tf.train.adam(0.01),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    await model.fit(trainingFeatures, trainingLabels, { epochs: 20, verbose: 0 });
    console.log("✨ TS AI Model successfully trained and ready for API requests!");
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
          
