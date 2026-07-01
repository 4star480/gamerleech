# GamerLeech - Netlify Deployment

This folder contains all the files needed to deploy the GamerLeech website to Netlify.

## 📦 Contents

- **HTML Files**: `index.html`, `shop.html`, `checkout.html`
- **Styles**: `styles.css`
- **Scripts**: `script.js`
- **Data**: `data/products.json`
- **Assets**: `assets/` folder (icons, logos, illustrations)
- **Images**: `Images/` folder (product images, barcodes)
- **Configuration**: `netlify.toml` (Netlify deployment settings)
- **Redirects**: `_redirects` (for SPA routing)

## 🚀 How to Deploy to Netlify

### Option 1: Drag & Drop (Easiest)
1. Go to [Netlify](https://app.netlify.com/)
2. Log in or create an account
3. Drag and drop this entire `netlify-deploy` folder onto the Netlify dashboard
4. Your site will be deployed automatically!

### Option 2: Git Integration
1. Create a new repository on GitHub/GitLab
2. Upload the contents of this folder to the repository
3. In Netlify, click "New site from Git"
4. Connect your repository
5. Set the publish directory to `.` (root)
6. Deploy!

### Option 3: Netlify CLI
```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Navigate to this folder
cd netlify-deploy

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## ⚙️ Configuration

The `netlify.toml` file is already configured with:
- ✅ Security headers
- ✅ Cache optimization
- ✅ SPA routing redirects
- ✅ No build step required (static site)

## 📝 Notes

- The site is fully static and requires no build process
- All images and assets are included
- EmailJS integration is configured (you may need to set up your EmailJS account)
- The site uses client-side JavaScript for all functionality

## 🔗 After Deployment

Once deployed, Netlify will provide you with:
- A unique URL (e.g., `your-site.netlify.app`)
- Option to add a custom domain
- SSL certificate (automatic)
- CDN distribution (automatic)

## ✨ Features Included

- ✅ Shop page with product listings
- ✅ Shopping cart functionality
- ✅ Checkout with crypto payment options
- ✅ Contact form
- ✅ Responsive design
- ✅ All product images and logos

---

**Ready to deploy!** Just drag this folder to Netlify or use one of the methods above.



