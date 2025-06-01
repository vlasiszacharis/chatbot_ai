# Theater Box App

A React Native (Expo) PWA for chatting and theater info. Live PWA: [https://chatbotaiaueb.netlify.app/](https://chatbotaiaueb.netlify.app/)

## Installation & Running App

1. npm install
2. npm run web

## LLM Integration & Backend Overview

For the communication between the LLM and the app, we used a kaggle notebook that creates a ngrok link to send and receive the information we need to the LLM. You need to add, on the Secrets tab, a Google AI Studio API Key and a ngrok Auth Key. Then you can run each block of code. The last one will give a public link on the output. Add this link to the API_URL field on ChatScreen.js. After a while, the app will be connected to LLM.