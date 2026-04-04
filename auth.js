/* ============================================================
   CYBERGUARD - Auth Helper (shared across all pages)
   Include this script in every HTML page
   ============================================================ */

const AUTH = {
  TOKEN_KEY: 'cyberguard_token',
  USER_KEY: 'cyberguard_user',

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser() {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  login(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.location.href = 'login.html';
  },

  // Get auth headers for API calls
  headers() {
    const token = this.getToken();
    const h = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  },

  // Inject login/logout button into navbars
  renderNavAuth() {
    const user = this.getUser();
    const navLinks = document.querySelectorAll('.nav-links');
    const mobileMenus = document.querySelectorAll('.mobile-menu');

    if (user) {
      const btnHTML = `<a href="#" onclick="AUTH.logout();return false;" style="display:inline-flex;align-items:center;gap:0.35rem;padding:0.4rem 0.9rem;border-radius:8px;font-size:0.8rem;font-weight:700;letter-spacing:0.05em;background:#dc2626;color:#fff;transition:background 0.2s;" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'"><i data-lucide="log-out" style="width:14px;height:14px;"></i>LOGOUT</a>`;
      const nameHTML = `<span style="display:inline-flex;align-items:center;gap:0.35rem;padding:0.4rem 0.9rem;border-radius:8px;font-size:0.8rem;font-weight:700;letter-spacing:0.05em;background:rgba(34,197,94,0.15);color:#16a34a;"><i data-lucide="user" style="width:14px;height:14px;"></i>${user.name.split(' ')[0]}</span>`;
      navLinks.forEach(nl => { nl.insertAdjacentHTML('beforeend', nameHTML + btnHTML); });
      mobileMenus.forEach(mm => {
        mm.insertAdjacentHTML('beforeend', `<a href="#" onclick="AUTH.logout();return false;" style="color:#dc2626;">LOGOUT (${user.name.split(' ')[0]})</a>`);
      });
    } else {
      const btnHTML = `<a href="login.html" style="display:inline-flex;align-items:center;gap:0.35rem;padding:0.4rem 0.9rem;border-radius:8px;font-size:0.8rem;font-weight:700;letter-spacing:0.05em;background:#16a34a;color:#fff;transition:background 0.2s;" onmouseover="this.style.background='#15803d'" onmouseout="this.style.background='#16a34a'"><i data-lucide="log-in" style="width:14px;height:14px;"></i>LOGIN</a>`;
      navLinks.forEach(nl => { nl.insertAdjacentHTML('beforeend', btnHTML); });
      mobileMenus.forEach(mm => {
        mm.insertAdjacentHTML('beforeend', `<a href="login.html" style="color:#16a34a;">LOGIN / REGISTER</a>`);
      });
    }

    // Re-init lucide icons for the new elements
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  // API helper
  async api(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: this.headers()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  }
};

// Auto-render nav auth on DOM load
document.addEventListener('DOMContentLoaded', () => {
  AUTH.renderNavAuth();
});
