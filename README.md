# Niraj Patel - Portfolio Website

Personal portfolio website showcasing my experience as a Data Platform Engineer and my journey through Software Engineering Systems at Northeastern University.

## 🌟 Features

- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Performance Optimized** - Fast loading times and efficient code
- **Accessible** - WCAG compliant with semantic HTML

## 🛠️ Technologies Used

- HTML5
- CSS3 (with CSS Grid & Flexbox)
- Vanilla JavaScript
- Google Fonts (Inter)

## 📂 Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet with all styling
├── script.js           # JavaScript for interactivity
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

- **Hero** - Introduction with quick stats
- **About** - Background, education, and certifications
- **Experience** - Professional work history timeline
- **Projects** - Featured technical projects
- **Skills** - Technical skills organized by category
- **Contact** - Multiple ways to get in touch

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