const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');
function create(){
  const w = new BrowserWindow({
    width:1280,height:850,minWidth:800,minHeight:600,
    title:'Osembo School',icon:path.join(__dirname,'..','build','icon.png'),
    webPreferences:{contextIsolation:true,nodeIntegration:false}
  });
  Menu.setApplicationMenu(null);
  w.loadFile(path.join(__dirname,'..','www','index.html'));
  w.webContents.setWindowOpenHandler(({url})=>{ if(/^(https?|sms|tel|mailto):/i.test(url)) shell.openExternal(url); return {action:'deny'}; });
  w.webContents.on('will-navigate',(e,url)=>{ if(!url.startsWith('file:')){ e.preventDefault(); if(/^(https?|sms|tel|mailto):/i.test(url)) shell.openExternal(url);} });
}
const lock = app.requestSingleInstanceLock();
if(!lock){ app.quit(); } else {
  app.whenReady().then(create);
  app.on('window-all-closed',()=>app.quit());
}
