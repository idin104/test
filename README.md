# 🎮 خزانه بازی | Game Vault

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bilingual](https://img.shields.io/badge/Language-Persian%20%7C%20English-blue?style=for-the-badge)

**یک وب‌اپلیکیشن شیک و سینمایی برای نمایش و بررسی بهترین بازی‌های تاریخ ویدیوگیم.**  
*A cinematic, bilingual web showcase of timeless video games crafted with pure web technologies.*

---

[فارسی](#-فارسی) • [English](#-english)

---

</div>

<br>

---

## 🇮🇷 فارسی

### 📖 درباره پروژه
**خزانه بازی (Game Vault)** یک وب‌سایت تک‌صفحه‌ای (SPA) تعاملی و مدرن با رابط کاربری تیره (Dark Mode) است که برای معرفی و آرشیو شاهکارهای دنیای بازی‌های ویدیویی طراحی شده است. این پروژه با انیمیشن‌های چندمرحله‌ای نرم، سیستم تعاملی پرونده‌خوانی بازی و پشتیبانی کامل از دو زبان فارسی و انگلیسی پیاده‌سازی شده است.

### ✨ ویژگی‌ها
- 🌐 **کاملاً دوزبانه (فارسی و انگلیسی):** تغییر آنی زبان با کلید اختصاصی در هدر، هماهنگ‌سازی راست‌چین (RTL) و چپ‌چین (LTR)، و ذخیره انتخاب کاربر در حافظه محلی (`localStorage`).
- 🎬 **پنجره پرونده سینمایی (Cinematic Modal):** پیاده‌سازی ماشین حالت سفارشی (State Machine) برای باز شدن نرم، نمایش جزئیات و خروج.
- 📱 **کاملاً واکنش‌گرا و لمسی (Responsive & Mobile-First):** پشتیبانی از ژست لمسی سوایپ به سمت پایین (Swipe-to-Dismiss) برای بستن پنجره در موبایل.
- ⚡ **پیاده‌سازی خالص (Vanilla Stack):** ساخته‌شده صرفاً با HTML5، CSS3 و جاوااسکریپت خام و بدون نیاز به هیچ فریم‌ورک خارجی.
- 📊 **اطلاعات کامل عناوین:** نمایش امتیازهای متاکریتیک، سبک، استودیو سازنده، تاریخ انتشار و ویژگی‌های کلیدی هر بازی.

### 🕹 عناوین موجود در خزانه
- Detroit: Become Human
- Resident Evil 4 Remake
- The Last of Us Part I
- Elden Ring
- Cyberpunk 2077
- God of War Ragnarök
- Stronghold Crusader
- Minecraft
- EA Sports FC 26 
- Grand Theft Auto VI *(به‌زودی)*

### 🛠 تکنولوژی‌های استفاده‌شده
- **HTML5:** استفاده از تگ استاندارد `<dialog>` و دسترس‌پذیری کامل (ARIA).
- **CSS3:** استفاده از متغیرهای CSS، گرادینت‌های چندلایه، گرید، فلکس‌باکس و بافت نویز.
- **JavaScript (ES6+):** مدیریت وضعیت مودال، رندر پویای داده‌ها و پوینتر ایونت‌ها.
- **فونت‌ها:** وزیرمتن (فارسی) و Manrope (انگلیسی).

---

### 🚀 راهنمای گام‌به‌گام اجرا

برای اجرای این پروژه روی کامپیوتر خود، یکی از روش‌های زیر را انتخاب کنید:

#### روش ۱: اجرای مستقیم (سریع‌ترین روش)
1. مخزن را دانلود یا کلون کنید:
```bash
   git clone https://github.com/ItWorksOnMyPC4077/game-vault.git
   
وارد پوشه پروژه شوید:
bash
   cd game-vault
   
فایل index.html را در هر مرورگری (Chrome, Edge, Firefox) دابل‌کلیک کنید تا باز شود!
روش ۲: اجرا با افزونه Live Server در VS Code (پیشنهادی برای توسعه‌دهندگان)
پروژه را با VS Code باز کنید:
bash
   code .
   
افزونه Live Server (ساخته Ritwick Dey) را نصب کنید.
روی فایل index.html راست‌کلیک کرده و گزینه Open with Live Server را بزنید (یا کلیدهای Alt + L سپس Alt + O را فشار دهید).
پروژه در آدرس http://127.0.0.1:5500 روی مرورگر اجرا می‌شود.
روش ۳: اجرا با پایتون (بدون نیاز به نرم‌افزار اضافی)
اگر پایتون روی سیستمتان نصب است:

bash
# وارد پوشه پروژه شوید
cd game-vault

# سرور محلی را اجرا کنید
python -m http.server 8000
سپس مرورگر را باز کرده و به آدرس http://localhost:8000 بروید.

<br>

🇬🇧 English
📖 About The Project
Game Vault is a modern, single-page web archive and interactive showcase dedicated to legendary video games. Featuring a dark cinematic aesthetic, fluid multi-step animations, and full bilingual support, it delivers an immersive gaming-catalog experience right inside the browser.

✨ Key Features
🌐 Fully Bilingual (FA / EN): Seamless real-time language toggle with RTL/LTR switching and persistent user preferences stored in localStorage.
🎬 Cinematic Modal Dossier: Custom state-machine animation pipeline handling card transitions, background blur, and progressive reveals.
📱 Mobile-First & Touch-Friendly: Responsive grid layout with touch-gesture support (swipe down to dismiss the modal on mobile devices).
⚡ Pure Vanilla Stack: Built entirely from scratch using semantic HTML5, CSS3, and modern Vanilla JavaScript without any heavy external dependencies.
📊 Comprehensive Game Data: Curated facts including Metacritic scores, developers, release years, genres, descriptions, and signature gameplay highlights.
🕹 Featured Titles
Detroit: Become Human
Resident Evil 4 Remake
The Last of Us Part I
Elden Ring
Cyberpunk 2077
God of War Ragnarök
Stronghold Crusader
Minecraft
EA Sports FC 26 
Grand Theft Auto VI (Upcoming)
🛠 Tech Stack
HTML5: Semantic architecture, accessible ARIA attributes, and native HTML Dialog API.
CSS3: Custom properties (CSS variables), Grid, Flexbox, Glassmorphism, and Noise overlays.
JavaScript (ES6+): State management, dynamic DOM rendering, and Pointer Events for touch gestures.
Typography: Vazirmatn (Farsi) & Manrope (English).
🚀 How to Run Locally
Choose any of the following methods to run the project on your machine:

Method 1: Direct Run (Fastest)
Clone the repository:
bash
   git clone https://github.com/ItWorksOnMyPC4077/game-vault.git
   
Navigate to the project directory:
bash
   cd game-vault
   
Simply double-click index.html to launch it in your default web browser.
Method 2: Using VS Code Live Server (Recommended)
Open the project folder in Visual Studio Code:
bash
   code .
   
Install the Live Server extension by Ritwick Dey.
Right-click on index.html and select “Open with Live Server” (or press Alt + L, Alt + O).
The site will automatically open at http://127.0.0.1:5500.
Method 3: Using Python HTTP Server
If Python is installed on your system:

bash
# Navigate to project folder
cd game-vault

# Start a local static server
python -m http.server 8000
Then navigate to http://localhost:8000 in your browser.

👨‍💻 Author / سازنده
AmirAli (ItWorksOnMyPC4077)
Passionate about front-end architecture, game culture, and software engineering.
<div align=“center”>

Made with ❤️ for passionate gamers.

</div>

`
