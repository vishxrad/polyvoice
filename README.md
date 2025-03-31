# Poly Voice: Breaking Language Barriers in Digital Media

## Project Description

Poly Voice is a platform designed to eliminate language barriers in accessing and engaging with digital media. We provide real-time, accurate subtitles and audio dubbing, enabling users to enjoy videos in their preferred languages. Our platform also facilitates seamless communication in multilingual watching rooms.

## Problem Statement

Accessing digital content in diverse languages is often challenging. Traditional subtitling and dubbing are time-consuming and expensive. Many online platforms lack robust multilingual support, limiting accessibility and inclusivity.

## Solution

Poly Voice addresses this problem by leveraging cutting-edge open-source technologies to provide:

* **Real-time Subtitles and Dubbing:** Using Whisper for speech-to-text, Facebook's NLLB for translation, and Coqui TTS for voice synthesis.
* **Synchronized Watching Rooms:** Allowing users to watch videos simultaneously with personalized language preferences.
* **Real-time Chat Translation:** Enabling seamless communication among users with different language backgrounds.

## Technologies Used

* **Speech-to-Text:** Whisper (OpenAI)
* **Translation:** Facebook's NLLB (No Language Left Behind)
* **Text-to-Speech:** Coqui TTS
* **Backend:** Flask (Python)
* **Media Processing:** FFmpeg
* **Real-time Communication:** WebSockets (Node.js)
* **Chat Translation:** JavaScript Translation API
* **Frontend:** React
* **UI Library:** Hero UI

## Features

* **Real-time Subtitle Generation:** Automatic generation of subtitles in multiple languages.
* **Real-time Audio Dubbing:** Automatic generation of audio dubbing in multiple languages.
* **Synchronized Watching Rooms:** Shared viewing experience with personalized language settings.
* **Real-time Chat Translation:** Instant translation of chat messages.
* **User-Friendly Interface:** Intuitive and accessible design.
* **Open-Source Focus:** Utilizing only open-source technologies.

## How to Run

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/vishxrad/polyvoice/
    cd polyvoice
    ```
2.  **Backend Setup (Flask):**
    * Install Python dependencies: `pip install -r requirements.txt`
    * Run the Flask application: `python app.py`
3.  **WebSocket Setup (Node.js):**
    * Install Node.js dependencies: `pnpm install`
    * Run the WebSocket server: `node server.mjs`
4.  **Frontend Setup (React):**
    * Navigate to the frontend directory: `cd frontend`
    * Install Node.js dependencies: `pnpm install`
    * Run the React application: `pnpm run dev`
5.  **FFmpeg Setup:**
    * Ensure FFmpeg is installed and accessible in your system's PATH.

## Team Members

* Nandishwar Singh - Frontend and Node(Sockets) Developer 
* Visharad Kashyap - Backend and AI Developer

## Future Improvements

* **Improved Accuracy:** Fine-tuning models for better speech-to-text, translation, and text-to-speech.
* **Expanded Language Support:** Adding support for more languages.
* **Advanced User Customization:** Allowing users to customize subtitle and dubbing settings.
* **Integration with Streaming Platforms:** Enabling direct integration with popular streaming services.
* **Accessibility Features:** Adding features for users with disabilities.
* **Server Side rendering:** Implementing SSR for better SEO and performance.

## Future Business Prospectus/Model

Poly Voice has significant potential for various business models:

* **B2B Integration with Streaming Platforms:**
    * Offer Poly Voice as an API or SDK for streaming services to enhance their multilingual capabilities.
    * Revenue through subscription fees or usage-based pricing.
* **B2C Subscription Service:**
    * Provide a premium subscription for users to access advanced features, such as higher-quality dubbing voices, exclusive language packs, and ad-free experience.
    * Freemium model with limited features for free users.
* **Content Localization Services:**
    * Offer professional localization services for content creators, including accurate subtitling, dubbing, and cultural adaptation.
    * Project-based pricing.
* **Educational Platform Integration:**
    * Partner with online learning platforms to provide multilingual access to educational content.
    * Revenue through platform partnerships or per-user fees.
* **Advertising and Sponsorship:**
    * Integrate non-intrusive advertisements into the platform, respecting user privacy.
    * Partnerships with language learning tools, or related products.
* **Data Licensing:**
    * Anonymized and aggregated data from the platform's usage can be licensed for linguistic research and market analysis.
* **API for Developers:**
    * Offer the core translation and dubbing functionalities as an API, so other developers can use the tech in their own projects.

**Key Advantages for Business Growth:**

* **Scalability:** The open-source nature of the technologies allows for easy scalability.
* **Cost-Effectiveness:** Utilizing open-source solutions reduces development and operational costs.
* **Global Reach:** Addressing a global need for multilingual content access.
* **Community-Driven Development:** Leveraging the open-source community for continuous improvement.
* **First Mover Advantage:** By providing a fully open sourced solution, poly voice can become the standard for multilingual media.

## Presentation

* **Demo Video:** [[Link to Demo Video]](https://youtu.be/FsnVjhvz7Lg)
* **Presentation Slides:** [Link to Presentation Slides]

## Repository Link

* https://github.com/vishxrad/polyvoice

## License

* MIT
