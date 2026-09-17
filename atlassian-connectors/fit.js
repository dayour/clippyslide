(function(){
  function init(){
    var stage=document.querySelector("#vp>.cs-stage"); if(!stage) return; var raf=0;
    function apply(){raf=0;var s=Math.min(window.innerWidth/1280,window.innerHeight/720);stage.style.transform="scale("+s+")";}
    function fit(){if(!raf)raf=requestAnimationFrame(apply);}
    if(window.ResizeObserver){new ResizeObserver(fit).observe(document.documentElement);}
    window.addEventListener("resize",fit,{passive:true});
    window.addEventListener("orientationchange",fit);
    if(window.visualViewport){window.visualViewport.addEventListener("resize",fit);window.visualViewport.addEventListener("scroll",fit);}
    document.addEventListener("fullscreenchange",fit);
    fit();
  }
  if(document.readyState!=="loading") init(); else document.addEventListener("DOMContentLoaded",init);
})();
