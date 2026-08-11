import{r as f,R as e}from"./index-pP6CS22B.js";import"./_commonjsHelpers-Cpj98o6Y.js";function h({photographer:l="Jane Doe",alt:p="Scenic Alpine Lake",dimensions:m="4000 × 2667",isFavorited:g=!1}){const[o,u]=f.useState(g);return e.createElement("div",{style:{maxWidth:300,background:"#18181b",borderRadius:16,overflow:"hidden",border:"1px solid rgba(255,255,255,0.1)",position:"relative"}},e.createElement("img",{src:"https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&w=400",alt:p,style:{width:"100%",height:240,objectFit:"cover",display:"block"}}),e.createElement("div",{style:{padding:12,display:"flex",justifyContent:"space-between",alignItems:"center"}},e.createElement("div",null,e.createElement("div",{style:{fontWeight:700,color:"#fff",fontSize:14}},"@",l),e.createElement("div",{style:{fontSize:12,color:"#a1a1aa"}},m)),e.createElement("button",{onClick:()=>u(!o),style:{background:o?"#ec4899":"rgba(255,255,255,0.1)",border:"none",color:"#fff",borderRadius:"50%",width:36,height:36,cursor:"pointer",fontSize:16}},o?"♥":"♡")))}const S={title:"Headless UI/MediaCard",component:h,tags:["autodocs"]},t={args:{photographer:"Jane Doe",alt:"Scenic Alpine Lake",dimensions:"4000 × 2667",isFavorited:!1}},a={args:{photographer:"Jane Doe",alt:"Scenic Alpine Lake",dimensions:"4000 × 2667",isFavorited:!0}};var r,s,n;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: {
    photographer: 'Jane Doe',
    alt: 'Scenic Alpine Lake',
    dimensions: '4000 × 2667',
    isFavorited: false
  }
}`,...(n=(s=t.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};var i,c,d;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    photographer: 'Jane Doe',
    alt: 'Scenic Alpine Lake',
    dimensions: '4000 × 2667',
    isFavorited: true
  }
}`,...(d=(c=a.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};const y=["Default","Favorited"];export{t as Default,a as Favorited,y as __namedExportsOrder,S as default};
