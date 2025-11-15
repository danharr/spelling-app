# Spelling App (Static site for GitHub Pages)

Small static spelling test app suitable for hosting on GitHub Pages or any static host.

Features
- Enter a list of words (one per line) — default has 10 words.
- Start a test: for each word the student hears the word when they press the audio icon.
- Check answers, navigate next, and see a results summary.

Usage
1. Open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari).
2. Edit the word list as needed, then click `Start Test`.
3. Press the 🔊 button during the test to hear the current word.

Local testing
From the project folder run a simple local server. For example with Python 3:

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Notes about speech
- This app uses the Web Speech API (`speechSynthesis`). Most modern desktop and mobile browsers support it, but voices and available languages vary by browser and OS.

Deploying to GitHub Pages
1. Create a GitHub repository and push this folder.
2. In repo settings -> Pages, select `main` branch (or `gh-pages`) and `/root` as publish source.
3. Wait a few minutes and visit the provided URL.

Next improvements (ideas)
- Add a "repeat automatically" option.
- Allow multiple tries or timed tests.
- Theme, accessibility improvements, voice selection, and adjustable speech rate.

GitHub Pages (live site)

If you've published this repository to GitHub Pages, the site will be available at:

`https://danharr.github.io/spelling-app`

Replace `danharr` with your GitHub username if different. If you publish from a branch other than `main` or a different path, use the URL provided in the repository Pages settings.
