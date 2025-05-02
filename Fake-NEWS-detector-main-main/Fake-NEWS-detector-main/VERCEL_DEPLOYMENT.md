# Deploying the Fake News Detector to Vercel

This guide will help you deploy the Fake News Detector application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Git](https://git-scm.com/downloads) installed
3. [Node.js](https://nodejs.org/) installed (version 14+)

## Deployment Steps

### 1. Push your code to GitHub

Make sure your repository is up to date on GitHub.

### 2. Import your project to Vercel

1. Log in to your Vercel account
2. Click **Add New** > **Project**
3. Import your GitHub repository
4. Select the repository containing your Fake News Detector

### 3. Configure Vercel Project Settings

1. **Project Name**: Give your project a name
2. **Framework Preset**: Select **Vite**
3. **Root Directory**: Set to `Fake-NEWS-detector-main-main/Fake-NEWS-detector-main`
4. **Build Command**: Leave as default (`npm run build`)
5. **Output Directory**: Leave as default (`dist`)

### 4. Environment Variables

No environment variables are needed for this deployment.

### 5. Deploy

Click **Deploy**. Vercel will automatically build and deploy your project.

## Important Notes

1. **ML Model**: The deployment includes a serverless function for the ML model. However, the large model file `fake_news_model.pkl` and the dataset files `Fake.csv` and `True.csv` are not deployed because they are in .gitignore.

2. **Limitations**: The serverless functions are limited in execution time and memory. For production use with large models, consider using a dedicated ML hosting service.

3. **Evidence API**: The evidence API implemented as a serverless function is stateless between invocations. For persistence, consider using a database.

## Monitoring and Troubleshooting

After deployment, you can monitor your application in the Vercel dashboard:

1. View deployment logs
2. Check function execution metrics
3. Set up alerts for errors 