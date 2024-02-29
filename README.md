![preview|690x388](/screenshots/Featured_banner.png)
<br>

**An open-source, Islamic application that runs on Windows, Mac, and Linux operating systems. A modern app that provides a Muslim with the means to preserve his/her faith.**


<br>

---

# Contents

- [Features](#App-Features)
- [Screenshots](#screenshots)
- [Download the app](#Download)
- [Installation](#Installation)
- [FAQs](#FAQs)
- [Contribute to the project](#contribute-to-the-project)
- [Running in developer mode](#running-in-development-mode)
- [Build from source](#build-from-source)
- [Dependencies](#Dependencies)
- [Sources](#Sources)
- [Contributors](#Contributors)

---

# App Features

<br>

- The Noble Quran `text and audio`
- A large collection of adhkar for morning, evening, daily life, sleep, and prayer
- Various praises and supplications
- Hisnul Muslim (**Fortress of the Muslim**)
- English translation and transliteration available for Quran and Adhkar
- Prayer times according to your location coordinates and time zone
- Various methods of calculating prayer times (**Umm al-Qura, Muslim World League and more...**)
- Audio notification (**for the call to prayer**)
- Audio notification of morning and evening dhikr at a user-specific time
- Download content to local directory for offline use
- Customizable settings and user-interface
- Modern, user-friendly design with light and dark modes
- Completely free and open source under the GNU General Public License `GPL-3.0`
- Support for Windows, Mac, and Linux operating systems

<br>

---

# Screenshots

<br>

| **Dark Mode**                         | **Light Mode**                         |
| :------------------------------------ | -------------------------------------- |
| ![altaqwaa](/screenshots/dark/1.png)  | ![altaqwaa](/screenshots/light/1.png)  |
| ![altaqwaa](/screenshots/dark/2.png)  | ![altaqwaa](/screenshots/light/2.png)  |
| ![altaqwaa](/screenshots/dark/3.png)  | ![altaqwaa](/screenshots/light/3.png)  |
| ![altaqwaa](/screenshots/dark/4.png)  | ![altaqwaa](/screenshots/light/4.png)  |
| ![altaqwaa](/screenshots/dark/5.png)  | ![altaqwaa](/screenshots/light/5.png)  |
| ![altaqwaa](/screenshots/dark/6.png)  | ![altaqwaa](/screenshots/light/6.png)  |
| ![altaqwaa](/screenshots/dark/7.png)  | ![altaqwaa](/screenshots/light/7.png)  |
| ![altaqwaa](/screenshots/dark/8.png)  | ![altaqwaa](/screenshots/light/8.png)  |
| ![altaqwaa](/screenshots/dark/9.png)  | ![altaqwaa](/screenshots/light/9.png)  |
| ![altaqwaa](/screenshots/dark/10.png) | ![altaqwaa](/screenshots/light/10.png) |

<br>

<div align="center">
  
**Settings**
  
  ![altaqwaa](/screenshots/settings.png)


</div>

<br>

---

# Download

<!-- <p align="center">
  <a href="https://snapcraft.io/altaqwaa">
    <img alt="Get it from the Snap Store" src="https://snapcraft.io/static/images/badges/en/snap-store-black.svg">
  </a>

```bash

sudo snap install altaqwaa

```

</p> -->

- **Windows**: [Download the setup .exe installation file](https://github.com/rn0x/Altaqwaa-Islamic-Desktop-Application/releases/latest)
- **MacOS**: [Download the .dmg installation file](https://github.com/rn0x/Altaqwaa-Islamic-Desktop-Application/releases/latest)
- **Linux**: [Download the .AppImage, .deb, .snap or Tar.gz Archive](https://github.com/rn0x/Altaqwaa-Islamic-Desktop-Application/releases/latest)

<br>

---


# Installation

- **Windows**: Run `Altaqwaa.Setup.{ver}.exe` and follow onscreen prompts. Once installed, the app should be accessible from the start menu.

- **MacOS**: Run `Altaqwaa-{ver}.dmg` and drag icon into Applications folder.

- **Linux**: Can be installed through multiple methods
  - _Appimage_: Run the `.Appimage` file to launch app
  - _Debian_: `cd` into location of `.deb` file and run command: 
  `sudo dpkg -i altaqwaa_{ver}_amd64.deb`

  - _Snap_: `cd` into location of `.snap` file and run command: 
  `sudo apt snap install --devmode altaqwaa_{ver}_amd64.snap`

  - `cd` into location of `.tar.gz` file and run:
  ```bash
  tar -xzf altaqwaa-{ver}.tar.gz
  cd altaqwaa-{ver}
  altaqwaa
  ```
  > Installation via `DEB` or `SNAP`: Can launch app by running `altaqwaa` from any terminal or from Applications list in GUI. 

<br>

---

# FAQs

- Is there a version of Altaqwaa for Android systems? 
  >Yes, you can find the repo for the Andriod version [here](https://github.com/Alsarmad/altaqwaa_android).

- What are the sources of content used in Altaqwaa? 
  > **Altaqwaa is built with complete transparency and all sources used can be found [here](#Sources) with accompanying links to the original data.**


---

# Contribute to the project

**There are several ways to contribute to the Altaqwaa project:**
1. Contributing to the development process
   - Altaqwaa is build using the **`ElectronJS`** framework.
   - The majority of development involves work in **`Node.js`** and underlying languages **`HTML/CSS/JS`**.
   - If you have sufficient experience within this framework, please contact a contributor.

2. Report issues on GitHub page [here](https://github.com/rn0x/Altaqwaa-Islamic-Desktop-Application/issues)
   - Please provide a clear and descriptive title of the issue.
   - Include devise specifications and operating system (and distribution/interface used for Linux users).
   - Detailed description of the issue and steps to reproduce.

3. Support the project financially through **`Github Sponsors`** from [here](https://github.com/sponsors/rn0x)

4. Suggest new features and improvements

   - Contact a contributor with details on your idea to improve future Altaqwaa.
   - Open a new issue on GitHub page with suggestions to be added.

5. Share Altaqwaa with people you know
   - Ibn Mas'ud (RAA) narrated that the Messenger of Allah (ﷺ) said: 
    > **“He who guides (others) to an act of goodness, will have a reward similar to that of its doer.”** Related by Muslim.

<br>

---

# Running in development mode

<br>

**Basic operating requirements:**
- **nodejs**
- **git**
- **yarn** or **npm**

---

### using `YARN`

<br>

```bash
git clone https://github.com/rn0x/Altaqwaa-Islamic-Desktop-Application

cd Altaqwaa-Islamic-Desktop-Application

yarn install

yarn run dev
```

### using `NPM`

<br>

```bash
git clone https://github.com/rn0x/Altaqwaa-Islamic-Desktop-Application

cd Altaqwaa-Islamic-Desktop-Application

npm install

npm run dev
```

<br>

---

# Build from source

<br>

**Application will be built according to the build configuration in `package.json`**

### using `YARN`

<br>

```bash
#Windows
yarn run packwin

#MacOS
yarn run packmac

#Linux
yarn run packlinux
```

### بأستخدام `NPM`

<br>

```bash
#Windows
npm run packwin

#MacOS
npm run packmac

#Linux
npm run packlinux
```

<br>

---

# Dependencies

- adhan-js
- electron
- fs-extra
- moment-js **`(moment-duration-format, moment-hijri, moment-timezone)`**
- node-fetch
- menubar
- v8-compile-cache
- nodemon **`for developers only`**

<br>

---

# Sources

<br>

| Source                       | Link                                    |
| :------------------------- | ----------------------------------------- |
| The Noble Quran              | https://github.com/rn0x/Quran-Json        |
| Translation (The Clear Quran)   |  https://theclearquran.com |
| Audio Files (Noble Quran)      | https://www.mp3quran.net/api/_arabic.json           |
| Supplications | https://www.islambook.com/azkar |
| Hisnul Muslim | https://www.hisnmuslim.com |
| Geolocation API | http://ip-api.com/json                    |
| Icons | https://www.flaticon.com                  |
| Noble Quran Font  | https://fonts.qurancomplex.gov.sa/wp02    |
| Arabic Font                | https://github.com/rastikerdar/vazirmatn  |
| Animation Effects   | https://animate.style                     |

<br>

---

# Contributors

<br>

<table>
    <tr>
        <td align="center"><a href="https://github.com/rn0x"><img src="https://avatars.githubusercontent.com/u/76129163?v=4" width="100px;"/><br /><sub>rn0x</sub></a></td>
        <td align="center"><a href="https://github.com/kemzops"><img src="https://avatars.githubusercontent.com/u/52936496?v=4" width="100px;"/><br /><sub>kemzops</sub></a></td>
    </tr>
</table>

<br>

---

### Glory is to You, O Allah, and praise; I bear witness that there is none worthy of worship but You. I seek Your forgiveness and turn to You in repentance.

<br>
<!-- # TO DO 
- Custom audio macros
  - Convert read block code (or ordered list on web) to series of audio files
  - Use time of day and prayer times to find appropriate duaas -->