import{r as b,R as r}from"./index-pP6CS22B.js";import{c as S}from"./call-all-DTV92T3c.js";import{u as A}from"./use-id-zqtyBtPQ.js";import"./_commonjsHelpers-Cpj98o6Y.js";function _(f){const{items:o,columns:i=3,gap:n=16,getItemKey:l,onItemClick:s}=f,c=A("grid"),m=b.useMemo(()=>o.map((t,a)=>({item:t,index:a,key:l(t,a)})),[o,l]),x=b.useCallback((t={})=>({role:"list",id:c,"aria-label":t["aria-label"]??"Media grid",...t,style:{"--grid-columns":i,"--grid-gap":`${String(n)}px`,...t.style}}),[c,i,n]),e=b.useCallback((t,a={})=>({role:"listitem",tabIndex:0,"aria-label":a["aria-label"]??`Media item ${String(t.index+1)}`,...a,onClick:S(s?()=>s(t.item,t.index):void 0,a.onClick),onKeyDown:S(E=>{(E.key==="Enter"||E.key===" ")&&(E.preventDefault(),s==null||s(t.item,t.index))},a.onKeyDown)}),[s]);return{gridItems:m,getGridProps:x,getItemProps:e}}const h=[{id:1,url:"https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&w=400",title:"Mountain Sunset"},{id:2,url:"https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400",title:"Neon Cyberpunk"},{id:3,url:"https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=400",title:"Ocean Waves"},{id:4,url:"https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400",title:"Autumn Forest"}];function G({items:f=h,columns:o=4,isLoading:i=!1,isError:n=!1,errorMessage:l="Failed to load grid items"}){const[s,c]=b.useState(null),{gridItems:m,getItemProps:x}=_({items:n?[]:f,columns:o,getItemKey:e=>e.id,onItemClick:e=>c(e.title)});return i?r.createElement("div",{style:{display:"grid",gridTemplateColumns:`repeat(${o}, 1fr)`,gap:16}},[1,2,3,4].map(e=>r.createElement("div",{key:e,style:{height:200,background:"#27272a",borderRadius:12,animation:"pulse 1.5s infinite"}}))):n?r.createElement("div",{style:{padding:24,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#f87171",borderRadius:12}},"⚠️ ",l):m.length===0?r.createElement("div",{style:{padding:32,textAlign:"center",color:"#a1a1aa"}},"No grid items available."):r.createElement("div",{style:{display:"flex",flexDirection:"column",gap:16}},s&&r.createElement("div",{style:{padding:8,background:"#8b5cf6",color:"#fff",borderRadius:8}},"Selected: ",s),r.createElement("div",{style:{display:"grid",gridTemplateColumns:`repeat(${o}, 1fr)`,gap:16}},m.map(e=>r.createElement("div",{key:e.key,...x(e),style:{borderRadius:12,overflow:"hidden",cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"#18181b"}},r.createElement("img",{src:e.item.url,alt:e.item.title,style:{width:"100%",height:180,objectFit:"cover"}}),r.createElement("div",{style:{padding:12,color:"#f4f4f5",fontSize:14,fontWeight:600}},e.item.title)))))}const z={title:"Headless UI/Grid",component:G,tags:["autodocs"],argTypes:{columns:{control:{type:"number",min:1,max:6}},isLoading:{control:"boolean"},isError:{control:"boolean"}}},d={args:{columns:4,items:h}},p={args:{isLoading:!0,columns:4}},u={args:{items:[]}},g={args:{isError:!0,errorMessage:"Pexels API Rate Limit Exceeded (HTTP 429)"}},y={args:{columns:3,items:h}};var k,v,P;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    columns: 4,
    items: MOCK_PHOTOS
  }
}`,...(P=(v=d.parameters)==null?void 0:v.docs)==null?void 0:P.source}}};var C,O,I;p.parameters={...p.parameters,docs:{...(C=p.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    columns: 4
  }
}`,...(I=(O=p.parameters)==null?void 0:O.docs)==null?void 0:I.source}}};var T,M,w;u.parameters={...u.parameters,docs:{...(T=u.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...(w=(M=u.parameters)==null?void 0:M.docs)==null?void 0:w.source}}};var R,K,L;g.parameters={...g.parameters,docs:{...(R=g.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    isError: true,
    errorMessage: 'Pexels API Rate Limit Exceeded (HTTP 429)'
  }
}`,...(L=(K=g.parameters)==null?void 0:K.docs)==null?void 0:L.source}}};var D,H,j;y.parameters={...y.parameters,docs:{...(D=y.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    columns: 3,
    items: MOCK_PHOTOS
  }
}`,...(j=(H=y.parameters)==null?void 0:H.docs)==null?void 0:j.source}}};const U=["Default","Loading","Empty","ErrorState","Interactive"];export{d as Default,u as Empty,g as ErrorState,y as Interactive,p as Loading,U as __namedExportsOrder,z as default};
