'use client'
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const DEFAULT_DEPTS = [
  {id:"legal",name:"Legal & Entity",color:"#534AB7",tasks:[
    {id:"l1",t:"Form LLC or Corp entity",note:"CA or Delaware — Robert to advise",owner:"Robert Haugan",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l2",t:"Open business bank account",note:"Required before taking any payments",owner:"Rene Suarez, Caleb Troy",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l3",t:"Obtain EIN from IRS",note:"Prerequisite for banking & payroll",owner:"Caleb Troy",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l4",t:"Draft contractor agreements",note:"Master sub agreement for Joey & future subs",owner:"Robert Haugan",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l5",t:"Draft customer contract templates",note:"Scope, payment terms, warranty language",owner:"Robert Haugan",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l6",t:"Confirm C39 license / RMO arrangement",note:"Joey holds license — confirm RMO scope",owner:"Robert Haugan, Joey Ham",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l7",t:"Obtain umbrella insurance policy",note:"Confirm coverage before first job",owner:"Robert Haugan, Jesse Smith",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l8",t:"Research workers comp / GL requirements",note:"Required before any field work in CA",owner:"Robert Haugan, Jesse Smith",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l9",t:"Review terms & liability with vendors",note:"ABC Supply and other material vendors",owner:"Robert Haugan",phase:"2",p:"high",status:"open",comments:[]},
  ]},
  {id:"accounting",name:"Accounting & Finance",color:"#0F6E56",tasks:[
    {id:"a1",t:"Set up QuickBooks Online (QBO)",note:"Chart of accounts tailored to roofing",owner:"Caleb Troy",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"a2",t:"Connect bank account to QBO",note:"",owner:"Caleb Troy",phase:"1",p:"high",status:"open",comments:[]},
    {id:"a3",t:"Set up payroll / contractor payment process",note:"1099 vs W2 classification for Joey",owner:"Caleb Troy, Robert Haugan",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"a4",t:"Define invoicing / payment workflow",note:"ServiceTitan to invoice to payment collection",owner:"Caleb Troy, Jesse Smith",phase:"2",p:"high",status:"open",comments:[]},
    {id:"a5",t:"Establish AP process for vendor payments",note:"ABC Supply, other material vendors",owner:"Caleb Troy, Cat Sullins",phase:"2",p:"med",status:"open",comments:[]},
    {id:"a6",t:"Define financial reporting cadence",note:"Weekly P&L, cash flow review for Rene",owner:"Caleb Troy",phase:"2",p:"med",status:"open",comments:[]},
    {id:"a7",t:"PE reporting setup",note:"Reporting structure for private equity relationship",owner:"Rene Suarez, Caleb Troy",phase:"3",p:"med",status:"open",comments:[]},
  ]},
  {id:"ops",name:"Operations",color:"#185FA5",tasks:[
    {id:"o1",t:"Onboard Joey Ham formally",note:"Signed agreement, COI on file",owner:"Jesse Smith, Robert Haugan",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"o2",t:"Define dispatch & scheduling workflow",note:"How jobs are assigned and confirmed with Joey",owner:"Jesse Smith, Cat Sullins",phase:"1",p:"high",status:"open",comments:[]},
    {id:"o3",t:"Build job intake checklist",note:"Info required before dispatching",owner:"Jesse Smith, Cat Sullins",phase:"2",p:"high",status:"open",comments:[]},
    {id:"o4",t:"Define QC/QA inspection process",note:"Who does post-install checks and what is checked",owner:"Jesse Smith, Joey Ham",phase:"2",p:"high",status:"open",comments:[]},
    {id:"o5",t:"Establish warranty claims process",note:"How customers request warranty work",owner:"Jesse Smith, Cat Sullins",phase:"2",p:"med",status:"open",comments:[]},
    {id:"o6",t:"Build complaints handling SOP",note:"Escalation path and resolution timeline",owner:"Cat Sullins, Jesse Smith",phase:"2",p:"med",status:"open",comments:[]},
    {id:"o7",t:"Source 2nd contractor backup",note:"Single-contractor dependency is top ops risk",owner:"Jesse Smith",phase:"3",p:"high",status:"open",comments:[]},
  ]},
  {id:"salesops",name:"Sales Operations (CRM)",color:"#993C1D",tasks:[
    {id:"s1",t:"Set up ServiceTitan account",note:"Tenant, admin users, company profile",owner:"Jesse Smith",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"s2",t:"Build quote / estimate templates in ST",note:"Roofing-specific line items and pricing",owner:"Jesse Smith, Rene Suarez",phase:"1",p:"high",status:"open",comments:[]},
    {id:"s3",t:"Configure customer pipeline stages",note:"Lead to Quote to Approved to Scheduled to Complete",owner:"Jesse Smith",phase:"2",p:"high",status:"open",comments:[]},
    {id:"s4",t:"Connect ST invoicing to QBO",note:"Critical for clean AR flow",owner:"Jesse Smith, Caleb Troy",phase:"2",p:"high",status:"open",comments:[]},
    {id:"s5",t:"Train Rene + Cat on ServiceTitan",note:"Basic job creation, quoting, dispatch",owner:"Jesse Smith",phase:"2",p:"high",status:"open",comments:[]},
    {id:"s6",t:"Identify first 3 insurance adjuster contacts",note:"Build referral engine foundation",owner:"Rene Suarez",phase:"3",p:"med",status:"open",comments:[]},
    {id:"s7",t:"Build insurance claims workflow in ST",note:"Track claim number, adjuster, payout",owner:"Jesse Smith",phase:"3",p:"med",status:"open",comments:[]},
  ]},
  {id:"sales",name:"Sales",color:"#639922",tasks:[
    {id:"sa1",t:"Define service offerings & pricing",note:"TPO, tile, shingle, repair — OC market rates",owner:"Rene Suarez, Joey Ham",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"sa2",t:"Build proposal / quote template",note:"Branded PDF with scope, pricing, warranty",owner:"Lupita Perez, Jesse Smith",phase:"1",p:"high",status:"open",comments:[]},
    {id:"sa3",t:"Identify first 10 target leads",note:"Network, referrals, neighbors of Joey jobs",owner:"Rene Suarez",phase:"1",p:"high",status:"open",comments:[]},
    {id:"sa4",t:"Define commission / comp plan",note:"Track how sales are attributed and paid",owner:"Rene Suarez, Caleb Troy",phase:"2",p:"med",status:"open",comments:[]},
    {id:"sa5",t:"Develop add-on upsell menu",note:"Gutters, coatings, skylight, solar-ready prep",owner:"Rene Suarez, Joey Ham",phase:"3",p:"med",status:"open",comments:[]},
  ]},
  {id:"mktg",name:"Marketing & Brand",color:"#993556",tasks:[
    {id:"m1",t:"Register domain & set up business email",note:"@durusroofing.com — Google Workspace preferred",owner:"Jesse Smith",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"m2",t:"Build Google Business Profile",note:"Photos, categories, service area, hours",owner:"Lupita Perez",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"m3",t:"Develop brand kit",note:"Logo, colors, fonts, templates",owner:"Lupita Perez",phase:"1",p:"high",status:"open",comments:[]},
    {id:"m4",t:"Launch basic website (5 pages)",note:"Home, Services, About, Reviews, Contact",owner:"Lupita Perez, Jesse Smith",phase:"1",p:"high",status:"open",comments:[]},
    {id:"m5",t:"Set up social accounts (IG, Facebook)",note:"Brand-consistent handles",owner:"Lupita Perez",phase:"1",p:"high",status:"open",comments:[]},
    {id:"m6",t:"Create review solicitation process",note:"Post-job text/email asking for Google review",owner:"Cat Sullins, Lupita Perez",phase:"2",p:"high",status:"open",comments:[]},
    {id:"m7",t:"Plan first paid campaign (Google LSA)",note:"Fastest lead ROI channel in OC roofing",owner:"Lupita Perez, Cleo Parra",phase:"2",p:"med",status:"open",comments:[]},
    {id:"m8",t:"Build content calendar",note:"Before/after photos, job spotlights 3x/week",owner:"Lupita Perez",phase:"2",p:"med",status:"open",comments:[]},
    {id:"m9",t:"Develop referral/discount program",note:"Incentive for referrals and reviews",owner:"Cleo Parra, Rene Suarez",phase:"3",p:"med",status:"open",comments:[]},
  ]},
  {id:"admin",name:"Administrative",color:"#5F5E5A",tasks:[
    {id:"ad1",t:"Confirm C39 license active & in good standing",note:"CSLB license lookup",owner:"Robert Haugan, Joey Ham",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"ad2",t:"Set up registered agent in CA",note:"Required if entity formed outside CA",owner:"Robert Haugan",phase:"1",p:"high",status:"open",comments:[]},
    {id:"ad3",t:"Secure office / virtual address in OC",note:"Required for CSLB license address",owner:"Jesse Smith, Rene Suarez",phase:"1",p:"high",status:"open",comments:[]},
    {id:"ad4",t:"Set up team communication tool",note:"Slack or similar — all team channels",owner:"Jesse Smith",phase:"1",p:"med",status:"open",comments:[]},
    {id:"ad5",t:"Build customer service response templates",note:"Phone, email, and text scripts",owner:"Cat Sullins",phase:"2",p:"med",status:"open",comments:[]},
  ]},
];

const PHASE_LABELS = {"1":"Wk 1-2","2":"Wk 3-4","3":"Mo 2"};
const PRI_LABELS = {crit:"Critical",high:"High",med:"Medium"};
const PRI_ORDER = {crit:0,high:1,med:2};
const BRAND = "#BCF000";
const STATUS_DOT_COLORS = {open:"#888780","in-progress":"#185FA5",blocked:"#993C1D",done:"#3B6D11"};

const TEAM_PEOPLE = [
  {name:"Rene Suarez",   email:"r.suarez@hyten.co"},
  {name:"Jesse Smith",   email:"j.smith@hyten.co"},
  {name:"Robert Haugan", email:"r.haugan@hyten.co"},
  {name:"Caleb Troy",    email:"caleb@chronolytix.com"},
  {name:"Cat Sullins",   email:"cat@hyten.co"},
  {name:"Lupita Perez",  email:"lupita@hyten.co"},
  {name:"Cleo Parra",    email:"cleo@hyten.co"},
  {name:"Joey Ham",      email:"joey95ham@gmail.com"},
];

const TEAM_MEMBERS = [
  {name:"Rene Suarez",initials:"RS",title:"CEO / Owner",color:"#534AB7",bg:"#EEEDFE",ids:["l2","sa1","sa3","sa4","sa5","s6","a7","m9"]},
  {name:"Jesse Smith",initials:"JS",title:"VP — Systems & Ops",color:"#185FA5",bg:"#E6F1FB",ids:["o2","o3","o4","o5","o7","s1","s2","s3","s4","s5","s7","m1","m4","sa2","ad3","ad4","l7","l8","o1"]},
  {name:"Robert Haugan",initials:"RH",title:"Legal Counsel",color:"#3B6D11",bg:"#EAF3DE",ids:["l1","l4","l5","l6","l7","l8","l9","a3","o1","ad1","ad2"]},
  {name:"Caleb Troy",initials:"CT",title:"Accounting",color:"#854F0B",bg:"#FAEEDA",ids:["l2","l3","a1","a2","a3","a4","a5","a6","a7","sa4"]},
  {name:"Cat Sullins",initials:"CS",title:"Ops & Brand Coord.",color:"#993C1D",bg:"#FAECE7",ids:["o2","o3","o5","o6","m6","a5","ad5"]},
  {name:"Lupita Perez",initials:"LP",title:"Brand & Marketing",color:"#993556",bg:"#FBEAF0",ids:["m2","m3","m4","m5","m6","m7","m8","sa2"]},
  {name:"Cleo Parra",initials:"CP",title:"Consultant",color:"#5F5E5A",bg:"#F1EFE8",ids:["m7","m9"]},
  {name:"Joey Ham",initials:"JH",title:"Contractor Partner",color:"#0F6E56",bg:"#E1F5EE",ids:["l6","o1","o4","sa1","sa5","ad1"]},
];

function uid(){return Math.random().toString(36).slice(2,10);}
function rowToTask(row){return{id:row.id,t:row.title,note:row.note||"",owner:row.owner||"",phase:row.phase||"1",p:row.priority||"high",status:row.status||"open",due:row.due||"",comments:row.comments||[],attachments:row.attachments||[]};}
function taskToRow(task,deptId){return{id:task.id,dept_id:deptId,title:task.t,note:task.note||"",owner:task.owner||"",phase:task.phase,priority:task.p,status:task.status,due:task.due||"",comments:task.comments||[],attachments:task.attachments||[],updated_at:new Date().toISOString()};}

function timeAgo(ts){
  const s=Math.floor((Date.now()-new Date(ts))/1000);
  if(s<60)return"just now";
  if(s<3600)return`${Math.floor(s/60)}m ago`;
  if(s<86400)return`${Math.floor(s/3600)}h ago`;
  if(s<604800)return`${Math.floor(s/86400)}d ago`;
  return new Date(ts).toLocaleDateString("en-US",{month:"short",day:"numeric"});
}

function avatarColor(name){
  const colors=["#534AB7","#185FA5","#0F6E56","#993C1D","#639922","#993556","#854F0B","#5F5E5A"];
  return colors[(name||"A").charCodeAt(0)%colors.length];
}
function initials(name){return(name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();}

function useIsMobile(){
  const [mobile,setMobile]=useState(false);
  useEffect(()=>{
    const check=()=>setMobile(window.innerWidth<640);
    check();
    window.addEventListener("resize",check);
    return()=>window.removeEventListener("resize",check);
  },[]);
  return mobile;
}

function PhasePill({phase}){
  const s={1:{background:"#E6F1FB",color:"#185FA5"},2:{background:"#FAEEDA",color:"#854F0B"},3:{background:"#EAF3DE",color:"#3B6D11"}};
  return <span style={{...s[phase],fontSize:10,fontWeight:600,borderRadius:10,padding:"2px 7px",whiteSpace:"nowrap"}}>{PHASE_LABELS[phase]}</span>;
}
function PriBadge({p}){
  const s={crit:{background:"#FAECE7",color:"#993C1D"},high:{background:"#FAEEDA",color:"#854F0B"},med:{background:"#EAF3DE",color:"#3B6D11"}};
  return <span style={{...s[p],fontSize:10,fontWeight:600,borderRadius:4,padding:"2px 7px",whiteSpace:"nowrap"}}>{PRI_LABELS[p]}</span>;
}
function StatusBadge({status}){
  const m={open:{bg:"#F1EFE8",color:"#5F5E5A",label:"Open"},"in-progress":{bg:"#E6F1FB",color:"#185FA5",label:"In progress"},blocked:{bg:"#FAECE7",color:"#993C1D",label:"Blocked"},done:{bg:"#EAF3DE",color:"#3B6D11",label:"Done"}};
  const s=m[status]||m.open;
  return <span style={{background:s.bg,color:s.color,fontSize:10,fontWeight:600,borderRadius:4,padding:"2px 7px",whiteSpace:"nowrap"}}>{s.label}</span>;
}

function Avatar({name,size=28,color:colorOverride}){
  const color=colorOverride||avatarColor(name||"?");
  return(
    <div style={{width:size,height:size,borderRadius:"50%",background:color+"22",color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.38,fontWeight:600,flexShrink:0}}>
      {initials(name||"?")}
    </div>
  );
}

// ── Owner multi-select dropdown ───────────────────────────────────────────────
function OwnerSelect({value, onChange, theme, colorMap={}}){
  const th=theme||{border:"#e8e7e3",borderMid:"#d3d1c7",textPrimary:"#2c2c2a",textSecondary:"#5f5e5a",textTertiary:"#888780",inputBg:"#ffffff",surface:"#ffffff",surface2:"#f9f9f8"};
  const ownerColor=(name)=>colorMap[name]||avatarColor(name);
  const [open,setOpen]=useState(false);
  const [search,setSearch]=useState("");
  const ref=useRef(null);

  // Close on outside click
  useEffect(()=>{
    const handler=(e)=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",handler);
    return()=>document.removeEventListener("mousedown",handler);
  },[]);

  const selectedNames=(value||"").split(",").map(s=>s.trim()).filter(Boolean);
  const selectedPeople=TEAM_PEOPLE.filter(p=>selectedNames.includes(p.name));
  const filtered=TEAM_PEOPLE.filter(p=>
    p.name.toLowerCase().includes(search.toLowerCase())||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggle=(person)=>{
    const already=selectedNames.includes(person.name);
    const next=already?selectedNames.filter(n=>n!==person.name):[...selectedNames,person.name];
    onChange(next.join(", "));
  };

  return(
    <div ref={ref} style={{position:"relative"}}>
      <div onClick={()=>setOpen(o=>!o)}
        style={{minHeight:42,padding:"6px 10px",border:`0.5px solid ${open?BRAND:th.borderMid}`,borderRadius:8,cursor:"pointer",background:th.inputBg,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        {selectedPeople.length===0&&<span style={{fontSize:13,color:th.textTertiary}}>Select owner(s)...</span>}
        {selectedPeople.map(p=>(
          <span key={p.name} style={{display:"inline-flex",alignItems:"center",gap:4,background:ownerColor(p.name)+"22",color:ownerColor(p.name),borderRadius:20,padding:"2px 8px 2px 4px",fontSize:12,fontWeight:500}}>
            <span style={{width:18,height:18,borderRadius:"50%",background:ownerColor(p.name),color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0}}>{initials(p.name)}</span>
            {p.name.split(" ")[0]}
            <span onClick={e=>{e.stopPropagation();toggle(p);}} style={{marginLeft:2,fontSize:14,lineHeight:1,cursor:"pointer",opacity:.6}}>×</span>
          </span>
        ))}
        <span style={{marginLeft:"auto",fontSize:10,color:th.textTertiary,flexShrink:0}}>{open?"▲":"▼"}</span>
      </div>

      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:th.surface,border:`0.5px solid ${th.borderMid}`,borderRadius:10,zIndex:500,boxShadow:"0 4px 20px rgba(0,0,0,0.12)",overflow:"hidden"}}>
          <div style={{padding:"8px 10px",borderBottom:`0.5px solid ${th.border}`}}>
            <input autoFocus value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search by name or email..."
              style={{width:"100%",fontSize:13,padding:"5px 8px",border:`0.5px solid ${th.borderMid}`,borderRadius:6,outline:"none",color:th.textPrimary,background:th.inputBg}}/>
          </div>
          <div style={{maxHeight:220,overflowY:"auto"}}>
            {filtered.map(p=>{
              const isSelected=selectedNames.includes(p.name);
              const color=ownerColor(p.name);
              return(
                <div key={p.name} onClick={()=>toggle(p)}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",cursor:"pointer",background:isSelected?color+"11":"transparent",borderBottom:`0.5px solid ${th.border}`}}
                  onMouseEnter={e=>{if(!isSelected)e.currentTarget.style.background=th.surface2;}}
                  onMouseLeave={e=>{if(!isSelected)e.currentTarget.style.background="transparent";}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:color+"22",color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{initials(p.name)}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:500,color:th.textPrimary}}>{p.name}</div>
                    <div style={{fontSize:11,color:th.textTertiary}}>{p.email}</div>
                  </div>
                  {isSelected&&(
                    <div style={{width:18,height:18,borderRadius:"50%",background:BRAND,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <div style={{width:9,height:6,borderLeft:"1.5px solid #2c2c2a",borderBottom:"1.5px solid #2c2c2a",transform:"rotate(-45deg) translate(0,1px)"}}/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{padding:"8px 12px",borderTop:`0.5px solid ${th.border}`}}>
            <button onClick={()=>setOpen(false)} style={{width:"100%",padding:"7px",borderRadius:7,border:"none",background:BRAND,color:"#2c2c2a",fontSize:12,fontWeight:600,cursor:"pointer"}}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sign-in ───────────────────────────────────────────────────────────────────
function SignInScreen({theme}){
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [mode,setMode]=useState("google"); // "google" | "email"
  const [email,setEmail]=useState("");
  const [sent,setSent]=useState(false);

  const signInGoogle=async()=>{
    setLoading(true);setError("");
    const{error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});
    if(error){setError(error.message);setLoading(false);}
  };

  const signInEmail=async(e)=>{
    e.preventDefault();
    if(!email.trim())return;
    setLoading(true);setError("");
    const{error}=await supabase.auth.signInWithOtp({email:email.trim(),options:{emailRedirectTo:window.location.origin}});
    if(error){setError(error.message);setLoading(false);}
    else{setSent(true);setLoading(false);}
  };

  const tabBtn=(id,label)=>(
    <button onClick={()=>{setMode(id);setError("");setSent(false);}}
      style={{flex:1,padding:"8px",border:"none",borderRadius:7,fontSize:13,fontWeight:500,cursor:"pointer",background:mode===id?theme.bg:theme.surface,color:mode===id?theme.textPrimary:theme.textTertiary,transition:"background .15s"}}>
      {label}
    </button>
  );

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:theme.bg,padding:20}}>
      <div style={{background:theme.surface,borderRadius:16,padding:"40px 32px",maxWidth:380,width:"100%",border:`0.5px solid ${theme.border}`,textAlign:"center"}}>
        <div style={{marginBottom:28}}><img src="/logo.png" alt="Durus Roofing" style={{height:56,objectFit:"contain"}}/></div>
        <div style={{fontSize:22,fontWeight:500,color:theme.textPrimary,marginBottom:8}}>Project tracker</div>
        <div style={{fontSize:14,color:theme.textSecondary,marginBottom:28,lineHeight:1.6}}>Sign in to access the team dashboard.</div>

        {/* Tab toggle */}
        <div style={{display:"flex",background:theme.surface2,borderRadius:10,padding:3,marginBottom:24,gap:2}}>
          {tabBtn("google","Google")}
          {tabBtn("email","Email link")}
        </div>

        {/* Google */}
        {mode==="google"&&(
          <button onClick={signInGoogle} disabled={loading}
            style={{width:"100%",padding:"13px 20px",borderRadius:10,border:`0.5px solid ${theme.borderMid}`,background:loading?"#d3d1c7":theme.surface,color:theme.textPrimary,fontSize:15,fontWeight:500,cursor:loading?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading?"Signing in...":"Sign in with Google"}
          </button>
        )}

        {/* Email magic link */}
        {mode==="email"&&!sent&&(
          <form onSubmit={signInEmail} style={{textAlign:"left"}}>
            <div style={{fontSize:10,color:theme.textTertiary,marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Email address</div>
            <input
              type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="you@example.com" autoFocus required
              style={{width:"100%",fontSize:14,padding:"11px 12px",border:`0.5px solid ${theme.borderMid}`,borderRadius:9,outline:"none",color:theme.textPrimary,background:theme.inputBg||theme.bg,marginBottom:12,boxSizing:"border-box"}}/>
            <button type="submit" disabled={loading||!email.trim()}
              style={{width:"100%",padding:"13px",borderRadius:10,border:"none",background:loading||!email.trim()?"#d3d1c7":BRAND,color:"#2c2c2a",fontSize:14,fontWeight:600,cursor:loading||!email.trim()?"default":"pointer"}}>
              {loading?"Sending...":"Send magic link"}
            </button>
          </form>
        )}

        {/* Sent confirmation */}
        {mode==="email"&&sent&&(
          <div style={{textAlign:"left",background:theme.surface2,borderRadius:10,padding:"16px 18px"}}>
            <div style={{fontSize:14,fontWeight:600,color:theme.textPrimary,marginBottom:6}}>Check your inbox</div>
            <div style={{fontSize:13,color:theme.textSecondary,lineHeight:1.6}}>We sent a sign-in link to <strong style={{color:theme.textPrimary}}>{email}</strong>. Click the link in that email to sign in — no password needed.</div>
            <button onClick={()=>{setSent(false);setEmail("");}} style={{marginTop:14,fontSize:12,color:theme.textTertiary,background:"none",border:"none",cursor:"pointer",padding:0,textDecoration:"underline"}}>Use a different email</button>
          </div>
        )}

        {error&&<div style={{marginTop:14,fontSize:12,color:"#993C1D",background:"#FAECE7",borderRadius:8,padding:"8px 12px"}}>{error}</div>}
        <div style={{marginTop:24,fontSize:11,color:theme.textTertiary,lineHeight:1.6}}>Access is restricted to approved team members only. Contact Rene or Jesse to be added.</div>
      </div>
    </div>
  );
}

function AccessDenied({email,theme,onSignOut}){
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:theme.bg,padding:20}}>
      <div style={{background:theme.surface,borderRadius:16,padding:"40px 32px",maxWidth:380,width:"100%",border:"0.5px solid #F0997B",textAlign:"center"}}>
        <div style={{marginBottom:20}}><img src="/logo.png" alt="Durus Roofing" style={{height:48,objectFit:"contain"}}/></div>
        <div style={{fontSize:18,fontWeight:500,color:"#993C1D",marginBottom:8}}>Access not approved</div>
        <div style={{fontSize:13,color:theme.textSecondary,marginBottom:6,lineHeight:1.6}}><strong style={{color:theme.textPrimary}}>{email}</strong> is not on the approved team list.</div>
        <div style={{fontSize:13,color:theme.textSecondary,marginBottom:28,lineHeight:1.6}}>Contact Rene or Jesse to be added to the project tracker.</div>
        <button onClick={onSignOut} style={{width:"100%",padding:"11px",borderRadius:10,border:`0.5px solid ${theme.borderMid}`,background:"transparent",color:theme.textSecondary,fontSize:13,cursor:"pointer"}}>Sign out and try a different account</button>
      </div>
    </div>
  );
}

// ── Changelog ─────────────────────────────────────────────────────────────────
const PAGE_SIZE=5;
function ChangelogFeed({theme,onTaskClick,userColorMap={}}){
  const [entries,setEntries]=useState([]);
  const [loading,setLoading]=useState(true);
  const [page,setPage]=useState(0);
  async function load(){
    try{const{data}=await supabase.from("changelog").select("*").order("created_at",{ascending:false}).limit(100);if(data){setEntries(data);setPage(0);}}
    catch(e){console.error(e);}
    setLoading(false);
  }
  useEffect(()=>{load();const i=setInterval(load,15000);return()=>clearInterval(i);},[]);
  const actionIcon={completed:"✓",reopened:"↩",updated:"✎",commented:"💬",added:"＋",deleted:"✕",status:"◎"};
  const actionColor={completed:"#3B6D11",reopened:"#854F0B",updated:"#185FA5",commented:"#534AB7",added:BRAND,deleted:"#993C1D",status:"#185FA5"};
  if(loading)return <div style={{padding:"20px 16px",textAlign:"center"}}><span style={{fontSize:12,color:theme.textTertiary}}>Loading activity...</span></div>;
  if(!entries.length)return <div style={{padding:"20px 16px",textAlign:"center"}}><span style={{fontSize:12,color:theme.textTertiary}}>No activity yet. Changes will appear here as the team makes updates.</span></div>;

  const totalPages=Math.ceil(entries.length/PAGE_SIZE);
  const pageEntries=entries.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE);
  const btnStyle=(disabled)=>({padding:"4px 10px",borderRadius:6,border:`0.5px solid ${theme.borderMid}`,background:"transparent",color:disabled?theme.textTertiary:theme.textPrimary,fontSize:11,cursor:disabled?"default":"pointer",opacity:disabled?0.4:1});

  return(
    <div>
      {pageEntries.map((e,i)=>{
        const color=actionColor[e.action]||theme.textSecondary;
        const icon=actionIcon[e.action]||"•";
        return(
          <div key={e.id} style={{display:"flex",gap:10,padding:"10px 16px",borderBottom:i<pageEntries.length-1?`0.5px solid ${theme.border}`:"none",cursor:e.task_title?"pointer":"default"}}
            onClick={()=>e.task_title&&onTaskClick&&onTaskClick(e)}>
            <Avatar name={e.user_name} size={30} color={userColorMap[e.user_name]}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"baseline",gap:6,flexWrap:"wrap"}}>
                <span style={{fontSize:13,fontWeight:500,color:theme.textPrimary}}>{e.user_name}</span>
                <span style={{fontSize:12,color:theme.textSecondary,lineHeight:1.4}}>
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:16,height:16,borderRadius:"50%",background:color+"22",color,fontSize:9,fontWeight:700,marginRight:4,flexShrink:0,verticalAlign:"middle"}}>{icon}</span>
                  {e.action==="completed"&&<span>marked <strong style={{color:theme.textPrimary}}>{e.task_title}</strong> as done</span>}
                  {e.action==="reopened"&&<span>reopened <strong style={{color:theme.textPrimary}}>{e.task_title}</strong></span>}
                  {e.action==="updated"&&<span>updated <strong style={{color:theme.textPrimary}}>{e.task_title}</strong></span>}
                  {e.action==="commented"&&<span>commented on <strong style={{color:theme.textPrimary}}>{e.task_title}</strong></span>}
                  {e.action==="added"&&<span>added task <strong style={{color:theme.textPrimary}}>{e.task_title}</strong></span>}
                  {e.action==="deleted"&&<span>deleted task <strong style={{color:theme.textPrimary}}>{e.task_title}</strong></span>}
                  {e.action==="status"&&<span>changed status of <strong style={{color:theme.textPrimary}}>{e.task_title}</strong></span>}
                </span>
              </div>
              {e.detail&&<div style={{fontSize:11,color:theme.textTertiary,marginTop:2,lineHeight:1.4,fontStyle:"italic"}}>"{e.detail}"</div>}
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                {e.dept_name&&<span style={{fontSize:10,color:theme.textTertiary,background:theme.surface2,borderRadius:4,padding:"1px 6px"}}>{e.dept_name}</span>}
                <span style={{fontSize:10,color:theme.textTertiary}}>{timeAgo(e.created_at)}</span>
              </div>
            </div>
          </div>
        );
      })}
      {totalPages>1&&(
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 14px",borderTop:`0.5px solid ${theme.border}`}}>
          <button disabled={page===0} onClick={()=>setPage(p=>p-1)} style={btnStyle(page===0)}>← Prev</button>
          <span style={{fontSize:11,color:theme.textTertiary}}>Page {page+1} of {totalPages}</span>
          <button disabled={page===totalPages-1} onClick={()=>setPage(p=>p+1)} style={btnStyle(page===totalPages-1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ── Team card ─────────────────────────────────────────────────────────────────
function TeamCard({person,allTasks,theme,currentUser,effectiveColor,effectiveAvatar,onTaskClick}){
  const [expanded,setExpanded]=useState(person.name===currentUser);
  const mt=allTasks.filter(t=>person.ids.includes(t.id));
  const dd=mt.filter(t=>t.status==="done").length;
  const cr=mt.filter(t=>t.p==="crit"&&t.status!=="done").length;
  const bl=mt.filter(t=>t.status==="blocked").length;
  const pp=mt.length?Math.round(dd/mt.length*100):0;
  const isMe=person.name===currentUser;
  const myColor=isMe&&effectiveColor?effectiveColor:person.color;
  const myBg=isMe&&effectiveColor?effectiveColor+"1a":person.bg;
  const sorted=[...mt.filter(t=>t.status!=="done"),...mt.filter(t=>t.status==="done")];
  const statusDotColor={open:"#888780","in-progress":"#185FA5",blocked:"#993C1D",done:"#3B6D11"};
  return(
    <div style={{background:theme.surface,border:`0.5px solid ${isMe?BRAND:theme.border}`,borderRadius:12,overflow:"hidden"}}>
      <div onClick={()=>setExpanded(e=>!e)} style={{padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:myBg,color:myColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,flexShrink:0,position:"relative",overflow:"hidden"}}>
          {isMe&&effectiveAvatar
            ?<img src={effectiveAvatar} style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",position:"absolute",inset:0}} alt=""/>
            :person.initials
          }
          {isMe&&<div style={{position:"absolute",bottom:0,right:0,width:10,height:10,borderRadius:"50%",background:BRAND,border:`2px solid ${theme.surface}`}}/>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:13,fontWeight:500,color:theme.textPrimary}}>{person.name}</span>
            {isMe&&<span style={{fontSize:9,fontWeight:600,background:BRAND,color:"#2c2c2a",borderRadius:6,padding:"1px 5px",textTransform:"uppercase",letterSpacing:".04em"}}>You</span>}
          </div>
          <div style={{fontSize:11,color:theme.textTertiary,marginBottom:5}}>{person.title}</div>
          <div style={{height:3,background:theme.surface2,borderRadius:2,overflow:"hidden",marginBottom:5}}>
            <div style={{height:"100%",width:`${pp}%`,background:myColor,borderRadius:2,transition:"width .4s"}}/>
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            <span style={{fontSize:10,padding:"2px 7px",borderRadius:10,background:theme.surface2,color:theme.textSecondary}}>{dd}/{mt.length} done</span>
            {cr>0&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:10,background:"#FAECE7",color:"#993C1D",fontWeight:600}}>{cr} critical</span>}
            {bl>0&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:10,background:"#FAEEDA",color:"#854F0B",fontWeight:600}}>{bl} blocked</span>}
          </div>
        </div>
        <div style={{fontSize:11,color:theme.textTertiary,flexShrink:0,transition:"transform .2s",transform:expanded?"rotate(90deg)":"none"}}>▶</div>
      </div>
      {expanded&&(
        <div style={{borderTop:`0.5px solid ${theme.border}`}}>
          {sorted.length===0&&<div style={{padding:"12px 14px",fontSize:12,color:theme.textTertiary}}>No tasks assigned.</div>}
          {sorted.map((task,i)=>{
            const isDone=task.status==="done";
            return(
              <div key={task.id} onClick={()=>onTaskClick(task.id)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderBottom:i<sorted.length-1?`0.5px solid ${theme.border}`:"none",cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background=theme.surface2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:7,height:7,borderRadius:"50%",background:statusDotColor[task.status]||"#888780",flexShrink:0,opacity:isDone?0.4:1}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,color:isDone?theme.textTertiary:theme.textPrimary,textDecoration:isDone?"line-through":"none",lineHeight:1.35,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.t}</div>
                  <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap",alignItems:"center"}}>
                    <PriBadge p={task.p}/>
                    <PhasePill phase={parseInt(task.phase)}/>
                    {task.status!=="open"&&<StatusBadge status={task.status}/>}
                    {task.deptName&&<span style={{fontSize:10,color:theme.textTertiary}}>{task.deptName}</span>}
                  </div>
                </div>
                <span style={{fontSize:12,color:theme.textTertiary,flexShrink:0}}>›</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Task modal ────────────────────────────────────────────────────────────────
function TaskModal({task,deptColor,deptName,currentUser,onSave,onDelete,onClose,theme,colorMap={}}){
  const th=theme||{border:"#e8e7e3",borderMid:"#d3d1c7",textPrimary:"#2c2c2a",textSecondary:"#5f5e5a",textTertiary:"#888780",inputBg:"#ffffff",surface:"#ffffff",surface2:"#f9f9f8"};
  const [form,setForm]=useState({...task,attachments:task.attachments||[]});
  const [newComment,setNewComment]=useState("");
  const [addingLink,setAddingLink]=useState(false);
  const [linkUrl,setLinkUrl]=useState("");
  const [linkLabel,setLinkLabel]=useState("");
  const [uploading,setUploading]=useState(false);
  const [uploadError,setUploadError]=useState("");
  const fileInputRef=useRef(null);

  const isDriveUrl=(url="")=>url.includes("drive.google.com")||url.includes("docs.google.com")||url.includes("sheets.google.com")||url.includes("slides.google.com");

  const DriveIcon=()=>(
    <svg width="16" height="16" viewBox="0 0 87.3 78" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
      <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L28.5 53H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066DA"/>
      <path d="M43.65 25L29.0 0c-1.35.8-2.5 1.9-3.3 3.3L1.2 48.5A9 9 0 000 53h28.5z" fill="#00AC47"/>
      <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 57.5A8.97 8.97 0 0087.3 53H58.8l6.15 11.5z" fill="#EA4335"/>
      <path d="M43.65 25L58.3 0H29.0z" fill="#00832D"/>
      <path d="M58.8 53H87.3c0-1.55-.4-3.1-1.2-4.5L62.3 6.6c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 58.8 53z" fill="#2684FC"/>
      <path d="M28.5 53L13.8 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.1-.45 4.5-1.2L58.8 53z" fill="#FFBA00"/>
    </svg>
  );

  const LinkIcon=()=>(
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,color:th.textTertiary}}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );

  const confirmLink=()=>{
    if(!linkUrl.trim())return;
    const att={id:uid(),name:linkLabel.trim()||linkUrl.trim(),url:linkUrl.trim(),type:"link"};
    setForm(f=>({...f,attachments:[...(f.attachments||[]),att]}));
    setLinkUrl("");setLinkLabel("");setAddingLink(false);
  };

  const handleFileUpload=async(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    setUploading(true);setUploadError("");
    try{
      const path=`tasks/${form.id}/${uid()}-${file.name}`;
      const{error}=await supabase.storage.from("task-attachments").upload(path,file);
      if(error)throw error;
      const{data:{publicUrl}}=supabase.storage.from("task-attachments").getPublicUrl(path);
      setForm(f=>({...f,attachments:[...(f.attachments||[]),{id:uid(),name:file.name,url:publicUrl,type:"file"}]}));
    }catch(e){
      setUploadError("Upload failed — ensure the 'task-attachments' storage bucket exists in Supabase with public read access.");
    }
    setUploading(false);
    if(fileInputRef.current)fileInputRef.current.value="";
  };

  const removeAttachment=(id)=>setForm(f=>({...f,attachments:(f.attachments||[]).filter(a=>a.id!==id)}));
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const addComment=()=>{
    if(!newComment.trim())return;
    const c={id:uid(),author:currentUser||"Team",text:newComment.trim(),ts:new Date().toISOString()};
    setForm(f=>({...f,comments:[...(f.comments||[]),c]}));
    setNewComment("");
  };
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:th.surface,borderRadius:"16px 16px 0 0",width:"100%",maxWidth:600,maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{width:36,height:4,borderRadius:2,background:th.borderMid,margin:"10px auto 0"}}/>
        <div style={{padding:"12px 16px 10px",borderBottom:`0.5px solid ${th.border}`,display:"flex",alignItems:"flex-start",gap:10}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:deptColor,flexShrink:0,marginTop:5}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:th.textTertiary,marginBottom:3,textTransform:"uppercase",letterSpacing:".05em"}}>{deptName}</div>
            <input value={form.t} onChange={e=>set("t",e.target.value)} style={{width:"100%",fontSize:16,fontWeight:500,border:"none",outline:"none",background:"transparent",color:th.textPrimary,padding:0}}/>
          </div>
          <button onClick={onClose} style={{border:"none",background:"none",fontSize:22,color:th.textTertiary,cursor:"pointer",lineHeight:1,padding:"0 4px"}}>×</button>
        </div>
        <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
            {[["Status","status",[["open","Open"],["in-progress","In progress"],["blocked","Blocked"],["done","Done"]]],["Priority","p",[["crit","Critical"],["high","High"],["med","Medium"]]]].map(([label,key,opts])=>(
              <div key={key}>
                <div style={{fontSize:10,color:th.textTertiary,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>{label}</div>
                <select value={form[key]} onChange={e=>set(key,e.target.value)} style={{width:"100%",fontSize:13,padding:"7px 8px",border:`0.5px solid ${th.borderMid}`,borderRadius:8,outline:"none",color:th.textPrimary,background:th.inputBg}}>
                  {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
            <div>
              <div style={{fontSize:10,color:th.textTertiary,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Due</div>
              <input type="date" value={form.due||""} onChange={e=>set("due",e.target.value)}
                style={{width:"100%",fontSize:13,padding:"7px 8px",border:`0.5px solid ${th.borderMid}`,borderRadius:8,outline:"none",color:form.due?th.textPrimary:th.textTertiary,background:th.inputBg,boxSizing:"border-box"}}/>
            </div>
            <div>
              <div style={{fontSize:10,color:th.textTertiary,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Phase</div>
              <select value={form.phase} onChange={e=>set("phase",e.target.value)} style={{width:"100%",fontSize:13,padding:"7px 8px",border:`0.5px solid ${th.borderMid}`,borderRadius:8,outline:"none",color:th.textPrimary,background:th.inputBg}}>
                <option value="1">Wk 1-2</option><option value="2">Wk 3-4</option><option value="3">Month 2</option>
              </select>
            </div>
          </div>
          <div>
            <div style={{fontSize:10,color:th.textTertiary,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Owner</div>
            <OwnerSelect value={form.owner} onChange={v=>set("owner",v)} theme={th} colorMap={colorMap}/>
          </div>
          <div>
            <div style={{fontSize:10,color:th.textTertiary,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Notes</div>
            <textarea value={form.note} onChange={e=>set("note",e.target.value)} rows={3} style={{width:"100%",fontSize:14,padding:"9px 10px",border:`0.5px solid ${th.borderMid}`,borderRadius:8,resize:"vertical",outline:"none",color:th.textPrimary,background:th.inputBg,fontFamily:"inherit"}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:th.textTertiary,marginBottom:8,textTransform:"uppercase",letterSpacing:".05em"}}>Attachments</div>

            {/* Existing attachments */}
            {(form.attachments||[]).map(att=>(
              <div key={att.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:th.surface2,borderRadius:8,marginBottom:6}}>
                {isDriveUrl(att.url)?<DriveIcon/>:<LinkIcon/>}
                <a href={att.url} target="_blank" rel="noopener noreferrer"
                  style={{flex:1,fontSize:12,color:th.textPrimary,textDecoration:"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}
                  onClick={e=>e.stopPropagation()}>
                  {att.name}
                </a>
                <button onClick={()=>removeAttachment(att.id)}
                  style={{background:"none",border:"none",cursor:"pointer",color:th.textTertiary,fontSize:16,lineHeight:1,padding:"0 2px",flexShrink:0}}>×</button>
              </div>
            ))}

            {/* Add link inline form */}
            {addingLink?(
              <div style={{display:"flex",flexDirection:"column",gap:6,padding:"10px",background:th.surface2,borderRadius:8,marginBottom:6}}>
                <input autoFocus value={linkUrl} onChange={e=>setLinkUrl(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter")confirmLink();if(e.key==="Escape"){setAddingLink(false);setLinkUrl("");setLinkLabel("");}}}
                  placeholder="Paste URL (Google Drive, Docs, Sheets, any link…)"
                  style={{fontSize:13,padding:"7px 9px",border:`0.5px solid ${th.borderMid}`,borderRadius:7,outline:"none",color:th.textPrimary,background:th.inputBg}}/>
                <div style={{display:"flex",gap:6}}>
                  <input value={linkLabel} onChange={e=>setLinkLabel(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter")confirmLink();if(e.key==="Escape"){setAddingLink(false);setLinkUrl("");setLinkLabel("");}}}
                    placeholder="Label (optional)"
                    style={{flex:1,fontSize:13,padding:"7px 9px",border:`0.5px solid ${th.borderMid}`,borderRadius:7,outline:"none",color:th.textPrimary,background:th.inputBg}}/>
                  <button onClick={confirmLink}
                    style={{padding:"7px 14px",borderRadius:7,border:"none",background:BRAND,color:"#2c2c2a",fontSize:12,fontWeight:600,cursor:"pointer"}}>Add</button>
                  <button onClick={()=>{setAddingLink(false);setLinkUrl("");setLinkLabel("");}}
                    style={{padding:"7px 10px",borderRadius:7,border:`0.5px solid ${th.borderMid}`,background:"transparent",color:th.textSecondary,fontSize:12,cursor:"pointer"}}>Cancel</button>
                </div>
              </div>
            ):(
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <button onClick={()=>setAddingLink(true)}
                  style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:7,border:`0.5px solid ${th.borderMid}`,background:"transparent",color:th.textSecondary,fontSize:12,cursor:"pointer"}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Add link
                </button>
                <label style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:7,border:`0.5px solid ${th.borderMid}`,background:"transparent",color:th.textSecondary,fontSize:12,cursor:"pointer"}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {uploading?"Uploading…":"Upload file"}
                  <input ref={fileInputRef} type="file" onChange={handleFileUpload} disabled={uploading} style={{display:"none"}}/>
                </label>
              </div>
            )}
            {uploadError&&<div style={{fontSize:11,color:"#993C1D",marginTop:6,lineHeight:1.4}}>{uploadError}</div>}
          </div>

          <div>
            <div style={{fontSize:10,color:th.textTertiary,marginBottom:8,textTransform:"uppercase",letterSpacing:".05em"}}>Comments</div>
            {!(form.comments||[]).length&&<div style={{fontSize:13,color:th.textTertiary,marginBottom:8}}>No comments yet.</div>}
            {(form.comments||[]).map(c=>(
              <div key={c.id} style={{background:th.surface2,borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:600,color:th.textPrimary}}>{c.author}</span>
                  <span style={{fontSize:11,color:th.textTertiary}}>{new Date(c.ts).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
                </div>
                <div style={{fontSize:13,color:th.textSecondary,lineHeight:1.5}}>{c.text}</div>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <input value={newComment} onChange={e=>setNewComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),addComment())} placeholder="Add a comment..." style={{flex:1,fontSize:14,padding:"9px 10px",border:`0.5px solid ${th.borderMid}`,borderRadius:8,outline:"none",color:th.textPrimary,background:th.inputBg}}/>
              <button onClick={addComment} style={{padding:"9px 16px",borderRadius:8,border:"none",background:BRAND,color:"#2c2c2a",fontSize:13,cursor:"pointer",fontWeight:600}}>Post</button>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:`0.5px solid ${th.border}`,gap:8}}>
            <button onClick={()=>onDelete(task.id)} style={{flex:1,padding:"11px 14px",borderRadius:10,border:"0.5px solid #F0997B",background:"#FAECE7",color:"#993C1D",fontSize:13,cursor:"pointer",fontWeight:500}}>Delete</button>
            <button onClick={()=>onSave(form)} style={{flex:2,padding:"11px 18px",borderRadius:10,border:"none",background:BRAND,color:"#2c2c2a",fontSize:13,cursor:"pointer",fontWeight:600}}>Save changes</button>
          </div>
          <div style={{height:8}}/>
        </div>
      </div>
    </div>
  );
}

// ── Add task modal ────────────────────────────────────────────────────────────
function AddTaskModal({depts,onSave,onClose,theme,colorMap={}}){
  const th=theme||{border:"#e8e7e3",borderMid:"#d3d1c7",textPrimary:"#2c2c2a",textSecondary:"#5f5e5a",textTertiary:"#888780",inputBg:"#ffffff",surface:"#ffffff"};
  const [form,setForm]=useState({t:"",note:"",owner:"",phase:"1",p:"high",due:"",deptId:depts[0]?.id||"",status:"open",comments:[],attachments:[]});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const valid=form.t.trim()&&form.deptId;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:th.surface,borderRadius:"16px 16px 0 0",width:"100%",maxWidth:600,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{width:36,height:4,borderRadius:2,background:th.borderMid,margin:"10px auto 0"}}/>
        <div style={{padding:"12px 16px 10px",borderBottom:`0.5px solid ${th.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:16,fontWeight:500,color:th.textPrimary}}>Add new task</span>
          <button onClick={onClose} style={{border:"none",background:"none",fontSize:22,color:th.textTertiary,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{fontSize:10,color:th.textTertiary,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Task name *</div>
            <input value={form.t} onChange={e=>set("t",e.target.value)} placeholder="What needs to get done?" style={{width:"100%",fontSize:14,padding:"10px 12px",border:`0.5px solid ${th.borderMid}`,borderRadius:8,outline:"none",color:th.textPrimary,background:th.inputBg}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <div style={{fontSize:10,color:th.textTertiary,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Department *</div>
              <select value={form.deptId} onChange={e=>set("deptId",e.target.value)} style={{width:"100%",fontSize:13,padding:"8px 10px",border:`0.5px solid ${th.borderMid}`,borderRadius:8,outline:"none",color:th.textPrimary,background:th.inputBg}}>
                {depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:10,color:th.textTertiary,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Phase</div>
              <select value={form.phase} onChange={e=>set("phase",e.target.value)} style={{width:"100%",fontSize:13,padding:"8px 10px",border:`0.5px solid ${th.borderMid}`,borderRadius:8,outline:"none",color:th.textPrimary,background:th.inputBg}}>
                <option value="1">Week 1-2</option><option value="2">Week 3-4</option><option value="3">Month 2</option>
              </select>
            </div>
            <div>
              <div style={{fontSize:10,color:th.textTertiary,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Priority</div>
              <select value={form.p} onChange={e=>set("p",e.target.value)} style={{width:"100%",fontSize:13,padding:"8px 10px",border:`0.5px solid ${th.borderMid}`,borderRadius:8,outline:"none",color:th.textPrimary,background:th.inputBg}}>
                <option value="crit">Critical</option><option value="high">High</option><option value="med">Medium</option>
              </select>
            </div>
            <div>
              <div style={{fontSize:10,color:th.textTertiary,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Due</div>
              <input type="date" value={form.due||""} onChange={e=>set("due",e.target.value)}
                style={{width:"100%",fontSize:13,padding:"8px 10px",border:`0.5px solid ${th.borderMid}`,borderRadius:8,outline:"none",color:form.due?th.textPrimary:th.textTertiary,background:th.inputBg,boxSizing:"border-box"}}/>
            </div>
          </div>
          <div>
            <div style={{fontSize:10,color:th.textTertiary,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Owner</div>
            <OwnerSelect value={form.owner} onChange={v=>set("owner",v)} theme={th} colorMap={colorMap}/>
          </div>
          <div>
            <div style={{fontSize:10,color:th.textTertiary,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Notes</div>
            <textarea value={form.note} onChange={e=>set("note",e.target.value)} rows={2} placeholder="Optional context..." style={{width:"100%",fontSize:13,padding:"8px 10px",border:`0.5px solid ${th.borderMid}`,borderRadius:8,resize:"vertical",outline:"none",color:th.textPrimary,background:th.inputBg,fontFamily:"inherit"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:8,paddingTop:4,borderTop:`0.5px solid ${th.border}`}}>
            <button onClick={onClose} style={{padding:"10px 18px",borderRadius:10,border:`0.5px solid ${th.borderMid}`,background:"transparent",color:th.textSecondary,fontSize:13,cursor:"pointer"}}>Cancel</button>
            <button onClick={()=>valid&&onSave({...form,id:uid()})} disabled={!valid} style={{flex:1,padding:"10px 18px",borderRadius:10,border:"none",background:valid?BRAND:"#d3d1c7",color:"#2c2c2a",fontSize:13,cursor:valid?"pointer":"default",fontWeight:600}}>Add task</button>
          </div>
          <div style={{height:8}}/>
        </div>
      </div>
    </div>
  );
}

// ── Profile Modal ─────────────────────────────────────────────────────────────
const PROFILE_COLORS=["#534AB7","#185FA5","#0F6E56","#993C1D","#639922","#993556","#854F0B","#5F5E5A","#3B6D11","#D4952C","#1A7A6B","#8B3FA8"];

function ProfileModal({currentUser,allowedUser,currentColor,currentAvatar,onSave,onClose,theme}){
  const [selectedColor,setSelectedColor]=useState(currentColor||PROFILE_COLORS[0]);
  const [avatarPreview,setAvatarPreview]=useState(currentAvatar||null);
  const [saving,setSaving]=useState(false);
  const fileRef=useRef(null);

  const handleFile=(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave=async()=>{
    setSaving(true);
    await onSave({color:selectedColor,avatar_url:avatarPreview});
    setSaving(false);
    onClose();
  };

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:theme.surface,borderRadius:16,width:"100%",maxWidth:380,padding:"24px 24px 20px"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <span style={{fontSize:15,fontWeight:600,color:theme.textPrimary}}>Edit Profile</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:theme.textTertiary,fontSize:20,lineHeight:1,padding:"0 2px"}}>×</button>
        </div>

        {/* Avatar */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:22,gap:8}}>
          <div style={{position:"relative",cursor:"pointer"}} onClick={()=>fileRef.current?.click()}>
            {avatarPreview
              ?<img src={avatarPreview} style={{width:76,height:76,borderRadius:"50%",objectFit:"cover",border:`3px solid ${selectedColor}`}} alt=""/>
              :<div style={{width:76,height:76,borderRadius:"50%",background:selectedColor+"22",color:selectedColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:600,border:`3px solid ${selectedColor}`}}>
                {initials(currentUser)}
              </div>
            }
            <div style={{position:"absolute",bottom:0,right:0,width:24,height:24,borderRadius:"50%",background:BRAND,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${theme.surface}`}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2c2c2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:500,color:theme.textPrimary}}>{currentUser}</div>
            {allowedUser?.email&&<div style={{fontSize:11,color:theme.textTertiary}}>{allowedUser.email}</div>}
          </div>
          {avatarPreview&&(
            <button onClick={()=>setAvatarPreview(null)} style={{fontSize:11,color:theme.textTertiary,background:"none",border:"none",cursor:"pointer",textDecoration:"underline",padding:0}}>Remove photo</button>
          )}
        </div>

        {/* Color picker */}
        <div style={{marginBottom:22}}>
          <div style={{fontSize:11,fontWeight:600,color:theme.textTertiary,textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Task Tracker Color</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
            {PROFILE_COLORS.map(c=>(
              <button key={c} onClick={()=>setSelectedColor(c)}
                style={{width:30,height:30,borderRadius:"50%",background:c,border:selectedColor===c?`3px solid ${theme.textPrimary}`:`3px solid transparent`,cursor:"pointer",outline:"none",flexShrink:0,transition:"border-color .15s"}}/>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:theme.surface2,borderRadius:8}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:selectedColor+"22",color:selectedColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,flexShrink:0}}>
              {initials(currentUser)}
            </div>
            <span style={{fontSize:12,color:theme.textSecondary}}>Preview of your task tracker appearance</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"8px 16px",borderRadius:8,border:`0.5px solid ${theme.borderMid}`,background:"transparent",color:theme.textSecondary,fontSize:13,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"8px 18px",borderRadius:8,border:"none",background:BRAND,color:"#2c2c2a",fontSize:13,fontWeight:600,cursor:"pointer"}}>
            {saving?"Saving…":"Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App(){
  const [session,setSession]=useState(undefined);
  const [allowedUser,setAllowedUser]=useState(null);
  const [authChecking,setAuthChecking]=useState(true);
  const [depts,setDepts]=useState(null);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [lastSaved,setLastSaved]=useState(null);
  const [activeView,setActiveView]=useState("dashboard");
  const [filterPhase,setFilterPhase]=useState("all");
  const [filterPri,setFilterPri]=useState("all");
  const [search,setSearch]=useState("");
  const [openTask,setOpenTask]=useState(null);
  const [openDepts,setOpenDepts]=useState({});
  const [showAddTask,setShowAddTask]=useState(false);
  const [darkMode,setDarkMode]=useState(false);
  const [showProfile,setShowProfile]=useState(false);
  const [profileColor,setProfileColor]=useState(null);
  const [profileAvatar,setProfileAvatar]=useState(null);
  const [myTasksSort,setMyTasksSort]=useState("priority");
  const [calMonth,setCalMonth]=useState(()=>{const d=new Date();d.setDate(1);return d;});
  const [calHiddenMembers,setCalHiddenMembers]=useState(()=>new Set());
  const isMobile=useIsMobile();

  const theme={
    bg:darkMode?"#1a1a18":"#f5f5f3",
    surface:darkMode?"#242422":"#ffffff",
    surface2:darkMode?"#2e2e2c":"#f9f9f8",
    border:darkMode?"#3a3a38":"#e8e7e3",
    borderMid:darkMode?"#4a4a48":"#d3d1c7",
    textPrimary:darkMode?"#e8e7e2":"#2c2c2a",
    textSecondary:darkMode?"#9c9a92":"#5f5e5a",
    textTertiary:darkMode?"#666460":"#888780",
    inputBg:darkMode?"#2e2e2c":"#ffffff",
  };

  useEffect(()=>{const dm=localStorage.getItem("durus_dark");if(dm==="1")setDarkMode(true);},[]);
  useEffect(()=>{
    const c=localStorage.getItem("durus_profile_color");if(c)setProfileColor(c);
    const a=localStorage.getItem("durus_profile_avatar");if(a)setProfileAvatar(a);
  },[]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setSession(session);
      if(session)checkAllowed(session.user.email);
      else setAuthChecking(false);
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      setSession(session);
      if(session)checkAllowed(session.user.email);
      else{setAllowedUser(null);setAuthChecking(false);}
    });
    return()=>subscription.unsubscribe();
  },[]);

  async function checkAllowed(email){
    setAuthChecking(true);
    try{const{data}=await supabase.from("allowed_users").select("*").eq("email",email).single();setAllowedUser(data||null);}
    catch(e){setAllowedUser(null);}
    setAuthChecking(false);
  }

  const signOut=async()=>{await supabase.auth.signOut();setSession(null);setAllowedUser(null);};

  const saveProfile=async({color,avatar_url})=>{
    if(color){localStorage.setItem("durus_profile_color",color);setProfileColor(color);}
    if(avatar_url!==undefined){
      if(avatar_url){localStorage.setItem("durus_profile_avatar",avatar_url);}
      else{localStorage.removeItem("durus_profile_avatar");}
      setProfileAvatar(avatar_url);
    }
    try{await supabase.from("allowed_users").update({color,avatar_url}).eq("email",session?.user?.email);}
    catch(e){/* stored locally already */}
  };

  const currentUser=allowedUser?.display_name||session?.user?.user_metadata?.full_name||session?.user?.email?.split("@")[0]||"";
  const effectiveColor=profileColor||allowedUser?.color||BRAND;
  const effectiveAvatar=profileAvatar||allowedUser?.avatar_url||session?.user?.user_metadata?.avatar_url||null;

  function buildDepts(rows){
    const map={};
    DEFAULT_DEPTS.forEach(d=>{map[d.id]={...d,tasks:[]};});
    rows.forEach(row=>{if(map[row.dept_id])map[row.dept_id].tasks.push(rowToTask(row));});
    return DEFAULT_DEPTS.map(d=>map[d.id]);
  }

  useEffect(()=>{
    if(!allowedUser)return;
    (async()=>{
      try{
        const{data,error}=await supabase.from("tasks").select("*");
        if(error)throw error;
        if(data&&data.length>0){setDepts(buildDepts(data));}
        else{setDepts(DEFAULT_DEPTS);await supabase.from("tasks").insert(DEFAULT_DEPTS.flatMap(d=>d.tasks.map(t=>taskToRow(t,d.id))));}
      }catch(e){console.error(e);setDepts(DEFAULT_DEPTS);}
      setLoading(false);
    })();
  },[allowedUser]);

  useEffect(()=>{
    if(!depts)return;
    const interval=setInterval(async()=>{
      try{const{data}=await supabase.from("tasks").select("*");if(data)setDepts(buildDepts(data));}catch(e){}
    },10000);
    return()=>clearInterval(interval);
  },[!!depts]);

  const logChange=useCallback(async(action,taskTitle,deptName,detail="")=>{
    if(!currentUser)return;
    try{await supabase.from("changelog").insert({id:uid(),user_name:currentUser,action,task_title:taskTitle||null,dept_name:deptName||null,detail:detail||null});}
    catch(e){console.error(e);}
  },[currentUser]);

  const persistTask=useCallback(async(task,deptId)=>{
    setSaving(true);
    try{await supabase.from("tasks").upsert(taskToRow(task,deptId));setLastSaved(new Date());}
    catch(e){console.error(e);}
    setSaving(false);
  },[]);

  const deleteTaskFromDB=useCallback(async(taskId)=>{
    try{await supabase.from("tasks").delete().eq("id",taskId);}catch(e){console.error(e);}
  },[]);

  const toggleStatus=(taskId)=>{
    let changed,deptId,deptName;
    const newDepts=depts.map(d=>({...d,tasks:d.tasks.map(t=>{
      if(t.id===taskId){changed={...t,status:t.status==="done"?"open":"done"};deptId=d.id;deptName=d.name;return changed;}
      return t;
    })}));
    setDepts(newDepts);
    if(changed&&deptId){persistTask(changed,deptId);logChange(changed.status==="done"?"completed":"reopened",changed.t,deptName);}
  };

  const saveTask=(updated,originalTask,deptName)=>{
    let deptId;
    const newDepts=depts.map(d=>{
      if(d.tasks.some(t=>t.id===updated.id)){deptId=d.id;return{...d,tasks:d.tasks.map(t=>t.id===updated.id?updated:t)};}
      return d;
    });
    setDepts(newDepts);
    if(deptId){
      persistTask(updated,deptId);
      if(originalTask&&updated.status!==originalTask.status){logChange("status",updated.t,deptName,`${originalTask.status} → ${updated.status}`);}
      else if(originalTask&&updated.comments?.length>(originalTask.comments?.length||0)){const lc=updated.comments[updated.comments.length-1];logChange("commented",updated.t,deptName,lc?.text?.slice(0,80));}
      else{logChange("updated",updated.t,deptName);}
    }
    setOpenTask(null);
  };

  const deleteTask=(taskId,taskTitle,deptName)=>{
    setDepts(depts.map(d=>({...d,tasks:d.tasks.filter(t=>t.id!==taskId)})));
    deleteTaskFromDB(taskId);
    logChange("deleted",taskTitle,deptName);
    setOpenTask(null);
  };

  const addTask=(form)=>{
    const dept=depts.find(d=>d.id===form.deptId);
    setDepts(depts.map(d=>d.id===form.deptId?{...d,tasks:[...d.tasks,form]}:d));
    persistTask(form,form.deptId);
    logChange("added",form.t,dept?.name);
    setShowAddTask(false);
  };

  const toggleDark=()=>{const next=!darkMode;setDarkMode(next);localStorage.setItem("durus_dark",next?"1":"0");};

  // Auth gate
  if(session===undefined||authChecking)return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:theme.bg}}><div style={{fontSize:13,color:theme.textTertiary}}>Loading...</div></div>;
  if(!session)return <SignInScreen theme={theme}/>;
  if(!allowedUser)return <AccessDenied email={session.user.email} theme={theme} onSignOut={signOut}/>;
  if(loading||!depts)return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:theme.bg}}><div style={{fontSize:13,color:theme.textTertiary}}>Loading dashboard...</div></div>;

  const allTasks=depts.flatMap(d=>d.tasks.map(t=>({...t,deptColor:d.color,deptName:d.name,deptId:d.id})));
  const total=allTasks.length;
  const done=allTasks.filter(t=>t.status==="done").length;
  const crit=allTasks.filter(t=>t.p==="crit");
  const critDone=crit.filter(t=>t.status==="done").length;
  const blocked=allTasks.filter(t=>t.status==="blocked").length;
  const ph1=allTasks.filter(t=>t.phase==="1");
  const pct=total?Math.round(done/total*100):0;

  const filteredTasks=allTasks.filter(t=>{
    if(filterPhase!=="all"&&t.phase!==filterPhase)return false;
    if(filterPri==="crit"&&t.p!=="crit")return false;
    if(filterPri==="open"&&t.status==="done")return false;
    if(filterPri==="blocked"&&t.status!=="blocked")return false;
    if(search&&!t.t.toLowerCase().includes(search.toLowerCase())&&!t.owner.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });

  const openTaskObj=openTask?allTasks.find(t=>t.id===openTask):null;
  const openTaskDept=openTask?depts.find(d=>d.tasks.some(t=>t.id===openTask)):null;

  const TAB_VIEWS=["dashboard","tasks","mytasks","calendar","team","risks"];
  const TAB_LABELS=["Home","Tasks","My Tasks","Calendar","Team","Risks"];
  const TAB_ICONS={
    dashboard:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    tasks:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><polyline points="3 6 4 7 6 5"/><polyline points="3 12 4 13 6 11"/><polyline points="3 18 4 19 6 17"/></svg>,
    team:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    mytasks:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    calendar:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    risks:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  };

  const NavBtn=({id,label})=>(
    <button onClick={()=>setActiveView(id)} style={{padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:500,border:"0.5px solid",borderColor:activeView===id?BRAND:theme.borderMid,background:activeView===id?BRAND:"transparent",color:activeView===id?"#2c2c2a":theme.textSecondary,cursor:"pointer",whiteSpace:"nowrap"}}>
      {label}
    </button>
  );

  return(
    <div style={{minHeight:"100vh",background:theme.bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",paddingBottom:isMobile?72:0}}>

      {/* Top bar */}
      <div style={{background:theme.surface,borderBottom:`0.5px solid ${theme.border}`,padding:isMobile?"10px 14px":"12px 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:isMobile?0:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <img src="/logo.png" alt="Durus Roofing" style={{height:isMobile?24:28,objectFit:"contain"}}/>
              {!isMobile&&<div style={{fontSize:13,color:theme.textSecondary}}>{saving?"Saving...":lastSaved?`Saved ${lastSaved.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:"All changes sync to team"}</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:isMobile?8:10}}>
              <button onClick={toggleDark} style={{width:34,height:19,borderRadius:10,border:"none",background:darkMode?BRAND:"#d3d1c7",cursor:"pointer",position:"relative",flexShrink:0,padding:0}}>
                <div style={{position:"absolute",top:2,left:darkMode?16:2,width:15,height:15,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
              </button>
              <div onClick={()=>setShowProfile(true)} style={{display:"flex",alignItems:"center",gap:6,background:theme.surface2,borderRadius:20,padding:"3px 10px 3px 5px",cursor:"pointer"}} title="Edit profile">
                {effectiveAvatar
                  ?<img src={effectiveAvatar} style={{width:22,height:22,borderRadius:"50%",objectFit:"cover"}} alt=""/>
                  :<div style={{width:22,height:22,borderRadius:"50%",background:effectiveColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>{initials(currentUser).slice(0,1)}</div>
                }
                <span style={{fontSize:12,fontWeight:500,color:theme.textPrimary}}>{currentUser.split(" ")[0]}</span>
              </div>
              <button onClick={signOut} style={{padding:isMobile?"6px 10px":"6px 12px",borderRadius:8,border:`0.5px solid ${theme.borderMid}`,background:"transparent",color:theme.textSecondary,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>Sign out</button>
              <button onClick={()=>setShowAddTask(true)} style={{padding:isMobile?"7px 12px":"7px 16px",borderRadius:8,border:"none",background:BRAND,color:"#2c2c2a",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
                {isMobile?"+ Task":"+ Add task"}
              </button>
            </div>
          </div>
          {!isMobile&&(
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:2}}>
              <NavBtn id="dashboard" label="Dashboard"/>
              <NavBtn id="tasks" label="All tasks"/>
              <NavBtn id="mytasks" label="My Tasks"/>
              <NavBtn id="calendar" label="Calendar"/>
              <NavBtn id="team" label="Team"/>
              <NavBtn id="risks" label="Risks"/>
            </div>
          )}
        </div>
      </div>

      {isMobile&&(
        <div style={{background:theme.surface2,borderBottom:`0.5px solid ${theme.border}`,padding:"5px 14px",textAlign:"center"}}>
          <span style={{fontSize:11,color:theme.textTertiary}}>{saving?"Saving...":lastSaved?`Saved ${lastSaved.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:"All changes sync to team"}</span>
        </div>
      )}

      <div style={{maxWidth:980,margin:"0 auto",padding:isMobile?"12px 12px":"20px 16px"}}>

        {/* DASHBOARD */}
        {activeView==="dashboard"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,minmax(0,1fr))",gap:isMobile?8:10,marginBottom:14}}>
              {[
                {label:"Overall",val:`${pct}%`,sub:`${done}/${total} tasks`},
                {label:"Critical",val:`${critDone}/${crit.length}`,sub:`${crit.length-critDone} open`},
                {label:"Phase 1",val:`${ph1.length?Math.round(ph1.filter(t=>t.status==="done").length/ph1.length*100):0}%`,sub:`${ph1.filter(t=>t.status==="done").length}/${ph1.length} done`},
                {label:"Blocked",val:blocked,sub:blocked===0?"Clear":"Need attention",alert:blocked>0},
              ].map((m,i)=>(
                <div key={i} style={{background:m.alert&&blocked>0?"#FAECE7":theme.surface,border:`0.5px solid ${m.alert&&blocked>0?"#F0997B":theme.border}`,borderRadius:10,padding:isMobile?"10px 12px":"12px 14px"}}>
                  <div style={{fontSize:10,color:theme.textTertiary,marginBottom:3,textTransform:"uppercase",letterSpacing:".06em"}}>{m.label}</div>
                  <div style={{fontSize:isMobile?20:22,fontWeight:600,color:m.alert&&blocked>0?"#993C1D":theme.textPrimary,lineHeight:1.1}}>{m.val}</div>
                  <div style={{fontSize:11,color:m.alert&&blocked>0?"#993C1D":theme.textSecondary,marginTop:2}}>{m.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"minmax(0,1.4fr) minmax(0,1fr)",gap:isMobile?8:14,marginBottom:isMobile?8:14}}>
              <div style={{background:theme.surface,border:`0.5px solid ${theme.border}`,borderRadius:12,padding:"14px 16px"}}>
                <div style={{fontSize:11,fontWeight:600,color:theme.textPrimary,marginBottom:12,textTransform:"uppercase",letterSpacing:".05em"}}>Phase progress</div>
                {[["1","Phase 1 — Legal & infrastructure","#185FA5"],["2","Phase 2 — Operations & brand","#854F0B"],["3","Phase 3 — Scale & expansion","#3B6D11"]].map(([p,label,color])=>{
                  const pts=allTasks.filter(t=>t.phase===p);
                  const d=pts.filter(t=>t.status==="done").length;
                  const pc=pts.length?Math.round(d/pts.length*100):0;
                  return(
                    <div key={p} style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{fontSize:isMobile?11:12,fontWeight:500,color:theme.textPrimary}}>{label}</span>
                        <span style={{fontSize:11,color:theme.textTertiary}}>{d}/{pts.length}</span>
                      </div>
                      <div style={{height:5,background:theme.surface2,borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pc}%`,background:color,borderRadius:3}}/>
                      </div>
                      <div style={{fontSize:10,color:theme.textTertiary,marginTop:2}}>{pc}% complete</div>
                    </div>
                  );
                })}
              </div>
              <div style={{background:theme.surface,border:`0.5px solid ${theme.border}`,borderRadius:12,padding:"14px 16px"}}>
                <div style={{fontSize:11,fontWeight:600,color:theme.textPrimary,marginBottom:12,textTransform:"uppercase",letterSpacing:".05em"}}>Open critical tasks</div>
                {crit.filter(t=>t.status!=="done").length===0
                  ?<div style={{fontSize:12,color:"#3B6D11"}}>All critical tasks complete!</div>
                  :crit.filter(t=>t.status!=="done").slice(0,isMobile?4:6).map(task=>(
                    <div key={task.id} onClick={()=>setOpenTask(task.id)} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:`0.5px solid ${theme.border}`,cursor:"pointer"}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:"#D85A30",flexShrink:0,marginTop:6}}/>
                      <div>
                        <div style={{fontSize:12,color:theme.textPrimary,lineHeight:1.35}}>{task.t}</div>
                        <div style={{fontSize:10,color:theme.textTertiary,marginTop:1}}>{task.owner}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div style={{background:theme.surface,border:`0.5px solid ${theme.border}`,borderRadius:12,padding:"14px 16px",marginBottom:isMobile?8:14}}>
              <div style={{fontSize:11,fontWeight:600,color:theme.textPrimary,marginBottom:12,textTransform:"uppercase",letterSpacing:".05em"}}>Department overview</div>
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
                {depts.map(d=>{
                  const dd=d.tasks.filter(t=>t.status==="done").length;
                  const dp=d.tasks.length?Math.round(dd/d.tasks.length*100):0;
                  const dc=d.tasks.filter(t=>t.p==="crit"&&t.status!=="done").length;
                  return(
                    <div key={d.id} onClick={()=>setActiveView("tasks")} style={{background:theme.surface2,borderRadius:8,padding:"10px 12px",cursor:"pointer",border:`0.5px solid ${theme.border}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:d.color}}/>
                        <span style={{fontSize:11,fontWeight:500,color:theme.textPrimary,lineHeight:1.3}}>{d.name}</span>
                      </div>
                      <div style={{height:3,background:theme.border,borderRadius:2,overflow:"hidden",marginBottom:4}}>
                        <div style={{height:"100%",width:`${dp}%`,background:d.color,borderRadius:2}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontSize:10,color:theme.textTertiary}}>{dd}/{d.tasks.length}</span>
                        {dc>0&&<span style={{fontSize:10,color:"#993C1D",fontWeight:600}}>{dc} crit</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{background:theme.surface,border:`0.5px solid ${theme.border}`,borderRadius:12,overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:`0.5px solid ${theme.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{fontSize:11,fontWeight:600,color:theme.textPrimary,textTransform:"uppercase",letterSpacing:".05em"}}>Team activity</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:BRAND,animation:"pulse 2s infinite"}}/>
                  <span style={{fontSize:10,color:theme.textTertiary}}>Live</span>
                </div>
              </div>
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
              <ChangelogFeed theme={theme} userColorMap={{[currentUser]:effectiveColor}} onTaskClick={(entry)=>{const task=allTasks.find(t=>t.t===entry.task_title);if(task)setOpenTask(task.id);}}/>
            </div>
          </div>
        )}

        {/* TASKS */}
        {activeView==="tasks"&&(
          <div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10,alignItems:"center"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{padding:"7px 12px",borderRadius:12,fontSize:13,border:`0.5px solid ${theme.borderMid}`,outline:"none",color:theme.textPrimary,background:theme.inputBg,flex:1,minWidth:0}}/>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
              {[["all","All"],["1","Wk 1-2"],["2","Wk 3-4"],["3","Mo 2"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFilterPhase(v)} style={{padding:"5px 11px",borderRadius:12,fontSize:11,border:"0.5px solid",borderColor:filterPhase===v?BRAND:theme.borderMid,background:filterPhase===v?BRAND:"transparent",color:filterPhase===v?"#2c2c2a":theme.textSecondary,cursor:"pointer"}}>{l}</button>
              ))}
              {[["all","All pri."],["crit","Critical"],["open","Open"],["blocked","Blocked"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFilterPri(v)} style={{padding:"5px 11px",borderRadius:12,fontSize:11,border:"0.5px solid",borderColor:filterPri===v?BRAND:theme.borderMid,background:filterPri===v?BRAND:"transparent",color:filterPri===v?"#2c2c2a":theme.textSecondary,cursor:"pointer"}}>{l}</button>
              ))}
            </div>
            {depts.map(d=>{
              const tasks=filteredTasks.filter(task=>task.deptId===d.id);
              if(!tasks.length)return null;
              const isOpen=openDepts[d.id]!==false;
              return(
                <div key={d.id} style={{background:theme.surface,border:`0.5px solid ${theme.border}`,borderRadius:12,marginBottom:10,overflow:"hidden"}}>
                  <div onClick={()=>setOpenDepts(o=>({...o,[d.id]:!isOpen}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",cursor:"pointer",borderBottom:isOpen?`0.5px solid ${theme.border}`:"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:d.color}}/>
                      <span style={{fontSize:13,fontWeight:500,color:theme.textPrimary}}>{d.name}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:11,color:theme.textTertiary}}>{tasks.filter(t=>t.status==="done").length}/{tasks.length}</span>
                      <span style={{fontSize:9,color:theme.textTertiary,display:"inline-block",transform:isOpen?"rotate(90deg)":"none",transition:"transform .2s"}}>▶</span>
                    </div>
                  </div>
                  {isOpen&&(
                    <div>
                      {tasks.map(task=>(
                        isMobile?(
                          <div key={task.id} style={{padding:"12px 14px",borderBottom:`0.5px solid ${theme.border}`,cursor:"pointer"}} onClick={()=>setOpenTask(task.id)}>
                            <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                              <div onClick={e=>{e.stopPropagation();toggleStatus(task.id);}} style={{width:22,height:22,borderRadius:6,border:`1.5px solid ${task.status==="done"?"#3B6D11":theme.borderMid}`,background:task.status==="done"?"#3B6D11":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",marginTop:1}}>
                                {task.status==="done"&&<div style={{width:9,height:6,borderLeft:"1.5px solid #fff",borderBottom:"1.5px solid #fff",transform:"rotate(-45deg) translate(0,1px)"}}/>}
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:13,color:task.status==="done"?theme.textTertiary:theme.textPrimary,textDecoration:task.status==="done"?"line-through":"none",lineHeight:1.4,marginBottom:5}}>{task.t}</div>
                                <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                                  <PriBadge p={task.p}/><PhasePill phase={parseInt(task.phase)}/><StatusBadge status={task.status}/>
                                  {task.owner&&<span style={{fontSize:10,color:theme.textTertiary}}>{task.owner}</span>}
                                  {(task.comments||[]).length>0&&<span style={{fontSize:10,color:"#185FA5"}}>{task.comments.length} comment{task.comments.length>1?"s":""}</span>}
                                </div>
                              </div>
                              <span style={{fontSize:11,color:theme.textTertiary,flexShrink:0}}>›</span>
                            </div>
                          </div>
                        ):(
                          <div key={task.id} style={{display:"grid",gridTemplateColumns:"20px 1fr 140px 80px 90px 80px",gap:8,alignItems:"start",padding:"8px 14px",borderBottom:`0.5px solid ${theme.border}`,cursor:"pointer"}}
                            onClick={()=>setOpenTask(task.id)}>
                            <div onClick={e=>{e.stopPropagation();toggleStatus(task.id);}} style={{width:16,height:16,borderRadius:4,border:`1.5px solid ${task.status==="done"?"#3B6D11":theme.borderMid}`,background:task.status==="done"?"#3B6D11":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",marginTop:1}}>
                              {task.status==="done"&&<div style={{width:8,height:5,borderLeft:"1.5px solid #fff",borderBottom:"1.5px solid #fff",transform:"rotate(-45deg) translate(0,1px)"}}/>}
                            </div>
                            <div>
                              <div style={{fontSize:12,color:task.status==="done"?theme.textTertiary:theme.textPrimary,textDecoration:task.status==="done"?"line-through":"none",lineHeight:1.4}}>{task.t}</div>
                              {task.note&&<div style={{fontSize:11,color:theme.textTertiary,marginTop:1}}>{task.note}</div>}
                              {(task.comments||[]).length>0&&<div style={{fontSize:10,color:"#185FA5",marginTop:2}}>{task.comments.length} comment{task.comments.length>1?"s":""}</div>}
                            </div>
                            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                              {(task.owner||"").split(",").map(s=>s.trim()).filter(Boolean).map(name=>(
                                <span key={name} style={{display:"inline-flex",alignItems:"center",gap:3,background:(name===currentUser?effectiveColor:avatarColor(name))+"22",color:name===currentUser?effectiveColor:avatarColor(name),borderRadius:10,padding:"1px 6px 1px 3px",fontSize:10,fontWeight:500,whiteSpace:"nowrap"}}>
                                  <span style={{width:14,height:14,borderRadius:"50%",background:name===currentUser?effectiveColor:avatarColor(name),color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,flexShrink:0}}>{initials(name)}</span>
                                  {name.split(" ")[0]}
                                </span>
                              ))}
                            </div>
                            <div><PhasePill phase={parseInt(task.phase)}/></div>
                            <div><StatusBadge status={task.status}/></div>
                            <div><PriBadge p={task.p}/></div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TIMELINE */}
        {activeView==="timeline"&&(
          isMobile?(
            <div style={{background:theme.surface,border:`0.5px solid ${theme.border}`,borderRadius:12,padding:"24px 16px",textAlign:"center"}}>
              <div style={{fontSize:13,color:theme.textSecondary,lineHeight:1.6}}>The timeline view is best on a larger screen. Rotate your device to landscape or open on desktop.</div>
            </div>
          ):(
            <div style={{background:theme.surface,border:`0.5px solid ${theme.border}`,borderRadius:12,padding:"16px 18px",overflowX:"auto"}}>
              <div style={{fontSize:11,fontWeight:600,color:theme.textPrimary,marginBottom:14,textTransform:"uppercase",letterSpacing:".05em"}}>Launch timeline — weeks 1 through 8</div>
              <div style={{minWidth:560}}>
                <div style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:8,marginBottom:8}}>
                  <div/>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:2}}>
                    {["Wk 1","Wk 2","Wk 3","Wk 4","Wk 5","Wk 6","Wk 7","Wk 8"].map(w=>(
                      <div key={w} style={{fontSize:10,color:theme.textTertiary,textAlign:"center"}}>{w}</div>
                    ))}
                  </div>
                </div>
                {[
                  {label:"Entity + EIN",start:0,dur:7,color:"#534AB7"},{label:"Insurance",start:0,dur:10,color:"#534AB7"},
                  {label:"C39 / RMO confirm",start:0,dur:7,color:"#993C1D"},{label:"Contractor agreement",start:2,dur:5,color:"#534AB7"},
                  {label:"ServiceTitan setup",start:3,dur:7,color:"#993C1D"},{label:"QBO setup",start:3,dur:5,color:"#0F6E56"},
                  {label:"Domain + email",start:5,dur:3,color:"#993556"},{label:"Brand kit + website",start:7,dur:10,color:"#993556"},
                  {label:"Google Business Profile",start:7,dur:5,color:"#993556"},{label:"Joey onboarded",start:5,dur:4,color:"#185FA5"},
                  {label:"Dispatch workflow",start:10,dur:5,color:"#185FA5"},{label:"ST pipeline config",start:14,dur:5,color:"#993C1D"},
                  {label:"ST + QBO connected",start:14,dur:5,color:"#0F6E56"},{label:"First job dispatched",start:21,dur:3,color:BRAND},
                  {label:"Google LSA live",start:28,dur:5,color:"#993556"},{label:"2nd contractor",start:28,dur:10,color:"#185FA5"},
                  {label:"Ins. adj. meetings",start:28,dur:14,color:"#993C1D"},
                ].map((g,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:8,alignItems:"center",padding:"3px 0",borderBottom:`0.5px solid ${theme.border}`}}>
                    <div style={{fontSize:11,color:theme.textSecondary,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{g.label}</div>
                    <div style={{position:"relative",height:12,background:theme.surface2,borderRadius:3,overflow:"hidden"}}>
                      <div style={{position:"absolute",top:0,left:`${Math.round(g.start/56*100)}%`,width:`${Math.max(3,Math.round(g.dur/56*100))}%`,height:"100%",background:g.color,borderRadius:3,opacity:.85}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* TEAM */}
        {activeView==="team"&&(
          <div>
            <div style={{fontSize:12,color:theme.textTertiary,marginBottom:12}}>Click any team member to see their tasks. Your card is expanded by default.</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {TEAM_MEMBERS.map(p=>(
                <TeamCard key={p.name} person={p} allTasks={allTasks} theme={theme} currentUser={currentUser} effectiveColor={effectiveColor} effectiveAvatar={effectiveAvatar} onTaskClick={(taskId)=>setOpenTask(taskId)}/>
              ))}
            </div>
          </div>
        )}

        {/* MY TASKS */}
        {activeView==="mytasks"&&(()=>{
          const myTasks=allTasks.filter(t=>(t.owner||"").split(",").map(s=>s.trim()).includes(currentUser));
          const openTasks=myTasks.filter(t=>t.status!=="done");
          const doneTasks=myTasks.filter(t=>t.status==="done");
          const critCount=openTasks.filter(t=>t.p==="crit").length;
          const blockedCount=openTasks.filter(t=>t.status==="blocked").length;
          const sortedOpen=myTasksSort==="priority"
            ?[...openTasks].sort((a,b)=>(PRI_ORDER[a.p]??2)-(PRI_ORDER[b.p]??2))
            :[...openTasks].sort((a,b)=>(parseInt(a.phase)||1)-(parseInt(b.phase)||1));
          const allSorted=[...sortedOpen,...doneTasks];
          const meInTeam=TEAM_MEMBERS.find(p=>p.name===currentUser);
          return(
            <div>
              {/* Header + sort toggle */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <div>
                  <span style={{fontSize:14,fontWeight:600,color:theme.textPrimary}}>My Tasks</span>
                  <span style={{fontSize:12,color:theme.textTertiary,marginLeft:8}}>{openTasks.length} open</span>
                </div>
                <div style={{display:"flex",background:theme.surface,border:`0.5px solid ${theme.borderMid}`,borderRadius:8,padding:3,gap:2}}>
                  {[["priority","Highest priority"],["phase","Timeline (phase)"]].map(([val,label])=>(
                    <button key={val} onClick={()=>setMyTasksSort(val)}
                      style={{padding:"5px 12px",borderRadius:6,fontSize:12,fontWeight:500,border:"none",background:myTasksSort===val?BRAND:"transparent",color:myTasksSort===val?"#2c2c2a":theme.textSecondary,cursor:"pointer",whiteSpace:"nowrap",transition:"background .15s"}}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* User card */}
              <div style={{background:theme.surface,border:`0.5px solid ${BRAND}`,borderRadius:12,overflow:"hidden"}}>
                {/* Header */}
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:myTasks.length>0?`0.5px solid ${theme.border}`:"none"}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:effectiveColor+"18",color:effectiveColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:600,flexShrink:0,position:"relative",overflow:"hidden"}}>
                    {effectiveAvatar
                      ?<img src={effectiveAvatar} style={{width:40,height:40,borderRadius:"50%",objectFit:"cover"}} alt=""/>
                      :initials(currentUser)
                    }
                    <div style={{position:"absolute",bottom:0,right:0,width:11,height:11,borderRadius:"50%",background:BRAND,border:`2px solid ${theme.surface}`}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:13,fontWeight:500,color:theme.textPrimary}}>{currentUser}</span>
                      <span style={{fontSize:9,fontWeight:600,background:BRAND,color:"#2c2c2a",borderRadius:6,padding:"1px 5px",textTransform:"uppercase",letterSpacing:".04em"}}>You</span>
                    </div>
                    {meInTeam&&<div style={{fontSize:11,color:theme.textTertiary}}>{meInTeam.title}</div>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                    {critCount>0&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:10,background:"#FAECE7",color:"#993C1D",fontWeight:600}}>{critCount} critical</span>}
                    {blockedCount>0&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:10,background:"#FAEEDA",color:"#854F0B",fontWeight:600}}>{blockedCount} blocked</span>}
                    <span style={{fontSize:11,color:theme.textTertiary}}>{doneTasks.length}/{myTasks.length} done</span>
                  </div>
                </div>

                {/* Task rows */}
                {myTasks.length===0&&<div style={{padding:"16px 14px",fontSize:12,color:theme.textTertiary}}>No tasks assigned to you yet.</div>}
                {allSorted.map((task,i)=>{
                  const isDone=task.status==="done";
                  return(
                    <div key={task.id} onClick={()=>setOpenTask(task.id)}
                      style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderBottom:i<allSorted.length-1?`0.5px solid ${theme.border}`:"none",cursor:"pointer",opacity:isDone?0.55:1}}
                      onMouseEnter={e=>e.currentTarget.style.background=theme.surface2}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:STATUS_DOT_COLORS[task.status]||"#888780",flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,color:isDone?theme.textTertiary:theme.textPrimary,textDecoration:isDone?"line-through":"none",lineHeight:1.35,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.t}</div>
                        <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap",alignItems:"center"}}>
                          <PriBadge p={task.p}/>
                          <PhasePill phase={parseInt(task.phase)}/>
                          {task.status!=="open"&&<StatusBadge status={task.status}/>}
                          {task.deptName&&<span style={{fontSize:10,color:theme.textTertiary}}>{task.deptName}</span>}
                        </div>
                      </div>
                      <span style={{fontSize:12,color:theme.textTertiary,flexShrink:0}}>›</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* CALENDAR */}
        {activeView==="calendar"&&(()=>{
          const MONTH_NAMES=["January","February","March","April","May","June","July","August","September","October","November","December"];
          const DOW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
          const year=calMonth.getFullYear();
          const month=calMonth.getMonth();
          const firstDow=new Date(year,month,1).getDay();
          const daysInMonth=new Date(year,month+1,0).getDate();
          const totalCells=Math.ceil((firstDow+daysInMonth)/7)*7;
          const cells=Array.from({length:totalCells},(_,i)=>new Date(year,month,i-firstDow+1));
          const todayStr=new Date().toISOString().slice(0,10);

          const toggleMember=(name)=>setCalHiddenMembers(prev=>{
            const next=new Set(prev);
            if(next.has(name))next.delete(name);else next.add(name);
            return next;
          });

          // Build a per-member color map (current user uses effectiveColor)
          const memberColorOf=(name)=>{
            if(name===currentUser)return effectiveColor;
            return TEAM_MEMBERS.find(m=>m.name===name)?.color||avatarColor(name);
          };

          // Tasks visible on calendar (filter hidden members)
          const visibleTasks=allTasks.filter(t=>{
            if(t.status==="done")return false;
            const owners=(t.owner||"").split(",").map(s=>s.trim()).filter(Boolean);
            if(owners.length===0)return true;
            return owners.some(o=>!calHiddenMembers.has(o));
          });

          // Group tasks-with-due by date string
          const byDate={};
          visibleTasks.filter(t=>t.due).forEach(t=>{
            if(!byDate[t.due])byDate[t.due]=[];
            byDate[t.due].push(t);
          });

          // Tasks without a due date
          const noDueTasks=visibleTasks.filter(t=>!t.due);

          const prevMonth=()=>setCalMonth(new Date(year,month-1,1));
          const nextMonth=()=>setCalMonth(new Date(year,month+1,1));
          const goToday=()=>{const d=new Date();d.setDate(1);setCalMonth(d);};

          const btnBase={border:`0.5px solid ${theme.borderMid}`,borderRadius:8,background:"transparent",color:theme.textSecondary,cursor:"pointer",fontSize:13,padding:"5px 10px"};

          // All members for the filter row (team + current user if not in team)
          const filterMembers=[...TEAM_MEMBERS.map(m=>({name:m.name,initials:m.initials,color:m.color}))];
          if(!filterMembers.find(m=>m.name===currentUser)){
            filterMembers.unshift({name:currentUser,initials:initials(currentUser),color:effectiveColor});
          }

          return(
            <div>
              {/* Header row */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button onClick={prevMonth} style={{...btnBase,padding:"5px 12px",fontSize:16,lineHeight:1}}>‹</button>
                  <span style={{fontSize:15,fontWeight:600,color:theme.textPrimary,minWidth:170,textAlign:"center"}}>{MONTH_NAMES[month]} {year}</span>
                  <button onClick={nextMonth} style={{...btnBase,padding:"5px 12px",fontSize:16,lineHeight:1}}>›</button>
                  <button onClick={goToday} style={{...btnBase,fontSize:12}}>Today</button>
                </div>
                {/* Member visibility toggles */}
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {filterMembers.map(m=>{
                    const hidden=calHiddenMembers.has(m.name);
                    return(
                      <button key={m.name} onClick={()=>toggleMember(m.name)} title={m.name}
                        style={{display:"flex",alignItems:"center",gap:5,padding:"4px 9px",borderRadius:20,border:`1px solid ${hidden?theme.borderMid:m.color}`,background:hidden?"transparent":m.color+"1a",color:hidden?theme.textTertiary:m.color,fontSize:11,fontWeight:500,cursor:"pointer",transition:"all .15s"}}>
                        <span style={{width:17,height:17,borderRadius:"50%",background:hidden?"transparent":m.color,border:`1.5px solid ${m.color}`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:hidden?m.color:"#fff",flexShrink:0}}>{m.initials}</span>
                        {m.name.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day-of-week header */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:2}}>
                {DOW.map(d=>(
                  <div key={d} style={{textAlign:"center",fontSize:11,fontWeight:600,color:theme.textTertiary,padding:"4px 0",textTransform:"uppercase",letterSpacing:".04em"}}>{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
                {cells.map((date,i)=>{
                  const key=date.toISOString().slice(0,10);
                  const isCurrentMonth=date.getMonth()===month;
                  const isToday=key===todayStr;
                  const dayTasks=byDate[key]||[];
                  const maxShow=isMobile?2:3;
                  return(
                    <div key={i} style={{minHeight:isMobile?62:84,background:isToday?BRAND+"0d":theme.surface,border:`0.5px solid ${isToday?BRAND:theme.border}`,borderRadius:8,padding:"5px 5px 4px",opacity:isCurrentMonth?1:0.35,overflow:"hidden",boxSizing:"border-box"}}>
                      <div style={{fontSize:11,fontWeight:isToday?700:400,color:isToday?BRAND:theme.textPrimary,marginBottom:3,lineHeight:1}}>{date.getDate()}</div>
                      {dayTasks.slice(0,maxShow).map(t=>{
                        const owners=(t.owner||"").split(",").map(s=>s.trim()).filter(Boolean);
                        const taskColor=owners.length?memberColorOf(owners[0]):t.deptColor||"#888780";
                        return(
                          <div key={t.id} onClick={()=>setOpenTask(t.id)}
                            title={t.t}
                            style={{fontSize:10,lineHeight:1.3,background:taskColor+"22",color:taskColor,borderRadius:4,padding:"2px 5px",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer",fontWeight:500}}>
                            {t.t}
                          </div>
                        );
                      })}
                      {dayTasks.length>maxShow&&(
                        <div style={{fontSize:9,color:theme.textTertiary,paddingLeft:2}}>+{dayTasks.length-maxShow} more</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* No due date section */}
              {noDueTasks.length>0&&(
                <div style={{marginTop:20}}>
                  <div style={{fontSize:11,fontWeight:600,color:theme.textTertiary,textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>No due date — {noDueTasks.length} task{noDueTasks.length!==1?"s":""}</div>
                  <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:6}}>
                    {noDueTasks.map(t=>{
                      const owners=(t.owner||"").split(",").map(s=>s.trim()).filter(Boolean);
                      const taskColor=owners.length?memberColorOf(owners[0]):t.deptColor||"#888780";
                      return(
                        <div key={t.id} onClick={()=>setOpenTask(t.id)}
                          style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:theme.surface,border:`0.5px solid ${theme.border}`,borderRadius:8,cursor:"pointer"}}
                          onMouseEnter={e=>e.currentTarget.style.background=theme.surface2}
                          onMouseLeave={e=>e.currentTarget.style.background=theme.surface}>
                          <div style={{width:6,height:6,borderRadius:"50%",background:taskColor,flexShrink:0}}/>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:12,color:theme.textPrimary,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.t}</div>
                            <div style={{fontSize:10,color:theme.textTertiary}}>{t.deptName}{owners.length?` · ${owners[0]}`:""}  </div>
                          </div>
                          <PriBadge p={t.p}/>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* RISKS */}
        {activeView==="risks"&&(
          <div>
            {[
              {title:"C39 license scope & Joey's RMO arrangement",body:"Joey must be the RMO or RME to legally operate Durus under his C39. CA has strict rules on ownership stake and day-to-day control. Robert must resolve this in Week 1.",color:"#D85A30",cat:"Critical Legal"},
              {title:"Workers compensation exposure",body:"Even with 1099 contractors, CA aggressively reclassifies workers under AB5. Get a roofing-specialized insurance broker involved before Job #1. Budget for GL + WC policy.",color:"#D85A30",cat:"Critical Legal"},
              {title:"No backup contractor",body:"Joey is the only contractor. One injury, dispute, or capacity crunch stops all revenue. Vet at least one additional roofing sub during Phase 1.",color:"#EF9F27",cat:"High Ops"},
              {title:"ServiceTitan contract terms",body:"ST requires a multi-year contract at $500-800+/mo. Jesse should negotiate carefully and ensure terms fit early-stage cash flow.",color:"#EF9F27",cat:"High Financial"},
              {title:"No defined sales process",body:"Rene is carrying sales but there is no documented lead-to-close process. Without this, leads will go cold in early weeks.",color:"#EF9F27",cat:"High Sales"},
              {title:"Cleo's deliverables are undefined",body:"Without specific monthly deliverables, the consulting engagement is hard to evaluate. Define 3-5 concrete outputs per month by end of Week 1.",color:"#BA7517",cat:"Medium PM"},
              {title:"Google LSA is fastest lead channel",body:"Local Services Ads for roofing in OC can deliver verified leads within 72 hrs. Lower CPL than Meta in this vertical. Prioritize over organic social.",color:"#639922",cat:"Opportunity"},
              {title:"Insurance adjuster relationships",body:"One strong relationship with a public adjuster in OC can generate consistent referral volume. Rene should schedule 3 intro meetings in Month 2.",color:"#639922",cat:"Opportunity"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"12px 14px",background:theme.surface,border:`0.5px solid ${theme.border}`,borderRadius:10,marginBottom:8,borderLeft:`3px solid ${r.color}`}}>
                <div>
                  <div style={{fontSize:13,fontWeight:500,color:theme.textPrimary,marginBottom:4}}>{r.title}</div>
                  <div style={{fontSize:12,color:theme.textSecondary,lineHeight:1.6,marginBottom:5}}>{r.body}</div>
                  <div style={{fontSize:10,fontWeight:600,color:r.color,textTransform:"uppercase",letterSpacing:".05em"}}>{r.cat}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile bottom tab bar */}
      {isMobile&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:theme.surface,borderTop:`0.5px solid ${theme.border}`,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom)"}}>
          {TAB_VIEWS.map((id,i)=>(
            <button key={id} onClick={()=>setActiveView(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8px 0 6px",border:"none",background:"transparent",cursor:"pointer",color:activeView===id?BRAND:theme.textTertiary,gap:3}}>
              {TAB_ICONS[id]}
              <span style={{fontSize:10,fontWeight:activeView===id?600:400}}>{TAB_LABELS[i]}</span>
            </button>
          ))}
        </div>
      )}

      {openTask&&openTaskObj&&(
        <TaskModal task={openTaskObj} deptColor={openTaskDept?.color||"#888780"} deptName={openTaskDept?.name||""} currentUser={currentUser} colorMap={{[currentUser]:effectiveColor}}
          onSave={(updated)=>saveTask(updated,openTaskObj,openTaskDept?.name)}
          onDelete={(id)=>deleteTask(id,openTaskObj?.t,openTaskDept?.name)}
          onClose={()=>setOpenTask(null)} theme={theme}/>
      )}
      {showAddTask&&(
        <AddTaskModal depts={depts} onSave={addTask} onClose={()=>setShowAddTask(false)} theme={theme} colorMap={{[currentUser]:effectiveColor}}/>
      )}
      {showProfile&&(
        <ProfileModal
          currentUser={currentUser}
          allowedUser={allowedUser}
          currentColor={effectiveColor}
          currentAvatar={effectiveAvatar}
          onSave={saveProfile}
          onClose={()=>setShowProfile(false)}
          theme={theme}/>
      )}
    </div>
  );
}
