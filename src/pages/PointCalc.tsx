import { useState, useRef } from "react";

const DEFAULT_RULES = [
  { from: 1,  to: 1,  points: 15 },
  { from: 2,  to: 2,  points: 12 },
  { from: 3,  to: 3,  points: 10 },
  { from: 4,  to: 4,  points: 8  },
  { from: 5,  to: 5,  points: 6  },
  { from: 6,  to: 10, points: 4  },
  { from: 11, to: 15, points: 2  },
  { from: 16, to: 20, points: 0  },
];

function getPP(pos, rules) {
  const r = rules.find(r => pos >= r.from && pos <= r.to);
  return r ? r.points : 0;
}

function calcTotal(kills, pos, kpp, rules) {
  return kills * kpp + getPP(pos, rules);
}

// Compute leaderboard for a given set of results
function computeLB(results, kpp, rules) {
  const map = {};
  results.forEach(r => {
    if (!map[r.team]) map[r.team] = {
      team: r.team, logo: r.logo || null,
      matches: 0, kills: 0, wins: 0,
      pp: 0, kp: 0, total: 0, inc: 0,
    };
    const pp = getPP(r.position, rules);
    const kp = r.kills * kpp;
    map[r.team].matches += 1;
    map[r.team].kills   += r.kills;
    map[r.team].wins    += r.position === 1 ? 1 : 0;
    map[r.team].pp      += pp;
    map[r.team].kp      += kp;
    map[r.team].total   += pp + kp;
    map[r.team].inc      = pp + kp;
  });
  return Object.values(map).sort((a,b) =>
    b.total !== a.total ? b.total - a.total :
    b.kills !== a.kills ? b.kills - a.kills : b.wins - a.wins
  );
}

export default function PointCalc() {
  const [tab, setTab]         = useState("overall");
  const [results, setResults] = useState([]);
  const [kpp, setKpp]         = useState(1);
  const [rules, setRules]     = useState(DEFAULT_RULES);
  const [form, setForm]       = useState({ team:"", match:"", position:"", kills:"", logo:"" });
  const [editId, setEditId]   = useState(null);
  const [toast, setToast]     = useState(null);
  const [tournamentName, setTournamentName] = useState("NEXUS DAILY COMBAT");
  const [igHandle, setIgHandle] = useState("espire_12");
  const [ytHandle, setYtHandle] = useState("espire");
  const [totalSlots, setTotalSlots] = useState(12);
  const nextId = useRef(1);

  // All unique match IDs sorted
  const matchIds = [...new Set(results.map(r => r.match))].sort();
  const overall  = computeLB(results, kpp, rules);

  function showToast(msg, type="success") {
    setToast({msg,type});
    setTimeout(()=>setToast(null), 2400);
  }

  function handleSubmit() {
    if (!form.team || !form.match || !form.position || form.kills==="") {
      showToast("Fill all required fields","error"); return;
    }
    const pos   = parseInt(form.position);
    const kills = parseInt(form.kills);
    if (pos<1||pos>20||kills<0) { showToast("Invalid values","error"); return; }
    if (editId!==null) {
      setResults(rs=>rs.map(x=>x.id===editId?{...x,team:form.team,match:form.match,position:pos,kills,logo:form.logo}:x));
      setEditId(null); showToast("Updated ✓");
    } else {
      setResults(rs=>[...rs,{id:nextId.current++,team:form.team.toUpperCase(),match:form.match.toUpperCase(),position:pos,kills,logo:form.logo}]);
      showToast("Result added ✓");
    }
    setForm({team:"",match:"",position:"",kills:"",logo:""});
    setTimeout(()=>setTab("overall"),400);
  }

  function handleEdit(r) {
    setEditId(r.id);
    setForm({team:r.team,match:r.match,position:String(r.position),kills:String(r.kills),logo:r.logo||""});
    setTab("admin");
  }

  function handleDelete(id) {
    setResults(rs=>rs.filter(x=>x.id!==id));
    showToast("Deleted","error");
  }

  function handleReset() {
    if (confirm("Reset ALL data?")) { setResults([]); nextId.current=1; showToast("Reset done"); }
  }

  function exportSummary() {
    const lines = [`=== ${tournamentName} ===`,`Generated: ${new Date().toLocaleString()}`,"","=== OVERALL ===",
      "RANK | TEAM         | KILLS | WINS | PP  | TOTAL",
      ...overall.map((t,i)=>`#${String(i+1).padEnd(3)}| ${t.team.padEnd(12)} | ${String(t.kills).padEnd(5)} | ${String(t.wins).padEnd(4)} | ${String(t.pp).padEnd(3)} | ${t.total}`),
    ];
    matchIds.forEach(mid => {
      const lb = computeLB(results.filter(r=>r.match===mid),kpp,rules);
      lines.push("",`=== ${mid} ===`,"RANK | TEAM         | KILLS | PP | TOTAL",
        ...lb.map((t,i)=>`#${String(i+1).padEnd(3)}| ${t.team.padEnd(12)} | ${String(t.kills).padEnd(5)} | ${String(t.pp).padEnd(2)} | ${t.total}`)
      );
    });
    const blob = new Blob([lines.join("\n")],{type:"text/plain"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download=`${tournamentName.replace(/ /g,"_")}.txt`; a.click();
    showToast("Exported ✓");
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700;1,900&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

    .pc{font-family:'Barlow Condensed',sans-serif;background:#050c16;min-height:100vh;color:#fff;}

    /* BG */
    .pc-bgl{position:fixed;left:0;top:0;bottom:0;width:48px;background:linear-gradient(170deg,#0088cc18,transparent 60%);clip-path:polygon(0 0,75% 0,55% 100%,0 100%);pointer-events:none;z-index:0;}
    .pc-bgr{position:fixed;right:0;top:0;bottom:0;width:48px;background:linear-gradient(190deg,#0088cc18,transparent 60%);clip-path:polygon(25% 0,100% 0,100% 100%,45% 100%);pointer-events:none;z-index:0;}
    .pc-in{position:relative;z-index:1;}

    /* HEADER */
    .pc-hdr{background:linear-gradient(180deg,#091528,#050c16);border-bottom:2px solid #1a8fc1;padding:12px 14px 8px;position:relative;}
    .pc-hdr-row{display:flex;align-items:center;gap:10px;}
    .pc-logo{width:54px;height:54px;flex-shrink:0;}
    .pc-hdr-main{font-size:clamp(18px,5.5vw,26px);font-weight:900;font-style:italic;letter-spacing:2px;color:#00d4ff;text-shadow:0 0 18px #00d4ffaa;text-transform:uppercase;line-height:1;}
    .pc-hdr-sub{font-size:clamp(11px,3vw,15px);font-weight:800;letter-spacing:5px;color:#fff;text-transform:uppercase;font-style:italic;margin-top:1px;}
    .pc-ff{position:absolute;top:8px;right:10px;text-align:center;}
    .pc-ff-f{font-size:10px;font-weight:900;color:#ff6600;text-shadow:0 0 8px #ff660088;}
    .pc-ff-m{font-size:8px;font-weight:800;color:#ffaa44;background:#ff660022;padding:1px 5px;border-radius:2px;border:1px solid #ff660055;letter-spacing:2px;}
    .pc-tid{font-size:9px;letter-spacing:2px;color:#1a4a6a;text-align:center;padding:3px;font-weight:700;}

    /* STATS */
    .pc-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:7px 10px;background:#070f1c;border-bottom:1px solid #1a3a55;}
    .pc-stat{background:#0b2236;border-radius:3px;padding:6px 8px;text-align:center;}
    .pc-slbl{font-size:8px;letter-spacing:2px;color:#3a6a8a;text-transform:uppercase;font-weight:800;}
    .pc-sval{font-size:18px;font-weight:900;color:#00d4ff;line-height:1;margin-top:1px;}
    .pc-sval.r{color:#ff5555;}.pc-sval.g{color:#33ff88;}.pc-sval.y{color:#ffd700;}

    /* NAV */
    .pc-nav{display:flex;background:#070f1c;border-bottom:2px solid #112233;overflow-x:auto;}
    .pc-tab{flex-shrink:0;padding:9px 12px;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#3a6a8a;background:none;border:none;cursor:pointer;border-bottom:3px solid transparent;transition:all .2s;white-space:nowrap;}
    .pc-tab.on{color:#00d4ff;border-bottom-color:#00d4ff;background:linear-gradient(180deg,#00d4ff0a,transparent);}
    .pc-tab.match-tab{color:#ffaa44;}
    .pc-tab.match-tab.on{color:#ffaa44;border-bottom-color:#ffaa44;}

    /* TABLE */
    .pc-tbl{background:#050c16;}
    .pc-thead{display:grid;grid-template-columns:46px 1fr 50px 50px 50px 58px 50px;background:#070f1c;border-bottom:2px solid #1a8fc1;padding:7px 10px;gap:3px;}
    .pc-th{font-size:10px;font-weight:800;letter-spacing:1.5px;color:#3a8ab4;text-transform:uppercase;text-align:center;}
    .pc-th:nth-child(2){text-align:left;padding-left:4px;}
    /* Match table has fewer cols */
    .pc-thead-m{display:grid;grid-template-columns:46px 1fr 50px 50px 58px 50px;background:#070f1c;border-bottom:2px solid #ffaa4444;padding:7px 10px;gap:3px;}
    .pc-th-m{font-size:10px;font-weight:800;letter-spacing:1.5px;color:#cc8833;text-transform:uppercase;text-align:center;}
    .pc-th-m:nth-child(2){text-align:left;padding-left:4px;}

    .pc-row{display:grid;grid-template-columns:46px 1fr 50px 50px 50px 58px 50px;padding:3px 10px;gap:3px;border-bottom:1px solid #0a1826;min-height:48px;align-items:center;transition:background .15s;}
    .pc-row:hover{background:#0a1828;}
    .pc-row.r1{background:linear-gradient(90deg,#122010,#050c16 70%);border-left:3px solid #ffd700;}
    .pc-row.r2{background:linear-gradient(90deg,#141820,#050c16 70%);border-left:3px solid #aaa;}
    .pc-row.r3{background:linear-gradient(90deg,#181208,#050c16 70%);border-left:3px solid #cd7f32;}
    /* Match row has fewer cols */
    .pc-row-m{display:grid;grid-template-columns:46px 1fr 50px 50px 58px 50px;padding:3px 10px;gap:3px;border-bottom:1px solid #0a1826;min-height:48px;align-items:center;transition:background .15s;}
    .pc-row-m:hover{background:#0a1828;}
    .pc-row-m.r1{background:linear-gradient(90deg,#122010,#050c16 70%);border-left:3px solid #ffd700;}
    .pc-row-m.r2{background:linear-gradient(90deg,#141820,#050c16 70%);border-left:3px solid #aaa;}
    .pc-row-m.r3{background:linear-gradient(90deg,#181208,#050c16 70%);border-left:3px solid #cd7f32;}

    .pc-rnum{font-size:20px;font-weight:900;font-style:italic;text-align:center;color:#1a4a6a;letter-spacing:-1px;}
    .pc-rnum.g{color:#ffd700;text-shadow:0 0 10px #ffd70055;}
    .pc-rnum.s{color:#aaa;}.pc-rnum.b{color:#cd7f32;}

    .pc-nw{display:flex;align-items:center;gap:5px;}
    .pc-logo-ph{width:24px;height:24px;border-radius:3px;background:#0e2a40;border:1px solid #1a4a6a;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:#1a5a7a;flex-shrink:0;}
    .pc-team-img{width:24px;height:24px;border-radius:3px;object-fit:cover;flex-shrink:0;border:1px solid #1a4a6a;}
    .pc-nbar{flex:1;background:linear-gradient(90deg,#fff,#cce0f8 40%,#a0c4e0);height:32px;border-radius:3px;display:flex;align-items:center;padding:0 8px;font-size:13px;font-weight:900;color:#0a1020;letter-spacing:1px;text-transform:uppercase;overflow:hidden;position:relative;}
    .pc-nbar::after{content:'';position:absolute;right:0;top:0;bottom:0;width:30%;background:linear-gradient(90deg,transparent,rgba(80,140,200,0.3));}

    .pc-cw{background:linear-gradient(180deg,#c4dcf4,#96bcd8);height:32px;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:900;color:#0a1828;}
    .pc-cb{background:#0b2236;height:32px;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#99ccee;}
    .pc-ct{background:#0b2236;height:32px;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:900;color:#00d4ff;text-shadow:0 0 8px #00d4ff55;}
    .pc-ci{background:#0b2236;height:32px;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#33ff88;}
    .pc-cy{background:#0b2236;height:32px;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:900;color:#ffaa44;text-shadow:0 0 8px #ffaa4455;}

    /* Empty rows */
    .pc-erow{display:grid;grid-template-columns:46px 1fr 50px 50px 50px 58px 50px;padding:3px 10px;gap:3px;border-bottom:1px solid #081420;min-height:48px;align-items:center;}
    .pc-erow-m{display:grid;grid-template-columns:46px 1fr 50px 50px 58px 50px;padding:3px 10px;gap:3px;border-bottom:1px solid #081420;min-height:48px;align-items:center;}
    .pc-enum{font-size:20px;font-weight:900;font-style:italic;text-align:center;color:#0e2030;}
    .pc-ename{background:linear-gradient(90deg,#b8d0e8,#88b0cc);height:32px;border-radius:3px;opacity:.18;}
    .pc-ecell{background:#0b2236;height:32px;border-radius:3px;opacity:.15;}

    /* match section header */
    .pc-match-hdr{display:flex;align-items:center;gap:10px;padding:8px 12px;background:#0a1420;border-bottom:1px solid #ffaa4433;}
    .pc-match-title{font-size:13px;font-weight:900;letter-spacing:3px;color:#ffaa44;text-transform:uppercase;}
    .pc-match-line{flex:1;height:1px;background:linear-gradient(90deg,#ffaa4444,transparent);}
    .pc-match-count{font-size:11px;font-weight:700;color:#3a6a8a;letter-spacing:1px;}

    /* FOOTER */
    .pc-footer{background:#040b14;border-top:2px solid #1a3a55;padding:9px 14px;display:flex;align-items:center;justify-content:space-between;}
    .pc-social{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:700;letter-spacing:1px;color:#cce4ff;}
    .pc-ig{width:24px;height:24px;border-radius:5px;background:linear-gradient(135deg,#f09433,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .pc-yt{width:24px;height:24px;border-radius:4px;background:#ff0000;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

    /* ADMIN */
    .pc-admin{padding:14px;}
    .pc-sec-title{font-size:10px;font-weight:800;letter-spacing:3px;color:#3a8ab4;text-transform:uppercase;border-left:3px solid #00d4ff;padding-left:8px;margin-bottom:12px;}
    .pc-sec-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
    .pc-fg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;}
    .pc-f{display:flex;flex-direction:column;gap:4px;}
    .pc-f label{font-size:9px;letter-spacing:2px;color:#3a8ab4;text-transform:uppercase;font-weight:800;}
    .pc-f input{background:#070f1c;border:1px solid #1a3a55;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;padding:9px 11px;border-radius:3px;outline:none;transition:border-color .2s;}
    .pc-f input:focus{border-color:#00d4ff;box-shadow:0 0 0 2px #00d4ff18;}
    .pc-prev{background:#070f1c;border:1px solid #1a3a55;border-radius:3px;padding:9px 12px;font-size:13px;color:#3a8ab4;letter-spacing:1px;margin-bottom:10px;}
    .btn-add{background:linear-gradient(135deg,#0077aa,#004477);color:#fff;border:1px solid #00aad455;padding:10px 20px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;border-radius:3px;cursor:pointer;}
    .btn-cancel{background:#0a1525;color:#3a8ab4;border:1px solid #1a3a55;padding:10px 14px;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:3px;cursor:pointer;}
    .btn-danger{background:#140606;color:#ff5555;border:1px solid #ff333322;padding:7px 13px;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:3px;cursor:pointer;}
    .btn-ghost{background:#0a1525;color:#3a8ab4;border:1px solid #1a3a55;padding:5px 9px;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;border-radius:3px;cursor:pointer;}
    .btn-export{background:#0a1525;color:#00d4ff;border:1px solid #00d4ff33;padding:7px 13px;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:3px;cursor:pointer;}
    .pc-log-row{display:flex;align-items:center;gap:7px;background:#070f1c;border:1px solid #1a3a55;border-radius:3px;padding:7px 10px;margin-bottom:5px;}
    .log-m{background:#0b2236;color:#00d4ff;padding:2px 7px;border-radius:2px;font-size:11px;font-weight:700;letter-spacing:1px;}
    .log-t{flex:1;font-size:13px;font-weight:800;letter-spacing:1px;color:#cce4ff;}
    .log-p{background:#0b2236;color:#3a8ab4;padding:2px 7px;border-radius:2px;font-size:11px;}
    .log-k{color:#ff6655;font-size:13px;font-weight:700;}
    .log-pts{color:#00d4ff;font-weight:900;font-size:15px;min-width:28px;text-align:right;}

    /* RULES */
    .pc-rules{padding:14px;}
    .pc-rg{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px;}
    .pc-ri{display:flex;align-items:center;gap:7px;background:#070f1c;border:1px solid #1a3a55;border-radius:3px;padding:7px 10px;}
    .pc-rl{font-size:11px;color:#3a8ab4;letter-spacing:1px;flex:1;font-weight:700;}
    .pc-ri input{width:52px;background:#050c16;border:1px solid #1a3a55;color:#00d4ff;font-family:'Barlow Condensed';font-size:15px;font-weight:700;padding:4px 7px;border-radius:2px;text-align:center;outline:none;}

    /* TOAST */
    .pc-toast{position:fixed;bottom:80px;right:14px;padding:10px 16px;border-radius:3px;font-family:'Barlow Condensed';font-weight:700;font-size:14px;letter-spacing:1px;z-index:9999;animation:tin .2s ease;}
    .pc-toast.success{background:#001a0e;border:1px solid #00ff8866;color:#00ff88;}
    .pc-toast.error{background:#1a0000;border:1px solid #ff444466;color:#ff5555;}
    @keyframes tin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

    .pc-divider{height:1px;background:#1a3a55;margin:12px 0;}
    .pc-empty{text-align:center;padding:18px;color:#1a3a55;font-size:11px;letter-spacing:2px;font-weight:800;}
    .pc-tool-row{display:flex;justify-content:flex-end;padding:6px 10px;gap:6px;}
  `;

  // ── RENDER TABLE (overall or per-match) ──────────────────────────────────
  function renderTable(lb, isMatch=false) {
    const slots = isMatch ? lb.length : totalSlots;
    const empty = Math.max(0, slots - lb.length);
    const thead = isMatch ? "pc-thead-m" : "pc-thead";
    const thCls  = isMatch ? "pc-th-m" : "pc-th";
    const rowCls = isMatch ? "pc-row-m" : "pc-row";
    const erowCls= isMatch ? "pc-erow-m" : "pc-erow";

    return (
      <div className="pc-tbl">
        {/* Header */}
        <div className={thead}>
          <div className={thCls}>#</div>
          <div className={thCls} style={{textAlign:"left",paddingLeft:4}}>TEAM NAME</div>
          <div className={thCls}>KILLS</div>
          {!isMatch && <div className={thCls}>WINS</div>}
          <div className={thCls}>PP</div>
          <div className={thCls}>TOTAL</div>
          <div className={thCls}>INC.</div>
        </div>

        {/* Data rows */}
        {lb.map((t,i) => (
          <div key={t.team} className={`${rowCls} ${i===0?"r1":i===1?"r2":i===2?"r3":""}`}>
            <div className={`pc-rnum ${i===0?"g":i===1?"s":i===2?"b":""}`}>
              {String(i+1).padStart(2,"0")}
            </div>
            <div className="pc-nw">
              {t.logo
                ? <img className="pc-team-img" src={t.logo} alt="" onError={e=>e.target.style.display="none"}/>
                : <div className="pc-logo-ph">{t.team.slice(0,2)}</div>
              }
              <div className="pc-nbar">{t.team}</div>
            </div>
            <div className="pc-cw">{t.kills}</div>
            {!isMatch && <div className="pc-cb">{t.wins}</div>}
            <div className="pc-cw">{t.pp}</div>
            <div className={isMatch?"pc-cy":"pc-ct"}>{t.total}</div>
            <div className="pc-ci">+{t.inc}</div>
          </div>
        ))}

        {/* Empty rows */}
        {Array.from({length:empty}).map((_,i) => (
          <div key={`e${i}`} className={erowCls}>
            <div className="pc-enum">{String(lb.length+i+1).padStart(2,"0")}</div>
            <div><div className="pc-ename"/></div>
            <div className="pc-ecell"/>
            {!isMatch && <div className="pc-ecell"/>}
            <div className="pc-ecell"/>
            <div className="pc-ecell"/>
            <div className="pc-ecell"/>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="pc">
        <div className="pc-bgl"/><div className="pc-bgr"/>
        <div className="pc-in">

          {/* HEADER */}
          <div className="pc-hdr">
            <div className="pc-ff">
              <div className="pc-ff-f">🔥 FREE FIRE</div>
              <div className="pc-ff-m">M A X</div>
            </div>
            <div className="pc-hdr-row">
              <svg className="pc-logo" viewBox="0 0 80 80" fill="none">
                <defs>
                  <linearGradient id="dg1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0d2a4e"/><stop offset="100%" stopColor="#060c18"/>
                  </linearGradient>
                  <linearGradient id="dg2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a4a7a"/><stop offset="100%" stopColor="#0d2040"/>
                  </linearGradient>
                </defs>
                <polygon points="40,4 76,40 40,76 4,40" fill="url(#dg1)" stroke="#00d4ff" strokeWidth="1.5"/>
                <polygon points="40,14 66,40 40,66 14,40" fill="url(#dg2)" stroke="#00aaff" strokeWidth="1.5"/>
                <polygon points="40,26 54,40 40,54 26,40" fill="#1a4a7a" stroke="#00d4ff" strokeWidth="1"/>
                <line x1="4" y1="40" x2="76" y2="40" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3"/>
                <line x1="40" y1="4" x2="40" y2="76" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3"/>
                <text x="40" y="45" textAnchor="middle" fill="#00d4ff" fontSize="14" fontWeight="900" fontFamily="Barlow Condensed">M</text>
              </svg>
              <div>
                <div className="pc-hdr-main">{tournamentName}</div>
                <div className="pc-hdr-sub">OVERALL STANDINGS</div>
              </div>
            </div>
            <div className="pc-tid">{new Date().toLocaleDateString()}</div>
          </div>

          {/* STATS */}
          <div className="pc-stats">
            <div className="pc-stat"><div className="pc-slbl">Teams</div><div className="pc-sval">{overall.length}</div></div>
            <div className="pc-stat"><div className="pc-slbl">Matches</div><div className="pc-sval y">{matchIds.length}</div></div>
            <div className="pc-stat"><div className="pc-slbl">Kills</div><div className="pc-sval r">{results.reduce((s,r)=>s+r.kills,0)}</div></div>
            <div className="pc-stat"><div className="pc-slbl">Leader</div><div className="pc-sval g">{overall[0]?.total??0}</div></div>
          </div>

          {/* NAV — Overall + per-match tabs */}
          <div className="pc-nav">
            <button className={`pc-tab${tab==="overall"?" on":""}`} onClick={()=>setTab("overall")}>
              🏆 Overall
            </button>
            {matchIds.map(mid => (
              <button key={mid} className={`pc-tab match-tab${tab===mid?" on":""}`} onClick={()=>setTab(mid)}>
                {mid}
              </button>
            ))}
            <button className={`pc-tab${tab==="admin"?" on":""}`} onClick={()=>setTab("admin")}>
              ➕ Add
            </button>
            <button className={`pc-tab${tab==="rules"?" on":""}`} onClick={()=>setTab("rules")}>
              ⚙️ Rules
            </button>
          </div>

          {/* OVERALL TAB */}
          {tab === "overall" && (
            <>
              <div className="pc-tool-row">
                <button className="btn-export" onClick={exportSummary}>⬇ Export</button>
              </div>
              {overall.length === 0
                ? <div className="pc-empty">NO DATA — ADD MATCH RESULTS</div>
                : renderTable(overall, false)
              }
            </>
          )}

          {/* PER-MATCH TABS */}
          {matchIds.map(mid => tab === mid && (
            <div key={mid}>
              <div className="pc-match-hdr">
                <span className="pc-match-title">{mid}</span>
                <div className="pc-match-line"/>
                <span className="pc-match-count">
                  {results.filter(r=>r.match===mid).length} teams
                </span>
              </div>
              {renderTable(computeLB(results.filter(r=>r.match===mid), kpp, rules), true)}
            </div>
          ))}

          {/* ADMIN TAB */}
          {tab === "admin" && (
            <div className="pc-admin">
              <div className="pc-sec-row">
                <div className="pc-sec-title">{editId!==null?"Edit Result":"Add Match Result"}</div>
                {editId!==null && (
                  <button className="btn-cancel" onClick={()=>{setEditId(null);setForm({team:"",match:"",position:"",kills:"",logo:""});}}>Cancel</button>
                )}
              </div>

              <div className="pc-fg">
                <div className="pc-f" style={{gridColumn:"1/-1"}}>
                  <label>Team Name *</label>
                  <input placeholder="e.g. NOVA BLAZE" value={form.team}
                    onChange={e=>setForm(f=>({...f,team:e.target.value.toUpperCase()}))} />
                </div>
                <div className="pc-f">
                  <label>Match ID *</label>
                  <input placeholder="e.g. M1" value={form.match}
                    onChange={e=>setForm(f=>({...f,match:e.target.value.toUpperCase()}))} />
                </div>
                <div className="pc-f">
                  <label>Placement (1–20) *</label>
                  <input type="number" min="1" max="20" placeholder="1" value={form.position}
                    onChange={e=>setForm(f=>({...f,position:e.target.value}))} />
                </div>
                <div className="pc-f">
                  <label>Kills *</label>
                  <input type="number" min="0" placeholder="0" value={form.kills}
                    onChange={e=>setForm(f=>({...f,kills:e.target.value}))} />
                </div>
                <div className="pc-f">
                  <label>Logo URL (optional)</label>
                  <input placeholder="https://..." value={form.logo}
                    onChange={e=>setForm(f=>({...f,logo:e.target.value}))} />
                </div>
              </div>

              {form.position && form.kills!=="" && (
                <div className="pc-prev">
                  PP <span style={{color:"#aaddff"}}>{getPP(parseInt(form.position)||0,rules)}</span>
                  {" + "} KP <span style={{color:"#aaddff"}}>{(parseInt(form.kills)||0)*kpp}</span>
                  {" = "} <span style={{color:"#00d4ff",fontWeight:900,fontSize:16}}>{calcTotal(parseInt(form.kills)||0,parseInt(form.position)||0,kpp,rules)} pts</span>
                </div>
              )}

              <div style={{display:"flex",gap:8,marginBottom:16}}>
                <button className="btn-add" onClick={handleSubmit}>
                  {editId!==null?"UPDATE":"ADD RESULT"}
                </button>
              </div>

              <div className="pc-sec-row">
                <div className="pc-sec-title">Match Log ({results.length})</div>
                <button className="btn-danger" onClick={handleReset}>Reset All</button>
              </div>

              {results.length===0
                ? <div className="pc-empty">NO RESULTS YET</div>
                : [...results].reverse().map(r=>(
                  <div key={r.id} className="pc-log-row">
                    <span className="log-m">{r.match}</span>
                    <span className="log-t">{r.team}</span>
                    <span className="log-p">#{r.position}</span>
                    <span className="log-k">💀{r.kills}</span>
                    <span className="log-pts">{calcTotal(r.kills,r.position,kpp,rules)}</span>
                    <div style={{display:"flex",gap:4}}>
                      <button className="btn-ghost" onClick={()=>handleEdit(r)}>✏️</button>
                      <button className="btn-danger" style={{padding:"4px 8px",fontSize:11}} onClick={()=>handleDelete(r.id)}>🗑️</button>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {/* RULES TAB */}
          {tab === "rules" && (
            <div className="pc-rules">
              <div className="pc-sec-title">Tournament Settings</div>
              <div className="pc-fg" style={{marginTop:12}}>
                <div className="pc-f" style={{gridColumn:"1/-1"}}>
                  <label>Tournament Name</label>
                  <input value={tournamentName} onChange={e=>setTournamentName(e.target.value)}/>
                </div>
                <div className="pc-f">
                  <label>Instagram Handle</label>
                  <input value={igHandle} onChange={e=>setIgHandle(e.target.value)} placeholder="espire_12"/>
                </div>
                <div className="pc-f">
                  <label>YouTube Handle</label>
                  <input value={ytHandle} onChange={e=>setYtHandle(e.target.value)} placeholder="espire"/>
                </div>
                <div className="pc-f">
                  <label>Team Slots</label>
                  <input type="number" min="4" max="20" value={totalSlots}
                    onChange={e=>setTotalSlots(Math.max(4,parseInt(e.target.value)||12))}/>
                </div>
                <div className="pc-f">
                  <label>Points Per Kill</label>
                  <input type="number" min="1" max="5" value={kpp}
                    onChange={e=>setKpp(Math.max(1,parseInt(e.target.value)||1))}/>
                </div>
              </div>
              <div className="pc-divider"/>
              <div style={{fontSize:10,letterSpacing:2,color:"#3a8ab4",fontWeight:800,marginBottom:10}}>PLACEMENT POINTS</div>
              <div className="pc-rg">
                {rules.map((rule,i)=>(
                  <div key={i} className="pc-ri">
                    <div className="pc-rl">{rule.from===rule.to?`#${rule.from}`:`#${rule.from}–${rule.to}`}</div>
                    <input type="number" min="0" value={rule.points}
                      onChange={e=>setRules(rs=>rs.map((r,j)=>j===i?{...r,points:parseInt(e.target.value)||0}:r))}/>
                    <span style={{fontSize:10,color:"#3a8ab4",fontWeight:700}}>pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="pc-footer">
            <div className="pc-social">
              <div className="pc-ig">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
                </svg>
              </div>
              @{igHandle}
            </div>
            <div className="pc-social">
              <div className="pc-yt">
                <svg width="13" height="10" viewBox="0 0 20 14" fill="white">
                  <polygon points="6,0 6,14 18,7"/>
                </svg>
              </div>
              {ytHandle}
            </div>
          </div>

        </div>
        {toast && <div className={`pc-toast ${toast.type}`}>{toast.msg}</div>}
      </div>
    </>
  );
}
