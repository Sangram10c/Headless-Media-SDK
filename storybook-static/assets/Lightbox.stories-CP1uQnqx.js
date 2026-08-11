import{r as o,R as u}from"./index-pP6CS22B.js";import{c as x}from"./call-all-DTV92T3c.js";import{u as w}from"./use-id-zqtyBtPQ.js";import{c as q}from"./compose-refs-CiooJUeg.js";import"./_commonjsHelpers-Cpj98o6Y.js";const O=["a[href]","button:not([disabled])","input:not([disabled])","textarea:not([disabled])","select:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(", ");function U(d){const l=o.useRef(null),n=o.useRef(null);o.useEffect(()=>{if(!d)return;n.current=document.activeElement;const t=l.current;return t?(requestAnimationFrame(()=>{const p=t.querySelectorAll(O)[0];p?p.focus():t.focus()}),()=>{var r;(r=n.current)==null||r.focus(),n.current=null}):void 0},[d]);const c=o.useCallback(t=>{if(!d||t.key!=="Tab")return;const s=l.current;if(!s)return;const r=s.querySelectorAll(O);if(r.length===0)return;const p=r[0],i=r[r.length-1];!p||!i||(t.shiftKey?document.activeElement===p&&(t.preventDefault(),i.focus()):document.activeElement===i&&(t.preventDefault(),p.focus()))},[d]);return o.useEffect(()=>{if(d)return document.addEventListener("keydown",c),()=>{document.removeEventListener("keydown",c)}},[d,c]),l}function z(d){const{items:l,initialIndex:n=0,onClose:c,onNavigate:t,loop:s=!0}=d,[r,p]=o.useState(!1),[i,k]=o.useState(n),C=w("lightbox"),E=w("lightbox-title"),v=U(r),b=r&&i>=0&&i<l.length?l[i]??null:null,F=o.useCallback(e=>{k(e),p(!0)},[]),f=o.useCallback(()=>{p(!1),c==null||c()},[c]),g=o.useCallback(()=>{k(e=>{const a=e+1;return a>=l.length?s?0:e:(t==null||t(a),a)})},[l.length,s,t]),m=o.useCallback(()=>{k(e=>{const a=e-1;if(a<0){const I=s?l.length-1:0;return t==null||t(I),I}return t==null||t(a),a})},[l.length,s,t]);o.useEffect(()=>{if(!r)return;const e=a=>{switch(a.key){case"Escape":a.preventDefault(),f();break;case"ArrowRight":a.preventDefault(),g();break;case"ArrowLeft":a.preventDefault(),m();break}};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[r,f,g,m]),o.useEffect(()=>{if(!r)return;const e=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.body.style.overflow=e}},[r]);const T=o.useCallback((e={})=>({role:"presentation","aria-hidden":!0,...e,onClick:x(a=>{a.target===a.currentTarget&&f()},e.onClick)}),[f]),W=o.useCallback((e={})=>({role:"dialog","aria-modal":!0,"aria-labelledby":E,id:C,tabIndex:-1,...e,ref:q(v,e.ref)}),[C,E,v]),M=o.useCallback((e={})=>({src:(b==null?void 0:b.src)??"",alt:(b==null?void 0:b.alt)??"",role:"img",...e}),[b]),_=o.useCallback((e={})=>({type:"button","aria-label":"Close lightbox",...e,onClick:x(()=>f(),e.onClick)}),[f]),H=o.useCallback((e={})=>({type:"button","aria-label":"Next image",disabled:!s&&i>=l.length-1,...e,onClick:x(()=>g(),e.onClick)}),[g,s,i,l.length]),K=o.useCallback((e={})=>({type:"button","aria-label":"Previous image",disabled:!s&&i<=0,...e,onClick:x(()=>m(),e.onClick)}),[m,s,i]);return{isOpen:r,currentIndex:i,currentItem:b,open:F,close:f,next:g,prev:m,getBackdropProps:T,getContentProps:W,getImageProps:M,getCloseButtonProps:_,getNextButtonProps:H,getPrevButtonProps:K}}const L=[{src:"https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&w=800",alt:"Mountain Landscape"},{src:"https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=800",alt:"Cyberpunk Neon City"},{src:"https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800",alt:"Deep Ocean Waves"}];function A({initialOpen:d=!1,loop:l=!0}){var t,s;const n=z({items:L,initialIndex:0,loop:l}),c=n.isOpen||d;return u.createElement("div",{style:{padding:24,minHeight:c?520:"auto",position:"relative"}},u.createElement("button",{onClick:()=>n.open(0),style:{padding:"10px 18px",background:"#8b5cf6",color:"#fff",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600}},"Open Lightbox Modal"),c&&u.createElement("div",{...n.getBackdropProps({style:{position:"absolute",inset:0,background:"rgba(10,10,12,0.92)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1e3,padding:24,borderRadius:16}})},u.createElement("div",{...n.getContentProps({style:{position:"relative",maxWidth:680,width:"100%",display:"flex",flexDirection:"column",alignItems:"center"}})},u.createElement("div",{style:{width:"100%",display:"flex",justifyContent:"flex-end",marginBottom:8}},u.createElement("button",{...n.getCloseButtonProps({style:{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",width:32,height:32,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}})},"✕")),u.createElement("img",{src:(t=n.currentItem)==null?void 0:t.src,alt:(s=n.currentItem)==null?void 0:s.alt,style:{maxWidth:"100%",maxHeight:380,borderRadius:16,objectFit:"contain",boxShadow:"0 20px 40px rgba(0,0,0,0.8)"}}),u.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",marginTop:14}},u.createElement("button",{onClick:n.prev,style:{padding:"8px 16px",background:"rgba(255,255,255,0.1)",color:"#fff",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600}},"← Prev"),u.createElement("span",{style:{color:"#a1a1aa",fontSize:14,fontWeight:600}},n.currentIndex+1," / ",L.length),u.createElement("button",{onClick:n.next,style:{padding:"8px 16px",background:"rgba(255,255,255,0.1)",color:"#fff",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600}},"Next →")))))}const G=`import { useLightbox } from '@headless-media/ui-react';

function LightboxExample({ items }) {
  const lightbox = useLightbox({
    items,
    initialIndex: 0,
    loop: true,
  });

  return (
    <div>
      <button onClick={() => lightbox.open(0)}>Open Lightbox</button>

      {lightbox.isOpen && (
        <div {...lightbox.getBackdropProps()}>
          <div {...lightbox.getContentProps()}>
            <button {...lightbox.getCloseButtonProps()}>✕</button>
            <img src={lightbox.currentItem?.src} alt={lightbox.currentItem?.alt} />
            <button onClick={lightbox.prev}>Prev</button>
            <button onClick={lightbox.next}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}`,Y={title:"Headless UI/Lightbox",component:A,tags:["autodocs"],parameters:{docs:{source:{code:G,language:"tsx",type:"code"}}}},h={args:{initialOpen:!1,loop:!0}},y={args:{initialOpen:!0,loop:!0}};var R,P,S;h.parameters={...h.parameters,docs:{...(R=h.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    initialOpen: false,
    loop: true
  }
}`,...(S=(P=h.parameters)==null?void 0:P.docs)==null?void 0:S.source}}};var D,B,j;y.parameters={...y.parameters,docs:{...(D=y.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    initialOpen: true,
    loop: true
  }
}`,...(j=(B=y.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};const Z=["Default","OpenModal"];export{h as Default,y as OpenModal,Z as __namedExportsOrder,Y as default};
