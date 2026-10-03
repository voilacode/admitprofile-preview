const VW = 1920, VH = 1080;
const C = { bg: '#F6F4FF', ink: '#16123A', mute: '#6E6A8A', pri: '#5B3DF5', lav: '#E6E1FF', yel: '#FFC53D', pink: '#FF9EBB', blue: '#7CC8FF', mint: '#7BE0B5', orange: '#FFB067', green: '#0E8A5F', greenBg: '#DDF7EA', line: '#E7E3F5', teal: '#0F4C5C', red: '#E8336D' };
const HF = "'Bricolage Grotesque', sans-serif", BF = "'DM Sans', sans-serif";
const WX = 840, WY = 140, WW = 960, WH = 800;

function useMotion() {
  const { T, CUES, authoredTotal } = useComposition();
  const p = (s, d) => clamp((T - s) / d, 0, 1);
  const M = {
    enter: (s, d = 0.6) => Easing.easeOutCubic(p(s, d)),
    pop: (s, d = 0.5) => Easing.easeOutBack(p(s, d)),
    glide: (s, d = 0.8) => Easing.easeInOutCubic(p(s, d)),
  };
  const vis = (a, b, din = 0.5, dout = 0.35) => M.enter(a, din) * (1 - M.enter(b - dout, dout));
  return { T, CUES, END: authoredTotal, M, vis, lin: p };
}
const fmt = (n) => Math.round(n).toLocaleString('en-US');

function Wordmark({ size = 26, dark }) {
  return <span style={{ fontFamily: HF, fontWeight: 800, fontSize: size, letterSpacing: '-0.02em', color: dark ? '#FFFFFF' : C.ink }}>admit<span style={{ color: dark ? '#A99BFF' : C.pri }}>profile</span></span>;
}

function Backdrop() {
  const { T } = useMotion();
  const blobs = [[200, 180, 520, C.yel], [1750, 160, 560, C.blue], [1720, 980, 600, C.pink], [140, 960, 520, C.mint]];
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden' }}>
      {blobs.map(([x, y, r, c], i) => {
        const dx = Math.sin(T * 0.25 + i * 1.7) * 40, dy = Math.cos(T * 0.2 + i) * 30;
        return <div key={i} style={{ position: 'absolute', left: x - r + dx, top: y - r + dy, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${c}66 0%, ${c}00 68%)` }} />;
      })}
    </div>
  );
}

function Headline({ from, to, kicker, title, sub, align = 'left', top, dark, size }) {
  const { M } = useMotion();
  const out = 1 - M.enter(to - 0.4, 0.35);
  const center = align === 'center';
  const words = title.split(' ');
  const wrap = center
    ? { position: 'absolute', left: 160, right: 160, top, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 22 }
    : { position: 'absolute', left: 120, width: 640, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 };
  const k = M.enter(from, 0.5), s = M.enter(from + 0.25 + words.length * 0.07, 0.6);
  return (
    <div style={{ ...wrap, opacity: out }}>
      {kicker && <span style={{ alignSelf: center ? 'center' : 'flex-start', opacity: k, transform: `translateY(${(1 - k) * 16}px)`, fontFamily: BF, fontWeight: 700, fontSize: 26, color: dark ? C.yel : C.pri, background: dark ? 'transparent' : '#FFFFFF', border: dark ? 'none' : `2px solid ${C.lav}`, padding: dark ? 0 : '8px 20px', borderRadius: 999 }}>{kicker}</span>}
      <div style={{ fontFamily: HF, fontWeight: 800, fontSize: size || (center ? 96 : 84), lineHeight: 1.02, letterSpacing: '-0.035em', color: dark ? '#FFFFFF' : C.ink, display: 'flex', flexWrap: 'wrap', justifyContent: center ? 'center' : 'flex-start', columnGap: '0.24em' }}>
        {words.map((w, i) => { const e = M.pop(from + 0.15 + i * 0.07, 0.55); return <span key={i} style={{ display: 'inline-block', opacity: Math.min(1, e * 1.4), transform: `translateY(${(1 - e) * 40}px)` }}>{w}</span>; })}
      </div>
      {sub && <div style={{ fontFamily: BF, fontSize: 32, lineHeight: 1.4, color: dark ? '#D4CCFF' : C.mute, maxWidth: 600, opacity: s, transform: `translateY(${(1 - s) * 16}px)` }}>{sub}</div>}
    </div>
  );
}

function Chip({ e, bg, children, size = 24, color }) {
  return <span style={{ display: 'inline-block', transform: `scale(${e})`, opacity: Math.min(1, e * 1.5), background: bg, color: color || C.ink, fontFamily: BF, fontWeight: 600, fontSize: size, padding: '10px 20px', borderRadius: 999, whiteSpace: 'nowrap' }}>{children}</span>;
}

function Brand() {
  const { CUES, M } = useMotion();
  const o = 1 - M.enter(CUES.CTA, 0.4);
  return (
    <>
      <div style={{ position: 'absolute', left: 120, top: 60, opacity: o }}><Wordmark size={34} /></div>
      <div style={{ position: 'absolute', right: 120, bottom: 44, opacity: o, fontFamily: BF, fontSize: 20, color: C.mute }}>For study-abroad consultants · figures are illustrative</div>
    </>
  );
}

function Hook() {
  const { CUES, M, vis } = useMotion();
  const o = vis(0, CUES.Brand, 0.3, 0.5);
  if (o <= 0.001) return null;
  const grades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const bar = M.enter(0.6, 0.8), pin1 = M.pop(2.2, 0.5), sweep = M.glide(4.0, 1.4);
  const L = 360, Wd = 1200;
  const pinX = L + Wd * (0.625 - 0.6 * sweep);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o }}>
      <div style={{ position: 'absolute', left: L, width: Wd, top: 640, height: 28, borderRadius: 14, background: '#FFFFFF', border: `2px solid ${C.line}`, overflow: 'hidden', opacity: bar }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (0.625 * pin1 * (1 - sweep)) * 100 + '%', background: `repeating-linear-gradient(135deg, #E3DEF5 0 12px, #F1EEFB 12px 24px)` }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: sweep * 100 + '%', background: C.pri, borderRadius: 14 }} />
      </div>
      {grades.map((g, i) => <span key={i} style={{ position: 'absolute', left: L + (i + 0.5) * (Wd / 4), top: 700, transform: 'translateX(-50%)', fontFamily: BF, fontWeight: 700, fontSize: 30, color: C.mute, opacity: bar }}>{g}</span>)}
      <span style={{ position: 'absolute', left: L + Wd * 0.3, top: 590, transform: 'translateX(-50%)', fontFamily: BF, fontWeight: 600, fontSize: 26, color: C.mute, opacity: pin1 * (1 - sweep) }}>Two years with no contact</span>
      <div style={{ position: 'absolute', left: pinX, top: 654, transform: `translate(-50%,-100%) scale(${pin1})`, transformOrigin: '50% 100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ background: sweep > 0.5 ? C.pri : C.red, color: '#FFFFFF', fontFamily: HF, fontWeight: 700, fontSize: 28, padding: '12px 24px', borderRadius: 999, whiteSpace: 'nowrap', marginBottom: 30 }}>{sweep > 0.5 ? 'Meet them here' : 'First call'}</span>
      </div>
    </div>
  );
}

function Window({ children }) {
  const { CUES, M } = useMotion();
  const v = M.enter(CUES.Brand, 0.7) * (1 - M.enter(CUES.CTA - 0.3, 0.5));
  if (v <= 0.001) return null;
  const tabs = [['Branding', CUES.Brand, CUES.Leads], ['Leads', CUES.Leads, CUES.Nudges], ['Nudges', CUES.Nudges, CUES.Admin], ['Admin', CUES.Admin, CUES.Revenue], ['Revenue', CUES.Revenue, CUES.CTA]];
  return (
    <div style={{ position: 'absolute', left: WX, top: WY, width: WW, height: WH, background: '#FFFFFF', borderRadius: 36, overflow: 'hidden', boxShadow: '0 40px 80px rgba(22,18,58,.14)', border: `2px solid ${C.line}`, opacity: v, transform: `translateY(${(1 - v) * 60}px) scale(${0.95 + 0.05 * v})`, transformOrigin: '50% 60%' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 100, borderBottom: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 36px', gap: 8 }}>
        {tabs.map(([l, a, b], i) => {
          const on = M.enter(a, 0.4) * (1 - M.enter(b, 0.4));
          return <span key={i} style={{ fontFamily: BF, fontWeight: 700, fontSize: 21, padding: '10px 18px', borderRadius: 999, background: `rgba(91,61,245,${on})`, color: on > 0.5 ? '#FFFFFF' : C.mute }}>{l}</span>;
        })}
      </div>
      {children}
    </div>
  );
}

function Pane({ a, b, children }) {
  const { vis } = useMotion();
  const o = vis(a + 0.15, b, 0.5, 0.35);
  if (o <= 0.001) return null;
  return <div style={{ position: 'absolute', inset: 0, opacity: o }}>{children}</div>;
}

function BrandPane() {
  const { T, CUES, M } = useMotion();
  const S = CUES.Brand;
  const swap = M.pop(S + 1.8, 0.6);
  const accents = [C.pri, C.orange, C.teal];
  const ai = T < S + 3.6 ? 0 : T < S + 4.8 ? 1 : 2;
  const acc = accents[ai];
  const nav = ['Profiler', 'Career map', 'Milestones', 'Talk to counsellor'];
  const checks = [['Your logo', S + 2.2, C.yel], ['Your colours', S + 4.2, C.mint], ['Your domain · plan.alnoor.qa', S + 6.0, C.blue]];
  return (
    <Pane a={S} b={CUES.Leads}>
      <div style={{ position: 'absolute', left: 0, top: 100, bottom: 0, width: 300, background: '#FAF9FF', borderRight: `2px solid ${C.line}`, padding: '28px 22px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ position: 'relative', height: 64, marginBottom: 14 }}>
          <div style={{ position: 'absolute', inset: 0, border: '2px dashed #C9C2EC', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BF, fontWeight: 600, fontSize: 20, color: C.mute, opacity: 1 - Math.min(1, swap) }}>Your logo here</div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 12, transform: `scale(${swap})`, transformOrigin: '0% 50%', opacity: Math.min(1, swap * 1.4) }}>
            <span style={{ width: 52, height: 52, borderRadius: 16, background: C.teal, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HF, fontWeight: 800, fontSize: 20 }}>AN</span>
            <span style={{ fontFamily: HF, fontWeight: 700, fontSize: 22, lineHeight: 1.1 }}>Al Noor Education</span>
          </div>
        </div>
        {nav.map((n, i) => <span key={i} style={{ fontFamily: BF, fontWeight: 600, fontSize: 21, padding: '12px 16px', borderRadius: 14, background: i === 0 ? acc : 'transparent', color: i === 0 ? '#FFFFFF' : C.ink }}>{n}</span>)}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 6, alignItems: 'center', fontFamily: BF, fontSize: 15, color: C.mute }}>Powered by <Wordmark size={16} /></div>
      </div>
      <div style={{ position: 'absolute', left: 340, right: 40, top: 140, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <span style={{ fontFamily: HF, fontWeight: 800, fontSize: 40 }}>Welcome back, Sara</span>
        <div style={{ borderRadius: 24, border: `2px solid ${C.line}`, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontFamily: BF, fontWeight: 700, fontSize: 17, letterSpacing: '.08em', color: C.mute }}>OMAR'S PROFILE</span>
          <span style={{ fontFamily: HF, fontWeight: 800, fontSize: 72, lineHeight: 1, color: acc }}>64%</span>
          <div style={{ height: 14, borderRadius: 7, background: C.bg }}><div style={{ height: '100%', width: '64%', borderRadius: 7, background: acc }} /></div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {accents.map((c, i) => <span key={i} style={{ width: 44, height: 44, borderRadius: 22, background: c, boxSizing: 'border-box', border: i === ai ? `4px solid ${C.ink}` : '4px solid #FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,.12)' }} />)}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 340, right: 40, top: 560, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        {checks.map(([t, at, c], i) => <Chip key={i} e={M.pop(at, 0.5)} bg={c}>✓ {t}</Chip>)}
      </div>
    </Pane>
  );
}

function LeadsPane() {
  const { CUES, M } = useMotion();
  const S = CUES.Leads;
  const count = 214 * M.glide(S + 0.8, 5.5);
  const rows = [['S', 'Sara', 'Omar · Grade 9', 'Instagram', C.yel], ['R', 'Reem', 'Yousef · Grade 10', 'School talk', C.pink], ['M', 'Mariam', 'Lina · Grade 9', 'Website', C.blue], ['K', 'Khalid', 'Noor · Grade 11', 'Referral', C.mint], ['H', 'Huda', 'Adam · Grade 9', 'Instagram', C.orange], ['F', 'Fatima', 'Zayd · Grade 10', 'Website', C.lav]];
  return (
    <Pane a={S} b={CUES.Nudges}>
      <div style={{ position: 'absolute', left: 48, right: 48, top: 140, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: HF, fontWeight: 800, fontSize: 36 }}>New parents</span>
          <span style={{ fontFamily: BF, fontSize: 22, color: C.mute }}>Signed up for the free planner</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: HF, fontWeight: 800, fontSize: 84, lineHeight: 1, color: C.pri }}>{fmt(count)}</span>
          <span style={{ fontFamily: BF, fontSize: 22, color: C.mute }}>this month</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 48, right: 48, top: 270, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(([ini, n, kid, src, c], i) => { const e = M.enter(S + 0.9 + i * 0.6, 0.5); return (
          <div key={i} style={{ height: 72, borderRadius: 20, background: i === 0 ? C.lav : C.bg, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', opacity: e, transform: `translateY(${(1 - e) * -24}px)` }}>
            <span style={{ width: 44, height: 44, borderRadius: 22, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HF, fontWeight: 800, fontSize: 20 }}>{ini}</span>
            <span style={{ fontFamily: BF, fontWeight: 700, fontSize: 24, width: 130 }}>{n}</span>
            <span style={{ fontFamily: BF, fontSize: 22, color: C.mute, flex: 1 }}>{kid}</span>
            <span style={{ fontFamily: BF, fontWeight: 600, fontSize: 18, background: '#FFFFFF', padding: '6px 14px', borderRadius: 999 }}>{src}</span>
          </div>); })}
      </div>
    </Pane>
  );
}

function NudgesPane() {
  const { CUES, M } = useMotion();
  const S = CUES.Nudges;
  const msgs = [['Hi Sara, Omar\'s profile just reached 64%. Great work on the robotics club!', S + 0.9, 'Mon 6:30 pm'], ['Reminder: the national robotics challenge closes in 2 weeks. Here\'s Omar\'s checklist.', S + 2.6, 'Thu 6:30 pm'], ['Summer programs open next month. Want a quick call with Ms. Layla?', S + 4.3, 'Sun 6:30 pm']];
  const reply = M.pop(S + 5.8, 0.5);
  return (
    <Pane a={S} b={CUES.Admin}>
      <div style={{ position: 'absolute', left: 40, right: 40, top: 124, bottom: 106, borderRadius: 28, overflow: 'hidden', background: '#EFE9E1', border: `2px solid ${C.line}` }}>
        <div style={{ height: 84, background: '#0F5C4A', display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px' }}>
          <span style={{ width: 48, height: 48, borderRadius: 24, background: C.teal, color: '#FFFFFF', border: '2px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HF, fontWeight: 800, fontSize: 18 }}>AN</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontFamily: BF, fontWeight: 700, fontSize: 22, color: '#FFFFFF' }}>Al Noor Education</span><span style={{ fontFamily: BF, fontSize: 16, color: '#BFE5D8' }}>WhatsApp · business account</span></div>
        </div>
        <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {msgs.map(([t, at, ts], i) => { const e = M.pop(at, 0.45); return (
            <div key={i} style={{ alignSelf: 'flex-start', maxWidth: 680, background: '#FFFFFF', borderRadius: '6px 22px 22px 22px', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4, transform: `scale(${e})`, transformOrigin: '0% 0%', opacity: Math.min(1, e * 1.4), boxShadow: '0 1px 2px rgba(0,0,0,.08)' }}>
              <span style={{ fontFamily: BF, fontSize: 21, lineHeight: 1.34 }}>{t}</span>
              <span style={{ alignSelf: 'flex-end', fontFamily: BF, fontSize: 14, color: C.mute }}>{ts}</span>
            </div>); })}
          <div style={{ alignSelf: 'flex-end', background: '#D4F5C9', borderRadius: '22px 6px 22px 22px', padding: '14px 20px', fontFamily: BF, fontWeight: 600, fontSize: 23, transform: `scale(${reply})`, transformOrigin: '100% 0%', opacity: Math.min(1, reply * 1.4) }}>Yes please, Sunday works</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 30, display: 'flex', gap: 12 }}>
        <Chip e={M.pop(S + 6.6, 0.5)} bg={C.mint}>71% of parents active weekly</Chip>
        <Chip e={M.pop(S + 7.1, 0.5)} bg={C.yel}>Sent on their schedule</Chip>
      </div>
    </Pane>
  );
}

function AdminPane() {
  const { CUES, M } = useMotion();
  const S = CUES.Admin;
  const funnel = [['Leads', 214, C.lav], ['Engaged', 132, C.blue], ['Asked to talk', 38, C.yel], ['Paid plans', 19, C.mint]];
  const rows = [['Omar · parent Sara', 'Grade 9', 92, 'Ready to talk', C.green, C.greenBg], ['Yousef · parent Reem', 'Grade 10', 74, 'Warming up', '#8A5A12', '#FBEFD2'], ['Lina · parent Mariam', 'Grade 9', 61, 'Warming up', '#8A5A12', '#FBEFD2'], ['Noor · parent Khalid', 'Grade 11', 35, 'New', C.mute, C.bg]];
  const hl = M.glide(S + 4.6, 0.6), toast = M.pop(S + 6.0, 0.55);
  return (
    <Pane a={S} b={CUES.Revenue}>
      <div style={{ position: 'absolute', left: 40, right: 40, top: 130, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {funnel.map(([l, v, c], i) => { const e = M.pop(S + 0.6 + i * 0.3, 0.5), n = v * M.glide(S + 0.6 + i * 0.3, 1.4); return (
          <div key={i} style={{ borderRadius: 22, background: c, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 4, transform: `scale(${e})`, opacity: Math.min(1, e * 1.4) }}>
            <span style={{ fontFamily: BF, fontWeight: 600, fontSize: 19 }}>{l}</span>
            <span style={{ fontFamily: HF, fontWeight: 800, fontSize: 56, lineHeight: 1 }}>{fmt(n)}</span>
          </div>); })}
      </div>
      <div style={{ position: 'absolute', left: 40, right: 40, top: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr .7fr 1.2fr 1fr', gap: 16, padding: '0 20px', fontFamily: BF, fontWeight: 700, fontSize: 15, letterSpacing: '.08em', color: C.mute }}><span>STUDENT</span><span>GRADE</span><span>ENGAGEMENT</span><span>STATUS</span></div>
        {rows.map(([n, g, sc, st, fg, bg], i) => { const e = M.enter(S + 1.8 + i * 0.25, 0.5), w = sc * M.glide(S + 2.0 + i * 0.25, 1.2), on = i === 0; return (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr .7fr 1.2fr 1fr', gap: 16, alignItems: 'center', height: 70, padding: '0 20px', borderRadius: 18, background: on ? `rgba(230,225,255,${hl})` : 'transparent', border: `2px solid ${on ? `rgba(91,61,245,${hl})` : C.line}`, opacity: e * (on ? 1 : 1 - 0.4 * hl) }}>
            <span style={{ fontFamily: BF, fontWeight: 700, fontSize: 23 }}>{n}</span>
            <span style={{ fontFamily: BF, fontSize: 21, color: C.mute }}>{g}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ flex: 1, height: 10, borderRadius: 5, background: C.bg }}><div style={{ width: w + '%', height: '100%', borderRadius: 5, background: C.pri }} /></div><span style={{ fontFamily: BF, fontWeight: 700, fontSize: 19, width: 34 }}>{Math.round(w)}</span></div>
            <span style={{ justifySelf: 'start', fontFamily: BF, fontWeight: 700, fontSize: 17, padding: '6px 14px', borderRadius: 999, color: fg, background: bg, whiteSpace: 'nowrap' }}>{st}</span>
          </div>); })}
      </div>
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 36, borderRadius: 24, background: C.ink, color: '#FFFFFF', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18, transform: `translateY(${(1 - Math.min(1, toast)) * 40}px) scale(${0.9 + 0.1 * toast})`, opacity: Math.min(1, toast * 1.4) }}>
        <span style={{ width: 52, height: 52, borderRadius: 26, background: C.yel, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HF, fontWeight: 800, fontSize: 22 }}>S</span>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontFamily: BF, fontWeight: 700, fontSize: 24 }}>Sara asked to talk to a counsellor</span><span style={{ fontFamily: BF, fontSize: 18, color: '#B9B2E8' }}>Via Talk to counsellor · 2 min ago</span></div>
        <span style={{ fontFamily: BF, fontWeight: 700, fontSize: 20, padding: '12px 20px', borderRadius: 999, background: '#25D366', color: '#0B2E1A' }}>WhatsApp</span>
        <span style={{ fontFamily: BF, fontWeight: 700, fontSize: 20, padding: '12px 20px', borderRadius: 999, background: '#FFFFFF', color: C.ink }}>Call</span>
      </div>
    </Pane>
  );
}

function RevenuePane() {
  const { CUES, M } = useMotion();
  const S = CUES.Revenue;
  const MAX = 16400, BW = 860;
  const segs = [['Grade 9', 2400, C.lav], ['Grade 10', 3200, C.blue], ['Grade 11', 4800, C.yel], ['Grade 12', 6000, C.mint]];
  const a = M.glide(S + 0.7, 1.0);
  let acc = 0;
  const total = segs.reduce((s, [, v], i) => s + v * M.glide(S + 2.0 + i * 0.5, 0.6), 0);
  const big = M.pop(S + 4.6, 0.6);
  return (
    <Pane a={S} b={CUES.CTA}>
      <div style={{ position: 'absolute', left: 50, right: 50, top: 150, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span style={{ fontFamily: BF, fontWeight: 700, fontSize: 18, letterSpacing: '.08em', color: C.mute }}>REVENUE PER STUDENT</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: BF, fontSize: 24 }}><span style={{ fontWeight: 600 }}>Today: one package in Grade 11</span><span style={{ fontWeight: 700 }}>QAR {fmt(6000 * a)}</span></div>
        <div style={{ height: 56, borderRadius: 16, background: C.bg }}><div style={{ width: (6000 / MAX) * BW * a, height: '100%', borderRadius: 16, background: '#C9C2EC' }} /></div>
      </div>
      <div style={{ position: 'absolute', left: 50, right: 50, top: 350, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: BF, fontSize: 24 }}><span style={{ fontWeight: 600 }}>With admitprofile: Grade 9 to 12</span><span style={{ fontWeight: 800, color: C.pri }}>QAR {fmt(total)}</span></div>
        <div style={{ height: 56, borderRadius: 16, background: C.bg, display: 'flex', gap: 4, overflow: 'hidden' }}>
          {segs.map(([g, v, c], i) => { const e = M.glide(S + 2.0 + i * 0.5, 0.6); return <div key={i} style={{ width: (v / MAX) * BW * e, height: '100%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BF, fontWeight: 700, fontSize: 18, overflow: 'hidden', whiteSpace: 'nowrap' }}>{e > 0.8 ? g : ''}</div>; })}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontFamily: BF, fontSize: 19, color: C.mute }}>Planner plans · counsellor sessions · application package</div>
      </div>
      <div style={{ position: 'absolute', left: 50, right: 50, top: 560, display: 'flex', alignItems: 'center', gap: 28, transform: `scale(${big})`, transformOrigin: '0% 50%', opacity: Math.min(1, big * 1.4) }}>
        <span style={{ fontFamily: HF, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: '-0.04em', color: C.pri }}>2.7×</span>
        <span style={{ fontFamily: BF, fontWeight: 600, fontSize: 30, lineHeight: 1.3, maxWidth: 360 }}>more revenue from every student you sign</span>
      </div>
    </Pane>
  );
}

function CTA() {
  const { CUES, END, M } = useMotion();
  const S = CUES.CTA;
  const v = M.enter(S - 0.1, 0.6) * (1 - M.enter(END - 0.6, 0.55));
  if (v <= 0.001) return null;
  const logo = M.pop(S + 0.3, 0.6), btn = M.pop(S + 1.8, 0.55);
  const pills = [['White-label', C.yel], ['Lead engine', C.blue], ['WhatsApp nudges', C.mint], ['Counsellor requests', C.pink]];
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.ink, opacity: v, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: -200, top: -260, width: 900, height: 900, borderRadius: '50%', background: `radial-gradient(circle, ${C.pri}88 0%, ${C.pri}00 65%)` }} />
      <div style={{ position: 'absolute', right: -240, bottom: -300, width: 1000, height: 1000, borderRadius: '50%', background: `radial-gradient(circle, ${C.pink}55 0%, ${C.pink}00 65%)` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 190, display: 'flex', justifyContent: 'center', transform: `scale(${logo})`, opacity: Math.min(1, logo * 1.4) }}><Wordmark size={84} dark /></div>
      <Headline from={S + 0.6} to={END + 1} align="center" top={360} dark size={88} title="Grow every student from Grade 9 to graduation." />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', gap: 12 }}>
        {pills.map(([t, c], i) => <Chip key={i} e={M.pop(S + 1.3 + i * 0.15, 0.45)} bg={c} size={26}>{t}</Chip>)}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 780, display: 'flex', justifyContent: 'center' }}>
        <span style={{ transform: `scale(${btn})`, opacity: Math.min(1, btn * 1.4), background: C.yel, color: C.ink, fontFamily: HF, fontWeight: 800, fontSize: 40, padding: '22px 46px', borderRadius: 999 }}>Book a demo · admitprofile.com</span>
      </div>
    </div>
  );
}

function Piece() {
  const { T, CUES } = useMotion();
  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, fontFamily: BF, color: C.ink, overflow: 'hidden' }}>
      <Backdrop />
      <Brand />
      <Headline from={0.3} to={3.9} align="center" top={250} kicker="For study-abroad consultants" title="Most parents call you in Grade 11." />
      <Headline from={3.9} to={CUES.Brand} align="center" top={290} title="Meet them in Grade 9." />
      <Hook />
      <Headline from={CUES.Brand + 0.2} to={CUES.Leads} kicker="01 · Your brand" title="A parent planning tool, with your branding." sub="Your logo, your colours, your domain. Parents see your agency, not ours." />
      <Headline from={CUES.Leads + 0.2} to={CUES.Nudges} kicker="02 · Lead engine" title="A free tool that brings parents in." sub="Parents start planning in Grade 9 and land in your list." />
      <Headline from={CUES.Nudges + 0.2} to={CUES.Admin} kicker="03 · Nudges" title="Stay in touch without the chasing." sub="WhatsApp and email nudges keep parents coming back every week." />
      <Headline from={CUES.Admin + 0.2} to={CUES.Revenue} kicker="04 · Admin" title="See who's ready to talk." sub="Engagement scores and counsellor requests in one place." />
      <Headline from={CUES.Revenue + 0.2} to={CUES.CTA} kicker="05 · Revenue" title="Four years, not one package." sub="Plans and counsellor sessions from Grade 9 to applications." />
      <Window>
        <BrandPane />
        <LeadsPane />
        <NudgesPane />
        <AdminPane />
        <RevenuePane />
      </Window>
      <CTA />
    </div>
  );
}

function ConsultantApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true });
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0E0B26' }}>
      <CompositionStage width={VW} height={VH} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={C.bg}>
        <Piece />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Video" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </div>
  );
}

window.ConsultantApp = ConsultantApp;
