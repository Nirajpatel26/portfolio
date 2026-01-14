# Setup Guide for nirajpatel.me

## ✅ What's Already Done

Your portfolio is now live at: **https://nirajpatel26.github.io/portfolio/**

The following has been completed:
- ✅ Modern, responsive portfolio website created
- ✅ All content from your resume added
- ✅ GitHub repository created with proper commit history
- ✅ CNAME file configured for custom domain
- ✅ Comprehensive README added

## 🚀 Next Steps to Connect Your Domain

### Step 1: Enable GitHub Pages
1. Go to your repository: https://github.com/Nirajpatel26/portfolio
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: `main` / (root)
5. Click **Save**
6. Under "Custom domain", enter: `nirajpatel.me`
7. Check "Enforce HTTPS" (wait a few minutes for SSL certificate)

### Step 2: Configure Namecheap DNS

Log into your Namecheap account and update DNS settings for `nirajpatel.me`:

#### A Records (IPv4):
| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 185.199.108.153 | Automatic |
| A Record | @ | 185.199.109.153 | Automatic |
| A Record | @ | 185.199.110.153 | Automatic |
| A Record | @ | 185.199.111.153 | Automatic |

#### CNAME Record:
| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME Record | www | nirajpatel26.github.io | Automatic |

### Step 3: Wait for DNS Propagation
- DNS changes can take 5 minutes to 48 hours
- Usually completes in 15-30 minutes
- Test at: https://www.whatsmydns.net/

### Step 4: Verify Custom Domain
After DNS propagates, visit:
- https://nirajpatel.me
- https://www.nirajpatel.me

Both should redirect to your portfolio!

## 📝 Optional Enhancements

### Add Your Profile Photo
1. Replace the SVG placeholder in `index.html` with:
```html
<div class="image-placeholder">
    <img src="your-photo.jpg" alt="Niraj Patel" style="width: 100%; height: 100%; object-fit: cover;">
</div>
```
2. Upload your photo to the repository
3. Update the `src` path

### Add Project Links
Update the GitHub links in the Projects section:
```html
<a href="https://github.com/yourusername/project-repo" target="_blank">
```

### Add Analytics (Optional)
Add Google Analytics to track visitors by adding the tracking code before `</head>` in `index.html`.

## 🔍 Testing Checklist

- [ ] Portfolio loads on desktop
- [ ] Portfolio loads on mobile
- [ ] All navigation links work
- [ ] Contact links (email, LinkedIn, GitHub, phone) work
- [ ] Custom domain resolves correctly
- [ ] HTTPS is enabled
- [ ] Mobile hamburger menu functions

## 🐛 Troubleshooting

### Domain not working?
- Check DNS settings match exactly as shown above
- Wait 24 hours for full propagation
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private browsing mode

### GitHub Pages not building?
- Check Settings → Pages shows "Your site is live at..."
- Verify main branch has index.html
- Check Actions tab for build errors

### HTTPS certificate error?
- Wait 15-30 minutes after adding custom domain
- Uncheck and recheck "Enforce HTTPS"
- Verify CNAME file contains only: `nirajpatel.me`

## 📞 Need Help?

If you encounter issues:
1. Check GitHub Pages status: https://www.githubstatus.com/
2. Review GitHub Pages docs: https://docs.github.com/pages
3. Namecheap DNS guide: https://www.namecheap.com/support/knowledgebase/

---

**Your portfolio is ready to go live! 🎉**

Built with ❤️ for data engineering excellence.