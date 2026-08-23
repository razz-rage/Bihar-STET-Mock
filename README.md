# Bihar STET CS Prep Platform

A fast, lightweight web app built for Bihar STET Computer Science Paper II prep. It runs entirely in the browser with zero backend setup.

## How it works
This platform is built to be simple and unbreakable. There is no cloud database, API, or server framework to manage. It pulls React and Tailwind directly via CDN, renders in the browser, and saves all test progress to local storage. 

## Features
* **Full Mock Tests:** 75 questions timed strictly to 75 minutes.
* **Practice Mode:** Untimed sessions with instant explanations.
* **PYQ Library:** Previous year questions mapped by topic and difficulty.
* **Local Analytics:** Tracks scores, accuracy, and overall growth on the device.
* **Smart Access:** Passcodes are securely hashed in the browser. 
* **Share to Unlock:** Users must share the platform link before they get the admin contact info to request a passcode.
* **Direct JSON Reporting:** If a user spots a typo in a question, they can flag it. The app formats their correction into pure JSON, ready to be pasted back into the database.

## Tech Stack
* React 18 & Babel (CDN)
* Tailwind CSS
* Native Browser APIs (Local Storage, Web Share, Crypto)
* A single `questions.json` file for data handling

## Running it locally
1. Clone or download the repo.
2. Open `index.html` using a local server (like the Live Server extension in VS Code). 

*Note: If you just double-click the HTML file to open it, your browser's security rules will block it from loading the `questions.json` file.*

## Updating the Question Bank
All questions live inside `questions.json`. To fix a typo or add new material:
1. Open `questions.json`.
2. Find the target question ID, or paste in a new question block.
3. Commit and push your changes. GitHub Pages will automatically update the live site.
