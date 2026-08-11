import{r as g,R as r}from"./index-pP6CS22B.js";import{c as h}from"./call-all-DTV92T3c.js";import{u as D}from"./use-id-zqtyBtPQ.js";import"./_commonjsHelpers-Cpj98o6Y.js";function K(y){const{items:a,columns:l=3,gap:i=16,getItemKey:n,onItemClick:s}=y,c=D("grid"),f=g.useMemo(()=>a.map((t,o)=>({item:t,index:o,key:n(t,o)})),[a,n]),b=g.useCallback((t={})=>({role:"list",id:c,"aria-label":t["aria-label"]??"Media grid",...t,style:{"--grid-columns":l,"--grid-gap":`${String(i)}px`,...t.style}}),[c,l,i]),e=g.useCallback((t,o={})=>({role:"listitem",tabIndex:0,"aria-label":o["aria-label"]??`Media item ${String(t.index+1)}`,...o,onClick:h(s?()=>s(t.item,t.index):void 0,o.onClick),onKeyDown:h(x=>{(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),s==null||s(t.item,t.index))},o.onKeyDown)}),[s]);return{gridItems:f,getGridProps:b,getItemProps:e}}const M=[{id:1,url:"https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&w=400",title:"Mountain Sunset"},{id:2,url:"https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400",title:"Neon Cyberpunk"},{id:3,url:"https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=400",title:"Ocean Waves"},{id:4,url:"https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400",title:"Autumn Forest"}];function L({items:y=M,columns:a=4,isLoading:l=!1,isError:i=!1,errorMessage:n="Failed to load grid items"}){const[s,c]=g.useState(null),{gridItems:f,getItemProps:b}=K({items:i?[]:y,columns:a,getItemKey:e=>e.id,onItemClick:e=>c(e.title)});return l?r.createElement("div",{style:{display:"grid",gridTemplateColumns:`repeat(${a}, 1fr)`,gap:16}},[1,2,3,4].map(e=>r.createElement("div",{key:e,style:{height:180,background:"#27272a",borderRadius:12}}))):i?r.createElement("div",{style:{padding:20,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#f87171",borderRadius:12}},"⚠️ ",n):r.createElement("div",{style:{display:"flex",flexDirection:"column",gap:16}},s&&r.createElement("div",{style:{padding:"8px 16px",background:"#8b5cf6",color:"#fff",borderRadius:8,fontWeight:600}},"Selected: ",s),r.createElement("div",{style:{display:"grid",gridTemplateColumns:`repeat(${a}, 1fr)`,gap:16}},f.map(e=>r.createElement("div",{key:e.key,...b(e),style:{borderRadius:12,overflow:"hidden",cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"#18181b"}},r.createElement("img",{src:e.item.url,alt:e.item.title,style:{width:"100%",height:140,objectFit:"cover"}}),r.createElement("div",{style:{padding:10,color:"#f4f4f5",fontSize:13,fontWeight:600}},e.item.title)))))}const j=`import { useState } from 'react';
import { useGrid } from '@headless-media/ui-react';

function PhotoGridExample({ photos, columns = 4 }) {
  const [selected, setSelected] = useState(null);

  const { gridItems, getItemProps } = useGrid({
    items: photos,
    columns,
    getItemKey: (item) => item.id,
    onItemClick: (item) => setSelected(item.title),
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: \`repeat(\${columns}, 1fr)\`, gap: 16 }}>
      {gridItems.map((gi) => (
        <div key={gi.key} {...getItemProps(gi)}>
          <img src={gi.item.url} alt={gi.item.title} />
          <span>{gi.item.title}</span>
        </div>
      ))}
    </div>
  );
}`,F={title:"Headless UI/Grid",component:L,tags:["autodocs"],parameters:{docs:{source:{code:j,language:"tsx",type:"code"}}}},m={args:{columns:4,items:M}},d={args:{isLoading:!0,columns:4}},p={args:{items:[]}},u={args:{isError:!0,errorMessage:"Pexels API Rate Limit Exceeded (HTTP 429)"}};var E,S,k;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    columns: 4,
    items: MOCK_PHOTOS
  }
}`,...(k=(S=m.parameters)==null?void 0:S.docs)==null?void 0:k.source}}};var I,P,C;d.parameters={...d.parameters,docs:{...(I=d.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    columns: 4
  }
}`,...(C=(P=d.parameters)==null?void 0:P.docs)==null?void 0:C.source}}};var v,R,O;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...(O=(R=p.parameters)==null?void 0:R.docs)==null?void 0:O.source}}};var T,w,G;u.parameters={...u.parameters,docs:{...(T=u.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    isError: true,
    errorMessage: 'Pexels API Rate Limit Exceeded (HTTP 429)'
  }
}`,...(G=(w=u.parameters)==null?void 0:w.docs)==null?void 0:G.source}}};const W=["Default","Loading","Empty","ErrorState"];export{m as Default,p as Empty,u as ErrorState,d as Loading,W as __namedExportsOrder,F as default};
