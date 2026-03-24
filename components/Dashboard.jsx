'use client'
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const DEFAULT_DEPTS = [
  {id:"legal",name:"Legal & Entity",color:"#534AB7",tasks:[
    {id:"l1",t:"Form LLC or Corp entity",note:"CA or Delaware — Robert to advise",owner:"Robert",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l2",t:"Open business bank account",note:"Required before taking any payments",owner:"Rene / Caleb",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l3",t:"Obtain EIN from IRS",note:"Prerequisite for banking & payroll",owner:"Caleb",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l4",t:"Draft contractor agreements",note:"Master sub agreement for Joey & future subs",owner:"Robert",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l5",t:"Draft customer contract templates",note:"Scope, payment terms, warranty language",owner:"Robert",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l6",t:"Confirm C39 license / RMO arrangement",note:"Joey holds license — confirm RMO scope",owner:"Robert / Joey",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l7",t:"Obtain umbrella insurance policy",note:"Confirm coverage before first job",owner:"Robert / Jesse",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l8",t:"Research workers comp / GL requirements",note:"Required before any field work in CA",owner:"Robert / Jesse",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"l9",t:"Review terms & liability with vendors",note:"ABC Supply and other material vendors",owner:"Robert",phase:"2",p:"high",status:"open",comments:[]},
  ]},
  {id:"accounting",name:"Accounting & Finance",color:"#0F6E56",tasks:[
    {id:"a1",t:"Set up QuickBooks Online (QBO)",note:"Chart of accounts tailored to roofing",owner:"Caleb",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"a2",t:"Connect bank account to QBO",note:"",owner:"Caleb",phase:"1",p:"high",status:"open",comments:[]},
    {id:"a3",t:"Set up payroll / contractor payment process",note:"1099 vs W2 classification for Joey",owner:"Caleb / Robert",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"a4",t:"Define invoicing / payment workflow",note:"ServiceTitan to invoice to payment collection",owner:"Caleb / Jesse",phase:"2",p:"high",status:"open",comments:[]},
    {id:"a5",t:"Establish AP process for vendor payments",note:"ABC Supply, other material vendors",owner:"Caleb / Cat",phase:"2",p:"med",status:"open",comments:[]},
    {id:"a6",t:"Define financial reporting cadence",note:"Weekly P&L, cash flow review for Rene",owner:"Caleb",phase:"2",p:"med",status:"open",comments:[]},
    {id:"a7",t:"PE reporting setup",note:"Reporting structure for private equity relationship",owner:"Rene / Caleb",phase:"3",p:"med",status:"open",comments:[]},
  ]},
  {id:"ops",name:"Operations",color:"#185FA5",tasks:[
    {id:"o1",t:"Onboard Joey Ham formally",note:"Signed agreement, COI on file",owner:"Jesse / Robert",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"o2",t:"Define dispatch & scheduling workflow",note:"How jobs are assigned and confirmed with Joey",owner:"Jesse / Cat",phase:"1",p:"high",status:"open",comments:[]},
    {id:"o3",t:"Build job intake checklist",note:"Info required before dispatching",owner:"Jesse / Cat",phase:"2",p:"high",status:"open",comments:[]},
    {id:"o4",t:"Define QC/QA inspection process",note:"Who does post-install checks and what is checked",owner:"Jesse / Joey",phase:"2",p:"high",status:"open",comments:[]},
    {id:"o5",t:"Establish warranty claims process",note:"How customers request warranty work",owner:"Jesse / Cat",phase:"2",p:"med",status:"open",comments:[]},
    {id:"o6",t:"Build complaints handling SOP",note:"Escalation path and resolution timeline",owner:"Cat / Jesse",phase:"2",p:"med",status:"open",comments:[]},
    {id:"o7",t:"Source 2nd contractor backup",note:"Single-contractor dependency is top ops risk",owner:"Jesse",phase:"3",p:"high",status:"open",comments:[]},
  ]},
  {id:"salesops",name:"Sales Operations (CRM)",color:"#993C1D",tasks:[
    {id:"s1",t:"Set up ServiceTitan account",note:"Tenant, admin users, company profile",owner:"Jesse",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"s2",t:"Build quote / estimate templates in ST",note:"Roofing-specific line items and pricing",owner:"Jesse / Rene",phase:"1",p:"high",status:"open",comments:[]},
    {id:"s3",t:"Configure customer pipeline stages",note:"Lead to Quote to Approved to Scheduled to Complete",owner:"Jesse",phase:"2",p:"high",status:"open",comments:[]},
    {id:"s4",t:"Connect ST invoicing to QBO",note:"Critical for clean AR flow",owner:"Jesse / Caleb",phase:"2",p:"high",status:"open",comments:[]},
    {id:"s5",t:"Train Rene + Cat on ServiceTitan",note:"Basic job creation, quoting, dispatch",owner:"Jesse",phase:"2",p:"high",status:"open",comments:[]},
    {id:"s6",t:"Identify first 3 insurance adjuster contacts",note:"Build referral engine foundation",owner:"Rene",phase:"3",p:"med",status:"open",comments:[]},
    {id:"s7",t:"Build insurance claims workflow in ST",note:"Track claim number, adjuster, payout",owner:"Jesse",phase:"3",p:"med",status:"open",comments:[]},
  ]},
  {id:"sales",name:"Sales",color:"#639922",tasks:[
    {id:"sa1",t:"Define service offerings & pricing",note:"TPO, tile, shingle, repair — OC market rates",owner:"Rene / Joey",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"sa2",t:"Build proposal / quote template",note:"Branded PDF with scope, pricing, warranty",owner:"Lupita / Jesse",phase:"1",p:"high",status:"open",comments:[]},
    {id:"sa3",t:"Identify first 10 target leads",note:"Network, referrals, neighbors of Joey jobs",owner:"Rene",phase:"1",p:"high",status:"open",comments:[]},
    {id:"sa4",t:"Define commission / comp plan",note:"Track how sales are attributed and paid",owner:"Rene / Caleb",phase:"2",p:"med",status:"open",comments:[]},
    {id:"sa5",t:"Develop add-on upsell menu",note:"Gutters, coatings, skylight, solar-ready prep",owner:"Rene / Joey",phase:"3",p:"med",status:"open",comments:[]},
  ]},
  {id:"mktg",name:"Marketing & Brand",color:"#993556",tasks:[
    {id:"m1",t:"Register domain & set up business email",note:"@durusroofing.com — Google Workspace preferred",owner:"Jesse",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"m2",t:"Build Google Business Profile",note:"Photos, categories, service area, hours",owner:"Lupita",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"m3",t:"Develop brand kit",note:"Logo, colors, fonts, templates",owner:"Lupita",phase:"1",p:"high",status:"open",comments:[]},
    {id:"m4",t:"Launch basic website (5 pages)",note:"Home, Services, About, Reviews, Contact",owner:"Lupita / Jesse",phase:"1",p:"high",status:"open",comments:[]},
    {id:"m5",t:"Set up social accounts (IG, Facebook)",note:"Brand-consistent handles",owner:"Lupita",phase:"1",p:"high",status:"open",comments:[]},
    {id:"m6",t:"Create review solicitation process",note:"Post-job text/email asking for Google review",owner:"Cat / Lupita",phase:"2",p:"high",status:"open",comments:[]},
    {id:"m7",t:"Plan first paid campaign (Google LSA)",note:"Fastest lead ROI channel in OC roofing",owner:"Lupita / Cleo",phase:"2",p:"med",status:"open",comments:[]},
    {id:"m8",t:"Build content calendar",note:"Before/after photos, job spotlights 3x/week",owner:"Lupita",phase:"2",p:"med",status:"open",comments:[]},
    {id:"m9",t:"Develop referral/discount program",note:"Incentive for referrals and reviews",owner:"Cleo / Rene",phase:"3",p:"med",status:"open",comments:[]},
  ]},
  {id:"admin",name:"Administrative",color:"#5F5E5A",tasks:[
    {id:"ad1",t:"Confirm C39 license active & in good standing",note:"CSLB license lookup",owner:"Robert / Joey",phase:"1",p:"crit",status:"open",comments:[]},
    {id:"ad2",t:"Set up registered agent in CA",note:"Required if entity formed outside CA",owner:"Robert",phase:"1",p:"high",status:"open",comments:[]},
    {id:"ad3",t:"Secure office / virtual address in OC",note:"Required for CSLB license address",owner:"Jesse / Rene",phase:"1",p:"high",status:"open",comments:[]},
    {id:"ad4",t:"Set up team communication tool",note:"Slack or similar — all team channels",owner:"Jesse",phase:"1",p:"med",status:"open",comments:[]},
    {id:"ad5",t:"Build customer service response templates",note:"Phone, email, and text scripts",owner:"Cat",phase:"2",p:"med",status:"open",comments:[]},
  ]},
];

const PHASE_LABELS = {"1":"Week 1-2","2":"Week 3-4","3":"Month 2"};
const PRI_LABELS = {crit:"Critical",high:"High",med:"Medium"};

function uid() { return Math.random().toString(36).slice(2,10); }

function rowToTask(row) {
  return {
    id: row.id,
    t: row.title,
    note: row.note || "",
    owner: row.owner || "",
    phase: row.phase || "1",
    p: row.priority || "high",
    status: row.status || "open",
    comments: row.comments || [],
  };
}

function taskToRow(task, deptId) {
  return {
    id: task.id,
    dept_id: deptId,
    title: task.t,
    note: task.note || "",
    owner: task.owner || "",
    phase: task.phase,
    priority: task.p,
    status: task.status,
    comments: task.comments || [],
    updated_at: new Date().toISOString(),
  };
}

function PhasePill({phase}) {
  const s = {1:{background:"#E6F1FB",color:"#185FA5"},2:{background:"#FAEEDA",color:"#854F0B"},3:{background:"#EAF3DE",color:"#3B6D11"}};
  return <span style={{...s[phase],fontSize:10,fontWeight:600,borderRadius:10,padding:"2px 8px",whiteSpace:"nowrap"}}>{PHASE_LABELS[phase]}</span>;
}

function PriBadge({p}) {
  const s = {crit:{background:"#FAECE7",color:"#993C1D"},high:{background:"#FAEEDA",color:"#854F0B"},med:{background:"#EAF3DE",color:"#3B6D11"}};
  return <span style={{...s[p],fontSize:10,fontWeight:600,borderRadius:4,padding:"2px 7px",whiteSpace:"nowrap"}}>{PRI_LABELS[p]}</span>;
}

function StatusBadge({status}) {
  const m = {open:{bg:"#F1EFE8",color:"#5F5E5A",label:"Open"},"in-progress":{bg:"#E6F1FB",color:"#185FA5",label:"In progress"},blocked:{bg:"#FAECE7",color:"#993C1D",label:"Blocked"},done:{bg:"#EAF3DE",color:"#3B6D11",label:"Done"}};
  const s = m[status] || m.open;
  return <span style={{background:s.bg,color:s.color,fontSize:10,fontWeight:600,borderRadius:4,padding:"2px 7px",whiteSpace:"nowrap"}}>{s.label}</span>;
}

function TaskModal({task, deptColor, deptName, currentUser, onSave, onDelete, onClose}) {
  const [form, setForm] = useState({...task});
  const [newComment, setNewComment] = useState("");
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const addComment = () => {
    if (!newComment.trim()) return;
    const c = {id:uid(),author:currentUser||"Team",text:newComment.trim(),ts:new Date().toISOString()};
    setForm(f=>({...f,comments:[...(f.comments||[]),c]}));
    setNewComment("");
  };
  const deleteComment = (cid) => setForm(f=>({...f,comments:(f.comments||[]).filter(c=>c.id!==cid)}));
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:580,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{padding:"16px 18px 12px",borderBottom:"0.5px solid #e8e7e3",display:"flex",alignItems:"flex-start",gap:10}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:deptColor,flexShrink:0,marginTop:5}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:"#888780",marginBottom:3,textTransform:"uppercase",letterSpacing:".05em"}}>{deptName}</div>
            <input value={form.t} onChange={e=>set("t",e.target.value)} style={{width:"100%",fontSize:16,fontWeight:500,border:"none",outline:"none",background:"transparent",color:"#2c2c2a",padding:0}}/>
          </div>
          <button onClick={onClose} style={{border:"none",background:"none",fontSize:18,color:"#888780",cursor:"pointer",lineHeight:1,padding:"0 2px"}}>x</button>
        </div>
        <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[["Status","status",[["open","Open"],["in-progress","In progress"],["blocked","Blocked"],["done","Done"]]],["Priority","p",[["crit","Critical"],["high","High"],["med","Medium"]]],["Phase","phase",[["1","Week 1-2"],["2","Week 3-4"],["3","Month 2"]]]].map(([label,key,opts])=>(
              <div key={key}>
                <div style={{fontSize:10,color:"#888780",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>{label}</div>
                <select value={form[key]} onChange={e=>set(key,e.target.value)} style={{width:"100%",fontSize:12,padding:"5px 8px",border:"0.5px solid #d3d1c7",borderRadius:6,outline:"none",color:"#2c2c2a",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff"}}>
                  {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div>
            <div style={{fontSize:10,color:"#888780",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Owner</div>
            <input value={form.owner} onChange={e=>set("owner",e.target.value)} style={{width:"100%",fontSize:13,padding:"6px 10px",border:"0.5px solid #d3d1c7",borderRadius:6,outline:"none",color:"#2c2c2a",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff"
}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#888780",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Notes</div>
            <textarea value={form.note} onChange={e=>set("note",e.target.value)} rows={3} style={{width:"100%",fontSize:13,padding:"7px 10px",border:"0.5px solid #d3d1c7",borderRadius:6,resize:"vertical",outline:"none",color:"#2c2c2a",background:"#ffffff",fontFamily:"inherit"}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#888780",marginBottom:8,textTransform:"uppercase",letterSpacing:".05em"}}>Comments</div>
            {!(form.comments||[]).length && <div style={{fontSize:12,color:"#888780",marginBottom:8}}>No comments yet.</div>}
            {(form.comments||[]).map(c=>(
              <div key={c.id} style={{background:"#f5f5f3",borderRadius:8,padding:"8px 10px",marginBottom:6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <span style={{fontSize:11,fontWeight:600,color:"#2c2c2a"}}>{c.author}</span>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:10,color:"#888780"}}>{new Date(c.ts).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                    <button onClick={()=>deleteComment(c.id)} style={{border:"none",background:"none",color:"#b4b2a9",cursor:"pointer",fontSize:12,padding:0}}>x</button>
                  </div>
                </div>
                <div style={{fontSize:12,color:"#444441",lineHeight:1.5}}>{c.text}</div>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:6}}>
              <input value={newComment} onChange={e=>setNewComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),addComment())} placeholder="Add a comment..." style={{flex:1,fontSize:12,padding:"6px 10px",border:"0.5px solid #d3d1c7",borderRadius:6,outline:"none",color:"#2c2c2a",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff"}}/>
              <button onClick={addComment} style={{padding:"6px 14px",borderRadius:6,border:"0.5px solid #d3d1c7",background:"#2c2c2a",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Post</button>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:4,borderTop:"0.5px solid #e8e7e3"}}>
            <button onClick={()=>onDelete(task.id)} style={{padding:"7px 14px",borderRadius:6,border:"0.5px solid #F0997B",background:"#FAECE7",color:"#993C1D",fontSize:12,cursor:"pointer",fontWeight:500}}>Delete task</button>
            <button onClick={()=>onSave(form)} style={{padding:"7px 18px",borderRadius:6,border:"none",background:"#2c2c2a",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddTaskModal({depts, onSave, onClose}) {
  const [form, setForm] = useState({t:"",note:"",owner:"",phase:"1",p:"high",deptId:depts[0]?.id||"",status:"open",comments:[]});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const valid = form.t.trim() && form.deptId;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:520}}>
        <div style={{padding:"16px 18px 12px",borderBottom:"0.5px solid #e8e7e3",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:15,fontWeight:500,color:"#2c2c2a"}}>Add new task</span>
          <button onClick={onClose} style={{border:"none",background:"none",fontSize:18,color:"#888780",cursor:"pointer"}}>x</button>
        </div>
        <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{fontSize:10,color:"#888780",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Task name *</div>
            <input value={form.t} onChange={e=>set("t",e.target.value)} placeholder="What needs to get done?" style={{width:"100%",fontSize:13,padding:"7px 10px",border:"0.5px solid #d3d1c7",borderRadius:6,outline:"none",color:"#2c2c2a",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <div style={{fontSize:10,color:"#888780",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Department *</div>
              <select value={form.deptId} onChange={e=>set("deptId",e.target.value)} style={{width:"100%",fontSize:12,padding:"5px 8px",border:"0.5px solid #d3d1c7",borderRadius:6,outline:"none",color:"#2c2c2a",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff"}}>
                {depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:10,color:"#888780",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Owner</div>
              <input value={form.owner} onChange={e=>set("owner",e.target.value)} placeholder="Name(s)" style={{width:"100%",fontSize:12,padding:"5px 8px",border:"0.5px solid #d3d1c7",borderRadius:6,outline:"none",color:"#2c2c2a",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff"}}/>
            </div>
            <div>
              <div style={{fontSize:10,color:"#888780",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Phase</div>
              <select value={form.phase} onChange={e=>set("phase",e.target.value)} style={{width:"100%",fontSize:12,padding:"5px 8px",border:"0.5px solid #d3d1c7",borderRadius:6,outline:"none",color:"#2c2c2a",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff"}}>
                <option value="1">Week 1-2</option>
                <option value="2">Week 3-4</option>
                <option value="3">Month 2</option>
              </select>
            </div>
            <div>
              <div style={{fontSize:10,color:"#888780",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Priority</div>
              <select value={form.p} onChange={e=>set("p",e.target.value)} style={{width:"100%",fontSize:12,padding:"5px 8px",border:"0.5px solid #d3d1c7",borderRadius:6,outline:"none",color:"#2c2c2a",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff",background:"#ffffff"}}>
                <option value="crit">Critical</option>
                <option value="high">High</option>
                <option value="med">Medium</option>
              </select>
            </div>
          </div>
          <div>
            <div style={{fontSize:10,color:"#888780",marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>Notes</div>
            <textarea value={form.note} onChange={e=>set("note",e.target.value)} rows={2} placeholder="Optional context..." style={{width:"100%",fontSize:12,padding:"6px 10px",border:"0.5px solid #d3d1c7",borderRadius:6,resize:"vertical",outline:"none",color:"#2c2c2a",background:"#ffffff",fontFamily:"inherit"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:8,paddingTop:4,borderTop:"0.5px solid #e8e7e3"}}>
            <button onClick={onClose} style={{padding:"7px 16px",borderRadius:6,border:"0.5px solid #d3d1c7",background:"transparent",color:"#5f5e5a",fontSize:12,cursor:"pointer"}}>Cancel</button>
            <button onClick={()=>valid&&onSave({...form,id:uid()})} disabled={!valid} style={{padding:"7px 18px",borderRadius:6,border:"none",background:valid?"#2c2c2a":"#d3d1c7",color:"#fff",fontSize:12,cursor:valid?"pointer":"default",fontWeight:500}}>Add task</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [depts, setDepts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [filterPhase, setFilterPhase] = useState("all");
  const [filterPri, setFilterPri] = useState("all");
  const [search, setSearch] = useState("");
  const [openTask, setOpenTask] = useState(null);
  const [openDepts, setOpenDepts] = useState({});
  const [showAddTask, setShowAddTask] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [userSet, setUserSet] = useState(false);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("durus_user");
    if (saved) { setCurrentUser(saved); setUserSet(true); }
  }, []);

  function buildDepts(rows) {
    const map = {};
    DEFAULT_DEPTS.forEach(d => { map[d.id] = {...d, tasks:[]}; });
    rows.forEach(row => {
      if (map[row.dept_id]) map[row.dept_id].tasks.push(rowToTask(row));
    });
    return DEFAULT_DEPTS.map(d => map[d.id]);
  }

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from("tasks").select("*");
        if (error) throw error;
        if (data && data.length > 0) {
          setDepts(buildDepts(data));
        } else {
          setDepts(DEFAULT_DEPTS);
          const rows = DEFAULT_DEPTS.flatMap(d => d.tasks.map(t => taskToRow(t, d.id)));
          await supabase.from("tasks").insert(rows);
        }
      } catch(e) {
        console.error(e);
        setDepts(DEFAULT_DEPTS);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!depts) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await supabase.from("tasks").select("*");
        if (data) setDepts(buildDepts(data));
      } catch(e) {}
    }, 10000);
    return () => clearInterval(interval);
  }, [!!depts]);

  const persistTask = useCallback(async (task, deptId) => {
    setSaving(true);
    try {
      await supabase.from("tasks").upsert(taskToRow(task, deptId));
      setLastSaved(new Date());
    } catch(e) { console.error(e); }
    setSaving(false);
  }, []);

  const deleteTaskFromDB = useCallback(async (taskId) => {
    try { await supabase.from("tasks").delete().eq("id", taskId); } catch(e) { console.error(e); }
  }, []);

  const toggleStatus = (taskId) => {
    let changed, deptId;
    const newDepts = depts.map(d => ({...d, tasks: d.tasks.map(t => {
      if (t.id === taskId) {
        changed = {...t, status: t.status === "done" ? "open" : "done"};
        deptId = d.id;
        return changed;
      }
      return t;
    })}));
    setDepts(newDepts);
    if (changed && deptId) persistTask(changed, deptId);
  };

  const saveTask = (updated) => {
    let deptId;
    const newDepts = depts.map(d => {
      const hasIt = d.tasks.some(t => t.id === updated.id);
      if (hasIt) { deptId = d.id; return {...d, tasks: d.tasks.map(t => t.id === updated.id ? updated : t)}; }
      return d;
    });
    setDepts(newDepts);
    if (deptId) persistTask(updated, deptId);
    setOpenTask(null);
  };

  const deleteTask = (taskId) => {
    setDepts(depts.map(d => ({...d, tasks: d.tasks.filter(t => t.id !== taskId)})));
    deleteTaskFromDB(taskId);
    setOpenTask(null);
  };

  const addTask = (form) => {
    const newDepts = depts.map(d => d.id === form.deptId ? {...d, tasks:[...d.tasks, form]} : d);
    setDepts(newDepts);
    persistTask(form, form.deptId);
    setShowAddTask(false);
  };

  const allTasks = depts ? depts.flatMap(d => d.tasks.map(t => ({...t, deptColor:d.color, deptName:d.name, deptId:d.id}))) : [];
  const total = allTasks.length;
  const done = allTasks.filter(t => t.status === "done").length;
  const crit = allTasks.filter(t => t.p === "crit");
  const critDone = crit.filter(t => t.status === "done").length;
  const blocked = allTasks.filter(t => t.status === "blocked").length;
  const ph1 = allTasks.filter(t => t.phase === "1");
  const pct = total ? Math.round(done/total*100) : 0;

  const filteredTasks = allTasks.filter(t => {
    if (filterPhase !== "all" && t.phase !== filterPhase) return false;
    if (filterPri === "crit" && t.p !== "crit") return false;
    if (filterPri === "open" && t.status === "done") return false;
    if (filterPri === "blocked" && t.status !== "blocked") return false;
    if (search && !t.t.toLowerCase().includes(search.toLowerCase()) && !t.owner.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!userSet) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f5f3",padding:20}}>
        <div style={{background:"#fff",borderRadius:14,padding:"32px 28px",maxWidth:360,width:"100%",border:"0.5px solid #e8e7e3"}}>
          <div style={{fontSize:13,fontWeight:600,color:"#888780",letterSpacing:".06em",textTransform:"uppercase",marginBottom:6}}>Durus Roofing</div>
          <div style={{fontSize:20,fontWeight:500,color:"#2c2c2a",marginBottom:6}}>Welcome to the project tracker</div>
          <div style={{fontSize:13,color:"#5f5e5a",marginBottom:20,lineHeight:1.6}}>Enter your name so your teammates know who is making updates.</div>
          <div style={{fontSize:11,color:"#888780",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Your name</div>
          <input value={userInput} onChange={e=>setUserInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&userInput.trim()){localStorage.setItem("durus_user",userInput.trim());setCurrentUser(userInput.trim());setUserSet(true);}}}
            placeholder="e.g. Jesse"
            style={{width:"100%",fontSize:14,padding:"9px 12px",border:"0.5px solid #d3d1c7",borderRadius:8,outline:"none",color:"#2c2c2a",marginBottom:12}}/>
          <button onClick={()=>{if(userInput.trim()){localStorage.setItem("durus_user",userInput.trim());setCurrentUser(userInput.trim());setUserSet(true);}}}
            style={{width:"100%",padding:"10px",borderRadius:8,border:"none",background:"#2c2c2a",color:"#fff",fontSize:13,fontWeight:500,cursor:"pointer"}}>
            Enter dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading || !depts) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f5f3"}}>
        <div style={{fontSize:13,color:"#888780"}}>Loading shared dashboard...</div>
      </div>
    );
  }

  const openTaskObj = openTask ? allTasks.find(t => t.id === openTask) : null;
  const openTaskDept = openTask ? depts.find(d => d.tasks.some(t => t.id === openTask)) : null;

  const NavBtn = ({id, label}) => (
    <button onClick={()=>setActiveView(id)} style={{padding:"7px 15px",borderRadius:20,fontSize:12,fontWeight:500,border:"0.5px solid",borderColor:activeView===id?"#2c2c2a":"#d3d1c7",background:activeView===id?"#2c2c2a":"transparent",color:activeView===id?"#fff":"#5f5e5a",cursor:"pointer"}}>
      {label}
    </button>
  );

  return (
    <div style={{minHeight:"100vh",background:"#f5f5f3",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{background:"#fff",borderBottom:"0.5px solid #e8e7e3",padding:"12px 20px"}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"#888780",letterSpacing:".06em",textTransform:"uppercase"}}>Durus Roofing · OC Launch</div>
              <div style={{fontSize:13,color:"#5f5e5a",marginTop:1}}>{saving?"Saving...":lastSaved?`Saved ${lastSaved.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:"All changes sync to team"}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{background:"#e8e7e3",borderRadius:12,padding:"3px 10px",fontWeight:500,fontSize:12,color:"#2c2c2a"}}>{currentUser}</span>
              <button onClick={()=>setShowAddTask(true)} style={{padding:"7px 16px",borderRadius:8,border:"none",background:"#2c2c2a",color:"#fff",fontSize:12,fontWeight:500,cursor:"pointer"}}>+ Add task</button>
            </div>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <NavBtn id="dashboard" label="Dashboard"/>
            <NavBtn id="tasks" label="All tasks"/>
            <NavBtn id="timeline" label="Timeline"/>
            <NavBtn id="team" label="Team"/>
            <NavBtn id="risks" label="Risks"/>
          </div>
        </div>
      </div>

      <div style={{maxWidth:980,margin:"0 auto",padding:"20px 16px"}}>

        {activeView==="dashboard" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:10,marginBottom:16}}>
              {[
                {label:"Overall progress",val:`${pct}%`,sub:`${done} of ${total} tasks`},
                {label:"Critical tasks",val:`${critDone}/${crit.length}`,sub:`${crit.length-critDone} still open`},
                {label:"Phase 1 (Wk 1-2)",val:`${ph1.length?Math.round(ph1.filter(t=>t.status==="done").length/ph1.length*100):0}%`,sub:`${ph1.filter(t=>t.status==="done").length} of ${ph1.length} done`},
                {label:"Blocked",val:blocked,sub:blocked===0?"Nothing blocked":"Need attention",alert:blocked>0},
              ].map((m,i)=>(
                <div key={i} style={{background:m.alert&&blocked>0?"#FAECE7":"#fff",border:`0.5px solid ${m.alert&&blocked>0?"#F0997B":"#e8e7e3"}`,borderRadius:10,padding:"12px 14px"}}>
                  <div style={{fontSize:10,color:"#888780",marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}}>{m.label}</div>
                  <div style={{fontSize:22,fontWeight:600,color:m.alert&&blocked>0?"#993C1D":"#2c2c2a",lineHeight:1.1}}>{m.val}</div>
                  <div style={{fontSize:11,color:m.alert&&blocked>0?"#993C1D":"#5f5e5a",marginTop:3}}>{m.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"minmax(0,1.4fr) minmax(0,1fr)",gap:14,marginBottom:16}}>
              <div style={{background:"#fff",border:"0.5px solid #e8e7e3",borderRadius:12,padding:"14px 16px"}}>
                <div style={{fontSize:11,fontWeight:600,color:"#2c2c2a",marginBottom:12,textTransform:"uppercase",letterSpacing:".05em"}}>Phase progress</div>
                {[["1","Phase 1 — Legal & infrastructure","#185FA5"],["2","Phase 2 — Operations & brand","#854F0B"],["3","Phase 3 — Scale & expansion","#3B6D11"]].map(([p,label,color])=>{
                  const pts=allTasks.filter(t=>t.phase===p);
                  const d=pts.filter(t=>t.status==="done").length;
                  const pc=pts.length?Math.round(d/pts.length*100):0;
                  return (
                    <div key={p} style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{fontSize:12,fontWeight:500,color:"#2c2c2a"}}>{label}</span>
                        <span style={{fontSize:11,color:"#888780"}}>{d}/{pts.length}</span>
                      </div>
                      <div style={{height:5,background:"#f1efea",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pc}%`,background:color,borderRadius:3}}/>
                      </div>
                      <div style={{fontSize:10,color:"#888780",marginTop:2}}>{pc}% complete</div>
                    </div>
                  );
                })}
              </div>
              <div style={{background:"#fff",border:"0.5px solid #e8e7e3",borderRadius:12,padding:"14px 16px"}}>
                <div style={{fontSize:11,fontWeight:600,color:"#2c2c2a",marginBottom:12,textTransform:"uppercase",letterSpacing:".05em"}}>Open critical tasks</div>
                {crit.filter(t=>t.status!=="done").length===0
                  ? <div style={{fontSize:12,color:"#3B6D11"}}>All critical tasks complete!</div>
                  : crit.filter(t=>t.status!=="done").slice(0,6).map(t=>(
                    <div key={t.id} onClick={()=>setOpenTask(t.id)} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"0.5px solid #f1efea",cursor:"pointer"}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:"#D85A30",flexShrink:0,marginTop:5}}/>
                      <div>
                        <div style={{fontSize:12,color:"#2c2c2a",lineHeight:1.35}}>{t.t}</div>
                        <div style={{fontSize:10,color:"#888780",marginTop:1}}>{t.owner} · {t.deptName}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div style={{background:"#fff",border:"0.5px solid #e8e7e3",borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:11,fontWeight:600,color:"#2c2c2a",marginBottom:12,textTransform:"uppercase",letterSpacing:".05em"}}>Department overview</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
                {depts.map(d=>{
                  const dd=d.tasks.filter(t=>t.status==="done").length;
                  const dp=d.tasks.length?Math.round(dd/d.tasks.length*100):0;
                  const dc=d.tasks.filter(t=>t.p==="crit"&&t.status!=="done").length;
                  return (
                    <div key={d.id} onClick={()=>setActiveView("tasks")} style={{background:"#f9f9f8",borderRadius:8,padding:"10px 12px",cursor:"pointer",border:"0.5px solid #e8e7e3"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:d.color}}/>
                        <span style={{fontSize:12,fontWeight:500,color:"#2c2c2a"}}>{d.name}</span>
                      </div>
                      <div style={{height:3,background:"#e8e7e3",borderRadius:2,overflow:"hidden",marginBottom:5}}>
                        <div style={{height:"100%",width:`${dp}%`,background:d.color,borderRadius:2}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontSize:10,color:"#888780"}}>{dd}/{d.tasks.length} done</span>
                        {dc>0&&<span style={{fontSize:10,color:"#993C1D",fontWeight:600}}>{dc} critical</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeView==="tasks" && (
          <div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12,alignItems:"center"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..." style={{padding:"5px 12px",borderRadius:12,fontSize:12,border:"0.5px solid #d3d1c7",outline:"none",color:"#2c2c2a",background:"#ffffff",width:180}}/>
              {[["all","All"],["1","Wk 1-2"],["2","Wk 3-4"],["3","Month 2"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFilterPhase(v)} style={{padding:"4px 11px",borderRadius:12,fontSize:11,border:"0.5px solid",borderColor:filterPhase===v?"#2c2c2a":"#d3d1c7",background:filterPhase===v?"#f1efea":"transparent",color:filterPhase===v?"#2c2c2a":"#5f5e5a",cursor:"pointer"}}>{l}</button>
              ))}
              {[["all","All priorities"],["crit","Critical"],["open","Open"],["blocked","Blocked"]].map(([v,l])=>(
                <button key={v} onClick={()=>setFilterPri(v)} style={{padding:"4px 11px",borderRadius:12,fontSize:11,border:"0.5px solid",borderColor:filterPri===v?"#2c2c2a":"#d3d1c7",background:filterPri===v?"#f1efea":"transparent",color:filterPri===v?"#2c2c2a":"#5f5e5a",cursor:"pointer"}}>{l}</button>
              ))}
            </div>
            {depts.map(d=>{
              const tasks=filteredTasks.filter(t=>t.deptId===d.id);
              if(!tasks.length) return null;
              const isOpen=openDepts[d.id]!==false;
              return (
                <div key={d.id} style={{background:"#fff",border:"0.5px solid #e8e7e3",borderRadius:12,marginBottom:10,overflow:"hidden"}}>
                  <div onClick={()=>setOpenDepts(o=>({...o,[d.id]:!isOpen}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",cursor:"pointer",borderBottom:isOpen?"0.5px solid #e8e7e3":"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:d.color}}/>
                      <span style={{fontSize:13,fontWeight:500,color:"#2c2c2a"}}>{d.name}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:11,color:"#888780"}}>{tasks.filter(t=>t.status==="done").length}/{tasks.length}</span>
                      <span style={{fontSize:9,color:"#888780",display:"inline-block",transform:isOpen?"rotate(90deg)":"none"}}>▶</span>
                    </div>
                  </div>
                  {isOpen && (
                    <div>
                      <div style={{display:"grid",gridTemplateColumns:"20px 1fr 110px 80px 90px 80px",gap:8,padding:"5px 14px",background:"#f9f9f8",borderBottom:"0.5px solid #e8e7e3"}}>
                        {["","Task","Owner","Phase","Status","Priority"].map((h,i)=>(
                          <span key={i} style={{fontSize:10,color:"#888780",textTransform:"uppercase",letterSpacing:".05em",fontWeight:600}}>{h}</span>
                        ))}
                      </div>
                      {tasks.map(t=>(
                        <div key={t.id} style={{display:"grid",gridTemplateColumns:"20px 1fr 110px 80px 90px 80px",gap:8,alignItems:"start",padding:"8px 14px",borderBottom:"0.5px solid #f1efea",cursor:"pointer"}}
                          onClick={()=>setOpenTask(t.id)}>
                          <div onClick={e=>{e.stopPropagation();toggleStatus(t.id);}} style={{width:16,height:16,borderRadius:4,border:`1.5px solid ${t.status==="done"?"#3B6D11":"#d3d1c7"}`,background:t.status==="done"?"#3B6D11":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",marginTop:1}}>
                            {t.status==="done"&&<div style={{width:8,height:5,borderLeft:"1.5px solid #fff",borderBottom:"1.5px solid #fff",transform:"rotate(-45deg) translate(0,1px)"}}/>}
                          </div>
                          <div>
                            <div style={{fontSize:12,color:t.status==="done"?"#b4b2a9":"#2c2c2a",textDecoration:t.status==="done"?"line-through":"none",lineHeight:1.4}}>{t.t}</div>
                            {t.note&&<div style={{fontSize:11,color:"#888780",marginTop:1}}>{t.note}</div>}
                            {(t.comments||[]).length>0&&<div style={{fontSize:10,color:"#185FA5",marginTop:2}}>{t.comments.length} comment{t.comments.length>1?"s":""}</div>}
                          </div>
                          <div><span style={{fontSize:10,background:"#f1efea",color:"#5f5e5a",borderRadius:4,padding:"2px 7px"}}>{t.owner||"—"}</span></div>
                          <div><PhasePill phase={parseInt(t.phase)}/></div>
                          <div><StatusBadge status={t.status}/></div>
                          <div><PriBadge p={t.p}/></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeView==="timeline" && (
          <div style={{background:"#fff",border:"0.5px solid #e8e7e3",borderRadius:12,padding:"16px 18px",overflowX:"auto"}}>
            <div style={{fontSize:11,fontWeight:600,color:"#2c2c2a",marginBottom:14,textTransform:"uppercase",letterSpacing:".05em"}}>Launch timeline — weeks 1 through 8</div>
            <div style={{minWidth:560}}>
              <div style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:8,marginBottom:8}}>
                <div/>
                <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:2}}>
                  {["Wk 1","Wk 2","Wk 3","Wk 4","Wk 5","Wk 6","Wk 7","Wk 8"].map(w=>(
                    <div key={w} style={{fontSize:10,color:"#888780",textAlign:"center"}}>{w}</div>
                  ))}
                </div>
              </div>
              {[
                {label:"Entity + EIN",start:0,dur:7,color:"#534AB7"},
                {label:"Insurance",start:0,dur:10,color:"#534AB7"},
                {label:"C39 / RMO confirm",start:0,dur:7,color:"#993C1D"},
                {label:"Contractor agreement",start:2,dur:5,color:"#534AB7"},
                {label:"ServiceTitan setup",start:3,dur:7,color:"#993C1D"},
                {label:"QBO setup",start:3,dur:5,color:"#0F6E56"},
                {label:"Domain + email",start:5,dur:3,color:"#993556"},
                {label:"Brand kit + website",start:7,dur:10,color:"#993556"},
                {label:"Google Business Profile",start:7,dur:5,color:"#993556"},
                {label:"Joey onboarded",start:5,dur:4,color:"#185FA5"},
                {label:"Dispatch workflow",start:10,dur:5,color:"#185FA5"},
                {label:"ST pipeline config",start:14,dur:5,color:"#993C1D"},
                {label:"ST + QBO connected",start:14,dur:5,color:"#0F6E56"},
                {label:"First job dispatched",start:21,dur:3,color:"#639922"},
                {label:"Google LSA live",start:28,dur:5,color:"#993556"},
                {label:"2nd contractor",start:28,dur:10,color:"#185FA5"},
                {label:"Ins. adj. meetings",start:28,dur:14,color:"#993C1D"},
              ].map((g,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:8,alignItems:"center",padding:"3px 0",borderBottom:"0.5px solid #f1efea"}}>
                  <div style={{fontSize:11,color:"#5f5e5a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{g.label}</div>
                  <div style={{position:"relative",height:12,background:"#f1efea",borderRadius:3,overflow:"hidden"}}>
                    <div style={{position:"absolute",top:0,left:`${Math.round(g.start/56*100)}%`,width:`${Math.max(3,Math.round(g.dur/56*100))}%`,height:"100%",background:g.color,borderRadius:3,opacity:.85}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView==="team" && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
            {[
              {name:"Rene Suarez",initials:"RS",title:"CEO / Owner",color:"#534AB7",bg:"#EEEDFE",ids:["l2","sa1","sa3","sa4","sa5","s6","a7","m9"]},
              {name:"Jesse Smith",initials:"JS",title:"VP — Systems & Ops",color:"#185FA5",bg:"#E6F1FB",ids:["o2","o3","o4","o5","o7","s1","s2","s3","s4","s5","s7","m1","m4","sa2","ad3","ad4","l7","l8","o1"]},
              {name:"Robert Haugan",initials:"RH",title:"Legal Counsel",color:"#3B6D11",bg:"#EAF3DE",ids:["l1","l4","l5","l6","l7","l8","l9","a3","o1","ad1","ad2"]},
              {name:"Caleb Troy",initials:"CT",title:"Accounting",color:"#854F0B",bg:"#FAEEDA",ids:["l2","l3","a1","a2","a3","a4","a5","a6","a7","sa4"]},
              {name:"Cat Sullins",initials:"CS",title:"Ops & Brand Coord.",color:"#993C1D",bg:"#FAECE7",ids:["o2","o3","o5","o6","m6","a5","ad5"]},
              {name:"Lupita Perez",initials:"LP",title:"Brand & Marketing",color:"#993556",bg:"#FBEAF0",ids:["m2","m3","m4","m5","m6","m7","m8","sa2"]},
              {name:"Cleo Parra",initials:"CP",title:"Consultant",color:"#5F5E5A",bg:"#F1EFE8",ids:["m7","m9"]},
              {name:"Joey Ham",initials:"JH",title:"Contractor Partner",color:"#0F6E56",bg:"#E1F5EE",ids:["l6","o1","o4","sa1","sa5","ad1"]},
            ].map(p=>{
              const mt=allTasks.filter(t=>p.ids.includes(t.id));
              const dd=mt.filter(t=>t.status==="done").length;
              const cr=mt.filter(t=>t.p==="crit"&&t.status!=="done").length;
              const bl=mt.filter(t=>t.status==="blocked").length;
              const pp=mt.length?Math.round(dd/mt.length*100):0;
              return (
                <div key={p.name} style={{background:"#fff",border:"0.5px solid #e8e7e3",borderRadius:12,padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:p.bg,color:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0}}>{p.initials}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:500,color:"#2c2c2a"}}>{p.name}</div>
                      <div style={{fontSize:11,color:"#888780"}}>{p.title}</div>
                    </div>
                  </div>
                  <div style={{height:4,background:"#f1efea",borderRadius:2,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:`${pp}%`,background:p.color,borderRadius:2}}/>
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"#f1efea",color:"#5f5e5a"}}>{dd}/{mt.length} done</span>
                    {cr>0&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"#FAECE7",color:"#993C1D",fontWeight:600}}>{cr} critical open</span>}
                    {bl>0&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"#FAEEDA",color:"#854F0B",fontWeight:600}}>{bl} blocked</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeView==="risks" && (
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
              <div key={i} style={{display:"flex",gap:12,padding:"12px 14px",background:"#fff",border:"0.5px solid #e8e7e3",borderRadius:10,marginBottom:8,borderLeft:`3px solid ${r.color}`}}>
                <div>
                  <div style={{fontSize:13,fontWeight:500,color:"#2c2c2a",marginBottom:4}}>{r.title}</div>
                  <div style={{fontSize:12,color:"#5f5e5a",lineHeight:1.6,marginBottom:5}}>{r.body}</div>
                  <div style={{fontSize:10,fontWeight:600,color:r.color,textTransform:"uppercase",letterSpacing:".05em"}}>{r.cat}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {openTask && openTaskObj && (
        <TaskModal task={openTaskObj} deptColor={openTaskDept?.color||"#888780"} deptName={openTaskDept?.name||""} currentUser={currentUser} onSave={saveTask} onDelete={deleteTask} onClose={()=>setOpenTask(null)}/>
      )}
      {showAddTask && (
        <AddTaskModal depts={depts} onSave={addTask} onClose={()=>setShowAddTask(false)}/>
      )}
    </div>
  );
}
