# Niraj Patel - Portfolio Website

Personal portfolio website showcasing my experience as a Data Platform Engineer and my journey through Software Engineering Systems at Northeastern University.

## 🌟 Features

- **Arcade Theme** - Retro-console styling: CRT frames, scanlines, pixel type, boot screen
- **Interactive** - Quest log, tiered inventory, skill tree, 8 unlockable achievements, konami code
- **Playable** - *SHIP IT!*, a canvas endless runner with a persisted high score
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Accessible** - Semantic HTML, keyboard-playable game, honours `prefers-reduced-motion`
- **Performance Optimized** - No dependencies, no build step, fast loading times

## 🛠️ Technologies Used

- HTML5 & Canvas
- CSS3 (with CSS Grid & Flexbox)
- Vanilla JavaScript
- Web Audio API (opt-in sound effects)
- Google Fonts (Press Start 2P, JetBrains Mono, Inter)

## 📂 Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── main.css            # Stylesheet with all styling
├── main.js             # JavaScript for interactivity
├── profile.jpg         # Profile photo
└── README.md           # Project documentation
```

## 🚀 Deployment

This portfolio is deployed using GitHub Pages and accessible at:
- **GitHub Pages**: https://nirajpatel26.github.io/portfolio/
- **Custom Domain**: https://nirajpatel.me (configured via Namecheap)

## 🔧 Local Development

To run this portfolio locally:

1. Clone the repository
```bash
git clone https://github.com/Nirajpatel26/portfolio.git
cd portfolio
```

2. Open `index.html` in your browser
```bash
# On macOS
open index.html

# On Windows
start index.html

# On Linux
xdg-open index.html
```

Or use a local server (recommended):
```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server

# VS Code Live Server extension
# Right-click on index.html and select "Open with Live Server"
```

## 🌐 Custom Domain Setup

To connect your Namecheap domain:

1. In your repository, go to **Settings** → **Pages**
2. Under "Custom domain", enter: `nirajpatel.me`
3. In Namecheap DNS settings, add these records:

```
Type    Host    Value                           TTL
A       @       185.199.108.153                 Automatic
A       @       185.199.109.153                 Automatic
A       @       185.199.110.153                 Automatic
A       @       185.199.111.153                 Automatic
CNAME   www     nirajpatel26.github.io          Automatic
```

4. Create a `CNAME` file in repository root with content: `nirajpatel.me`

## 📝 Sections

- **Home** - Introduction with quick stats and a flickering CRT portrait
- **01 Player Card** - Background, education, and attribute meters
- **02 Quest Log** - Professional work history as expandable quests
- **03 Inventory** - Technical projects, tiered by rarity and filterable
- **04 Skill Tree** - Technical skills as branches with mastery pips
- **05 Trophy Room** - Certifications, recommendations, and achievements
- **06 Arcade** - A playable mini-game
- **07 New Game** - Multiple ways to get in touch

## 📧 Contact

- **Email**: patel.niraju@northeastern.edu
- **LinkedIn**: [linkedin.com/in/niraj-patel](https://linkedin.com/in/niraj-patel)
- **GitHub**: [github.com/nirajpatel](https://github.com/nirajpatel)
- **Phone**: (857) 339-8633

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

While this is a personal portfolio, suggestions and feedback are welcome! Feel free to open an issue or submit a pull request.

---

Built with ❤️ by Niraj Patel