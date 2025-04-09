# wluring

**wluring** is a lightweight **webring** for **Wilfrid Laurier University** students, allowing personal or club sites to link to one another in a circular, community-driven fashion.

## 🔗 Overview

**wluring** lets students link their personal or club websites together in a loop. Each site displays a "next" and "previous" link, allowing visitors to explore other Laurier sites in the ring.

- 🔄 Circular navigation through all member sites
- ✨ Simple, clean interface
- 🔐 Laurier 2FA login using Redis for verification code caching

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend**: Node.js 
- **Cache / OTP Store**: [Redis](https://upstash.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## ⚙️ Features

- Add your website to the ring
- 2FA-protected admin tools (via laurier email)
- Seamless navigation to previous/next entries
- Redis-backed temporary storage for secure 2FA code validation
- Automatic PR request directly from website 

## ? How you get added ?

No need to make a PR just use the input system after authenticating!

## 🌐 Webring Navigation Snippet

Add this to your website to join the **Laurier Webring**! Replace `your-username` with your actual ring username.


→ [Click here to download wluring logo](https://raw.githubusercontent.com/taseskics/wluring/main/docs/wluring_white.png)

```html
<!-- Ring Navigation Links for wluring -->
<div style="margin-top: 2rem; text-align: center;">
  <a href="https://wluring.xyz/api/your-username/prev" style="margin-right: 1.5rem;">← Previous</a>
  <a href="https://wluring.xyz"><img src='/wluring_white.png'></a>
  <a href="https://wluring.xyz/api/your-username/next" style="margin-left: 1.5rem;">Next →</a>
</div>

