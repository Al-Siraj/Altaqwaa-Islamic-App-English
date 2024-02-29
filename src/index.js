/**
 * ALTAQWAA v3.0.0
 * LICENSE: GPL-3.0
 * GITHUB: https://github.com/rn0x/Altaqwaa-Islamic-Desktop-Application 
 * */

/* PACKAGES */
require('v8-compile-cache');
const { BrowserWindow, ipcMain, app, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs-extra');

/* App Initialization (Make Sure Files Ready)  */
app.setAppUserModelId("org.altaqwaa.rn0x");
const appInitialization = require('./modules/appInitialization.js');
const App_Path = path.join(app?.getPath("appData"), './altaqwaa');

/* App Main Code Start Here */
app.on('ready', async (e) => {
    e.preventDefault();

    await appInitialization(path, fs, App_Path);
    const settings = fs.readJsonSync(path.join(App_Path, './data/settings.json'));

    let loadingWindow
    if (process.argv.includes('--hidden')) {
        loadingWindow = null
    } else if (settings?.startHidden == true) {
        loadingWindow = null
    } else {
        loadingWindow = new BrowserWindow({
            width: 128,
            height: 128,
            transparent: true,
            frame: false,
            alwaysOnTop: true,
            center: true,
            title: 'Altaqwaa',
            icon: path.join(__dirname, './build/icons/icon.png'),
            webPreferences: {
                nodeIntegration: false,
                sandbox: false
            }
        })
        loadingWindow?.removeMenu();
        loadingWindow?.loadFile(path.join(__dirname, './pages/loading.html'));
    }

    let win
    let tray
    let contextMenu

    win = new BrowserWindow({
        width: 1500,
        height: 900,
        minWidth: 1000,
        minHeight: 645,
        show: false,
        center: true,
        frame: false,
        title: 'Altaqwaa',
        icon: path.join(__dirname, './build/icons/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
            preload: path.join(__dirname, './preload/preload.js')
        }
    });


    win?.removeMenu();
    if (process.argv.includes('--browser')) {
        win.loadURL("http://localhost:3000")
    } else {
        win.loadFile(path.join(__dirname, './pages/home.html'));
    }

    // The default window background color
    settings?.dark_mode ? win?.setBackgroundColor('#1f2125') : win?.setBackgroundColor('#f4f5fb');

    win?.once('ready-to-show', () => {

        if (process.argv.includes('--hidden')) {
            console.log("[Altaqwaa-CLI] Hidden & Minimized.")
            win?.hide()
        } else if (settings?.startHidden == true) {
            console.log("[Altaqwaa-CLI] Hidden & Minimized.")
            win?.hide()
        } else {
            setTimeout(() => {
                loadingWindow?.close();
                win?.show();
                // win?.webContents.openDevTools();
            }, 1000);
        }

    });

    win?.on('minimize', (event) => {
        event?.preventDefault();
        settings?.minimizeToPanel ? win?.hide() :
            false;
    });

    win?.on('closed', (event) => {
        event?.preventDefault();
        app?.quit()
    });

    contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show/hide app', click: function () {
                win?.isVisible() ? win?.hide() : win?.show()
            }
        },
        {
            label: 'Exit', click: () => {
                if (win !== null) {
                    win?.close();
                } else if (win === null) {
                    app.isQuiting = true;
                    app?.quit();
                }
            }
        }
    ]);
    let windowsMenubar

    if (process.platform == "win32") {
        console.log("[Altaqwaa-CLI] Altaqwaa For Windows.")
        tray = new Tray(path.join(__dirname, './build/icon-set/32x32@2x.png'));
        tray?.setToolTip("Altaqwaa");
        tray?.setContextMenu(contextMenu);
        try {
            if (settings?.autostart == true) {
                if (settings?.startHidden) {
                    app?.setLoginItemSettings({
                        openAtLogin: true,
                        path: path.join(process.resourcesPath, '../Altaqwaa.exe'),
                        args: ['--hidden']
                    });
                } else {
                    app?.setLoginItemSettings({
                        openAtLogin: true,
                        path: path.join(process.resourcesPath, '../Altaqwaa.exe')
                    });
                }
            } else {
                app?.setLoginItemSettings({
                    openAtLogin: false,
                    path: path.join(process.resourcesPath, '../Altaqwaa.exe')
                });
            }
        } catch (e) { }
        const { menubar } = require('menubar');

        windowsMenubar = menubar({
            browserWindow: {
                transparent: false,
                width: 300,
                height: 330,
                minWidth: 270,
                minHeight: 300,
                maxWidth: 350,
                maxHeight: 380,
                show: false,
                title: 'Altaqwaa',
                icon: path.join(__dirname, './build/icons/icon.png'),
                webPreferences: {
                    nodeIntegration: true,
                    preload: path.join(__dirname, './preload/tray_window.js'),
                    devTools: false
                }
            },
            index: path.join(__dirname, './pages/tray_window.html'),
            icon: path.join(__dirname, './build/icons/icon@2x.png'),
            tray: tray
        });



    } else if (process.platform == 'linux') {
        console.log("[Altaqwaa-CLI] Altaqwaa For Linux.")
        tray = new Tray(path.join(__dirname, './build/icons/icon@2x.png'));
        tray?.setToolTip("Altaqwaa");
        tray?.setContextMenu(contextMenu);
    } else {
        console.log("[Altaqwaa-CLI] Altaqwaa For MacOS.")
        tray = new Tray(path.join(__dirname, './build/icon-set/32x32@2x.png'));
        tray?.setToolTip("Altaqwaa");
        // tray?.setContextMenu(contextMenu);
        tray.on('click', () => {
            if (win?.isVisible()) {
                win?.minimize();
            } else {
                win?.show();
            }})
    }

    /* LOAD AUDIO WINDOW AFTER MAIN WINDOW (HOME) IS READY & LOADED */
    if (settings.notifications_adhan == true || settings.notifications_adhkar == true) {
        let audioWindow

        audioWindow = new BrowserWindow({
            width: 600,
            height: 200,
            x: 100,
            y: 100,
            show: false,
            center: true,
            frame: false,
            resizable: false,
            title: 'Altaqwaa',
            icon: path.join(__dirname, './build/icons/icon.png'),
            webPreferences: {
                sandbox: false,
                preload: path.join(__dirname, './preload/audio_window.js')
            }
        });


        audioWindow.removeMenu();

        audioWindow?.loadFile(path.join(__dirname, './pages/audio_window.html'));

        audioWindow?.once('ready-to-show', () => {
            audioWindow?.hide();
            // audioWindow?.webContents.openDevTools();
        });

        ipcMain?.on('closed3', () => {
            if (audioWindow?.isVisible()) {
                audioWindow?.hide();
            }
        });

        ipcMain?.on('show3', () => {
            audioWindow?.show();
        });

        audioWindow?.on('closed', (event) => {
            event?.preventDefault();
            audioWindow = null
        });
    }

    // For changing light/dark mode on settings
    ipcMain?.on('background', (_, dark) => {
        dark ? win?.setBackgroundColor('#1f2125') : win?.setBackgroundColor('#f4f5fb');
    });

    // To get app version 
    ipcMain?.handle('currentRelease', async () => {
        return app?.getVersion();
    });

    // Window Controls
    ipcMain?.on('minimizable', () => win?.isMaximized() ? win?.unmaximize() : win?.maximize());
    ipcMain?.on('minimize', () => win?.minimize());
    ipcMain?.on('closed', () => win?.close());

    app?.on('before-quit', () => tray?.destroy());
});

// For App_Path
ipcMain?.handle('App_Path', async () => {
    return App_Path
});

app?.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app?.quit()
})
