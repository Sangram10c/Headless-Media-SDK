import{r as n,R as a}from"./index-pP6CS22B.js";import{u as M}from"./use-id-zqtyBtPQ.js";import{c as w}from"./compose-refs-CiooJUeg.js";import"./_commonjsHelpers-Cpj98o6Y.js";function P(g){const{items:i,onActiveChange:c,threshold:s=.5}=g,[t,l]=n.useState(0),v=n.useRef(null),d=n.useRef(new Map),b=M("reel"),h=n.useRef(i);h.current=i;const f=n.useRef(c);f.current=c;const y=n.useRef(t);y.current=t,n.useEffect(()=>{const e=v.current;if(!e)return;const r=new IntersectionObserver(o=>{var S;for(const R of o)if(R.isIntersecting){const u=Number(R.target.getAttribute("data-reel-index"));if(!isNaN(u)&&u!==y.current){l(u);const x=h.current[u];x!==void 0&&((S=f.current)==null||S.call(f,u,x))}}},{root:e,threshold:s});for(const[,o]of d.current)r.observe(o);return()=>r.disconnect()},[i.length,s]);const p=n.useCallback(e=>{const r=d.current.get(e);r&&r.scrollIntoView({behavior:"smooth",block:"start"})},[]);n.useEffect(()=>{const e=v.current;if(!e)return;const r=o=>{switch(o.key){case"ArrowDown":o.preventDefault(),t<i.length-1&&p(t+1);break;case"ArrowUp":o.preventDefault(),t>0&&p(t-1);break}};return e.addEventListener("keydown",r),()=>e.removeEventListener("keydown",r)},[t,i.length,p]);const A=n.useCallback((e={})=>({role:"feed",id:b,tabIndex:0,"aria-label":e["aria-label"]??"Media reel",...e,ref:w(r=>{v.current=r},e.ref),style:{"--reel-active-index":t,...e.style}}),[b,t]),D=n.useCallback((e,r={})=>({role:"article","aria-label":r["aria-label"]??`Media item ${String(e+1)} of ${String(i.length)}`,"aria-setsize":i.length,"aria-posinset":e+1,"data-reel-index":e,"data-active":e===t?"":void 0,tabIndex:e===t?0:-1,...r,ref:w(o=>{o?d.current.set(e,o):d.current.delete(e)},r.ref)}),[i.length,t]),_=i[t]??null;return{activeIndex:t,activeItem:_,getContainerProps:A,getSlideProps:D,scrollTo:p}}const E=[{id:101,title:"Mountain Drone Shot",duration:15,author:"@nature_creator"},{id:102,title:"Urban Neon Timelapse",duration:22,author:"@tokyo_vibes"},{id:103,title:"Surfing Big Waves",duration:18,author:"@ocean_surf"}];function L(){const[g,i]=n.useState(0),c=P({items:E,onActiveChange:s=>{i(s)}});return a.createElement("div",{style:{maxWidth:380,margin:"0 auto",border:"1px solid rgba(255,255,255,0.12)",borderRadius:24,padding:20,background:"#09090b",color:"#fff"}},a.createElement("h4",{style:{margin:"0 0 16px 0",textAlign:"center",fontFamily:"system-ui, sans-serif"}},"Vertical Video Reels Swiper"),a.createElement("div",{...c.getContainerProps({style:{display:"flex",flexDirection:"column",gap:12,maxHeight:360,overflowY:"auto",paddingRight:4}})},E.map((s,t)=>{const l=t===g;return a.createElement("div",{key:s.id,...c.getSlideProps(t,{onClick:()=>{i(t),c.scrollTo(t)},style:{padding:18,borderRadius:16,background:l?"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)":"#18181b",border:l?"2px solid #ec4899":"1px solid rgba(255,255,255,0.08)",cursor:"pointer",transition:"all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",boxShadow:l?"0 10px 25px rgba(139, 92, 246, 0.4)":"none"}})},a.createElement("div",{style:{fontWeight:700,fontSize:15,fontFamily:"system-ui, sans-serif"}},s.title),a.createElement("div",{style:{fontSize:13,opacity:.8,marginTop:4,fontFamily:"system-ui, sans-serif"}},s.author," • ",s.duration,"s"),l&&a.createElement("div",{style:{fontSize:12,marginTop:8,color:"#4ade80",fontWeight:700,fontFamily:"system-ui, sans-serif"}},"▶ Active Video Reel"))})))}const O=`import { useState } from 'react';
import { useReelSwiper } from '@headless-media/ui-react';

function ReelSwiperExample() {
  const [active, setActive] = useState(0);

  const swiper = useReelSwiper({
    items: MOCK_REELS,
    onActiveChange: (index) => setActive(index),
  });

  return (
    <div {...swiper.getContainerProps({ style: { display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 360, overflowY: 'auto' } })}>
      {MOCK_REELS.map((reel, index) => (
        <div
          key={reel.id}
          {...swiper.getSlideProps(index, {
            onClick: () => {
              setActive(index);
              swiper.scrollTo(index);
            },
          })}
        >
          <h4>{reel.title}</h4>
          <p>{reel.author} • {reel.duration}s</p>
        </div>
      ))}
    </div>
  );
}`,K={title:"Headless UI/ReelSwiper",component:L,tags:["autodocs"],parameters:{docs:{source:{code:O,language:"tsx",type:"code"}}}},m={};var k,C,I;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:"{}",...(I=(C=m.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};const N=["Default"];export{m as Default,N as __namedExportsOrder,K as default};
