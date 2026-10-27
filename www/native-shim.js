(function(){
  var C=window.Capacitor;
  if(!C||!C.isNativePlatform||!C.isNativePlatform())return;
  var P=C.Plugins||{};
  // Open web links (WhatsApp etc.) outside the app
  var _open=window.open;
  window.open=function(url){
    try{ if(P.Browser&&url){P.Browser.open({url:String(url)});return null;} }catch(e){}
    return _open?_open.apply(window,arguments):null;
  };
  // Save/share files created by the app (backups, exports)
  function blobToB64(b){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(String(r.result).split(',')[1]);};r.onerror=rej;r.readAsDataURL(b);});}
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a[download]'):null;
    if(!a||!a.href||a.href.indexOf('blob:')!==0)return;
    e.preventDefault();e.stopPropagation();
    var name=a.getAttribute('download')||'osembo-file';
    fetch(a.href).then(function(r){return r.blob();}).then(blobToB64).then(function(b64){
      return P.Filesystem.writeFile({path:name,data:b64,directory:'CACHE'});
    }).then(function(f){
      return P.Share.share({title:name,url:f.uri,dialogTitle:'Save or send '+name});
    }).catch(function(err){alert('Could not save file: '+(err&&err.message||err));});
  },true);
})();
