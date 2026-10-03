const VW = 1920, VH = 1080;
const C = { bg: '#F6F4FF', ink: '#16123A', mute: '#6E6A8A', pri: '#5B3DF5', lav: '#E6E1FF', yel: '#FFC53D', pink: '#FF9EBB', blue: '#7CC8FF', mint: '#7BE0B5', orange: '#FFB067', green: '#0E8A5F', greenBg: '#DDF7EA', line: '#E7E3F5', teal: '#0F4C5C' };
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

function keyed(T, keys, M) {
  if (T <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (T < b.t) {
      const e = b.e === 'pop' ? M.pop(a.t, b.t - a.t) : M.glide(a.t, b.t - a.t);
      const o = {};
      ['x', 'y', 's'].forEach(k => { const av = a[k], bv = b[k] ?? av; o[k] = av + (bv - av) * e; });
      return o;
    }
  }
  const last = keys[keys.length - 1];
  return last;
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

function Headline({ from, to, kicker, title, sub, align = 'left', top, dark }) {
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
      <div style={{ fontFamily: HF, fontWeight: 800, fontSize: center ? 96 : 88, lineHeight: 1.02, letterSpacing: '-0.035em', color: dark ? '#FFFFFF' : C.ink, display: 'flex', flexWrap: 'wrap', justifyContent: center ? 'center' : 'flex-start', columnGap: '0.24em' }}>
        {words.map((w, i) => { const e = M.pop(from + 0.15 + i * 0.07, 0.55); return <span key={i} style={{ display: 'inline-block', opacity: Math.min(1, e * 1.4), transform: `translateY(${(1 - e) * 40}px)` }}>{w}</span>; })}
      </div>
      {sub && <div style={{ fontFamily: BF, fontSize: 32, lineHeight: 1.4, color: dark ? '#D4CCFF' : C.mute, maxWidth: 600, opacity: s, transform: `translateY(${(1 - s) * 16}px)` }}>{sub}</div>}
    </div>
  );
}

function Avatar() {
  const { T, CUES, M } = useMotion();
  const H = { x: 960, y: 610 };
  const keys = [
    { t: 0.2, ...H, s: 0 }, { t: 0.95, ...H, s: 340, e: 'pop' }, { t: CUES.Ask - 0.2, ...H, s: 340 },
    { t: CUES.Ask + 0.6, x: 910, y: 330, s: 64 }, { t: CUES.Profiler - 0.1, x: 910, y: 330, s: 64 },
    { t: CUES.Profiler + 0.7, x: 1060, y: 420, s: 240 }, { t: CUES.CareerMap - 0.1, x: 1060, y: 420, s: 240 },
    { t: CUES.CareerMap + 0.7, x: 1010, y: 480, s: 120 }, { t: CUES.Milestones - 0.1, x: 1010, y: 480, s: 120 },
    { t: CUES.Milestones + 0.7, x: 910, y: 330, s: 64 }, { t: CUES.Finale - 0.1, x: 910, y: 330, s: 64 },
    { t: CUES.Finale + 0.8, x: 960, y: 560, s: 300 }, { t: CUES.CTA - 0.1, x: 960, y: 560, s: 300 },
    { t: CUES.CTA + 0.5, x: 960, y: 560, s: 0 },
  ];
  const k = keyed(T, keys, M);
  const bob = (T < CUES.Ask ? Math.sin(T * 2) * 8 : 0);
  if (k.s < 1) return null;
  const bw = Math.max(3, k.s * 0.028);
  return (
    <div style={{ position: 'absolute', left: k.x - k.s / 2, top: k.y - k.s / 2 + bob, width: k.s, height: k.s, borderRadius: '50%', background: C.yel, border: `${bw}px solid #FFFFFF`, boxSizing: 'border-box', overflow: 'hidden', boxShadow: `0 ${k.s * 0.06}px ${k.s * 0.18}px rgba(22,18,58,.18)` }}>
      <img src="assets/omar.svg" style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

function Brand() {
  const { CUES, M } = useMotion();
  const o = 1 - M.enter(CUES.CTA, 0.4);
  return (
    <>
      <div style={{ position: 'absolute', left: 120, top: 56, display: 'flex', alignItems: 'center', gap: 14, opacity: o }}>
        <span style={{ width: 52, height: 52, borderRadius: 16, background: C.teal, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HF, fontWeight: 800, fontSize: 20 }}>AN</span>
        <span style={{ fontFamily: HF, fontWeight: 700, fontSize: 26, color: C.ink }}>Al Noor Education</span>
      </div>
      <div style={{ position: 'absolute', right: 120, bottom: 44, display: 'flex', alignItems: 'center', gap: 8, opacity: o, fontFamily: BF, fontSize: 20, color: C.mute }}>
        Powered by <span style={{ fontFamily: HF, fontWeight: 800, color: C.ink }}>admit<span style={{ color: C.pri }}>profile</span></span>
      </div>
    </>
  );
}

function HookChips() {
  const { T, CUES, M } = useMotion();
  const chips = [[-470, -150, 'Engineering?', C.yel], [430, -190, 'Medicine?', C.pink], [-520, 90, 'Business?', C.blue], [470, 70, 'Design?', C.mint], [-300, 290, 'Computer science?', C.orange], [320, 300, 'Study abroad?', C.lav]];
  const out = M.glide(CUES.Ask - 0.6, 0.6);
  return chips.map(([dx, dy, t, c], i) => {
    const e = M.pop(1.1 + i * 0.22, 0.5);
    const x = 960 + dx * (1 - out * 0.6), y = 610 + dy * (1 - out * 0.6) + Math.sin(T * 1.6 + i) * 10;
    return <div key={i} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${e * (1 - out)}) rotate(${(i % 2 ? 1 : -1) * 4}deg)`, background: c, color: C.ink, fontFamily: HF, fontWeight: 700, fontSize: 34, padding: '14px 28px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 10px 24px rgba(22,18,58,.10)' }}>{t}</div>;
  });
}

function Window({ children }) {
  const { CUES, M } = useMotion();
  const v = M.enter(CUES.Ask, 0.7) * (1 - M.enter(CUES.Finale - 0.1, 0.5));
  if (v <= 0.001) return null;
  const tabs = [['Assistant', CUES.Ask, CUES.Profiler], ['Profiler', CUES.Profiler, CUES.CareerMap], ['Career map', CUES.CareerMap, CUES.Milestones], ['Milestones', CUES.Milestones, CUES.Finale]];
  return (
    <div style={{ position: 'absolute', left: WX, top: WY, width: WW, height: WH, background: '#FFFFFF', borderRadius: 36, overflow: 'hidden', boxShadow: '0 40px 80px rgba(22,18,58,.14)', border: `2px solid ${C.line}`, opacity: v, transform: `translateY(${(1 - v) * 60}px) scale(${0.95 + 0.05 * v})`, transformOrigin: '50% 60%' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 100, borderBottom: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 40px', gap: 12 }}>
        {tabs.map(([l, a, b], i) => {
          const on = M.enter(a, 0.4) * (1 - M.enter(b, 0.4));
          return <span key={i} style={{ fontFamily: BF, fontWeight: 700, fontSize: 22, padding: '10px 20px', borderRadius: 999, background: `rgba(91,61,245,${on})`, color: on > 0.5 ? '#FFFFFF' : C.mute }}>{l}</span>;
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

function Chip({ e, bg, children, size = 24 }) {
  return <span style={{ display: 'inline-block', transform: `scale(${e})`, opacity: Math.min(1, e * 1.5), background: bg, color: C.ink, fontFamily: BF, fontWeight: 600, fontSize: size, padding: '10px 20px', borderRadius: 999, whiteSpace: 'nowrap' }}>{children}</span>;
}

function AskPane({ name }) {
  const { T, CUES, M, lin } = useMotion();
  const A = CUES.Ask;
  const q = `${name} is in Grade 9 at an IB school. He loves robotics and physics, but has no idea what to study.`;
  const n = Math.round(q.length * lin(A + 1.0, 2.6));
  const pb = M.pop(A + 0.7, 0.45), ai = M.enter(A + 4.6, 0.6), card = M.pop(A + 6.0, 0.55);
  const dotsOn = T > A + 3.8 && T < A + 4.6;
  const pulse = M.pop(A + 7.6, 0.5);
  return (
    <Pane a={A} b={CUES.Profiler}>
      <div style={{ position: 'absolute', left: 120, top: 160, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontFamily: HF, fontWeight: 700, fontSize: 30, color: C.ink }}>{name}</span>
        <span style={{ fontFamily: BF, fontSize: 22, color: C.mute }}>Grade 9 · IB MYP · Doha</span>
      </div>
      <div style={{ position: 'absolute', right: 48, top: 250, maxWidth: 660, background: C.pri, color: '#FFFFFF', fontFamily: BF, fontSize: 28, lineHeight: 1.42, padding: '22px 28px', borderRadius: '28px 28px 8px 28px', transform: `scale(${pb})`, transformOrigin: '100% 100%', opacity: Math.min(1, pb * 1.4) }}>
        <span>{q.slice(0, n)}</span><span style={{ color: 'transparent' }}>{q.slice(n)}</span>
      </div>
      {dotsOn && <div style={{ position: 'absolute', left: 48, top: 450, display: 'flex', gap: 8, padding: '22px 26px', borderRadius: '28px 28px 28px 8px', background: C.bg }}>
        {[0, 1, 2].map(i => <span key={i} style={{ width: 12, height: 12, borderRadius: 6, background: C.pri, opacity: 0.3 + 0.7 * Math.abs(Math.sin(T * 5 - i * 0.7)) }} />)}
      </div>}
      <div style={{ position: 'absolute', left: 48, top: 450, maxWidth: 720, background: C.bg, color: C.ink, fontFamily: BF, fontSize: 28, lineHeight: 1.42, padding: '22px 28px', borderRadius: '28px 28px 28px 8px', opacity: ai, transform: `translateY(${(1 - ai) * 20}px)` }}>
        Great starting point. I've added robotics and physics to {name}'s profile. Engineering looks like an early fit, so let's explore it.
      </div>
      <div style={{ position: 'absolute', left: 48, top: 650, width: 640, background: '#FFFFFF', border: `2px solid ${C.lav}`, borderRadius: 26, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, transform: `scale(${card})`, transformOrigin: '0% 0%', opacity: Math.min(1, card * 1.4), boxShadow: `0 ${12 * pulse}px ${30 * pulse}px rgba(91,61,245,${0.22 * pulse})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: C.pri, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>✓</span>
          <span style={{ fontFamily: HF, fontWeight: 700, fontSize: 26 }}>Profile updated</span>
          <span style={{ fontFamily: BF, fontSize: 20, color: C.mute }}>3 new facts</span>
          <span style={{ marginLeft: 'auto', fontFamily: BF, fontWeight: 700, fontSize: 20, color: C.pri }}>Open →</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Chip e={M.pop(A + 6.4, 0.4)} bg={C.yel} size={22}>Robotics</Chip>
          <Chip e={M.pop(A + 6.6, 0.4)} bg={C.blue} size={22}>Physics</Chip>
          <Chip e={M.pop(A + 6.8, 0.4)} bg={C.pink} size={22}>Exploring options</Chip>
        </div>
      </div>
    </Pane>
  );
}

function ProfilerPane({ name }) {
  const { CUES, M } = useMotion();
  const P = CUES.Profiler;
  const g1 = M.glide(P + 1.2, 2.8), g2 = M.glide(P + 6.8, 0.8);
  const pct = Math.round(32 + 26 * g1 + 6 * g2);
  const badge = M.pop(P + 1.0, 0.5), toast = M.pop(P + 6.4, 0.5) * (1 - M.enter(P + 9.0, 0.4));
  const bars = [['Academics', 72], ['Activities', 58], ['Experience', 44]];
  const traits = [['Hands-on builder', C.yel], ['Loves physics', C.blue], ['Strong in math', C.mint], ['Team tech lead', C.pink], ['Curious about space', C.orange]];
  return (
    <Pane a={P} b={CUES.CareerMap}>
      <div style={{ position: 'absolute', left: 40, width: 360, top: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <span style={{ fontFamily: HF, fontWeight: 800, fontSize: 44, color: C.ink }}>{name}</span>
        <span style={{ transform: `scale(${badge})`, opacity: Math.min(1, badge * 1.4), background: C.yel, fontFamily: HF, fontWeight: 700, fontSize: 26, padding: '10px 24px', borderRadius: 999 }}>The Builder</span>
      </div>
      <div style={{ position: 'absolute', left: 440, width: 470, top: 160, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontFamily: BF, fontWeight: 700, fontSize: 18, letterSpacing: '.08em', color: C.mute }}>PROFILE DEVELOPMENT</span>
        <span style={{ fontFamily: HF, fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: '-0.04em', color: C.pri }}>{pct}%</span>
        <div style={{ height: 18, borderRadius: 9, background: C.lav, overflow: 'hidden' }}><div style={{ height: '100%', width: pct + '%', background: C.pri, borderRadius: 9 }} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
          {bars.map(([l, v], i) => { const e = M.glide(P + 1.6 + i * 0.3, 1.6); const val = Math.round(v * (0.4 + 0.6 * e)); return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: BF, fontSize: 22 }}><span>{l}</span><span style={{ fontWeight: 700 }}>{val}</span></div>
              <div style={{ height: 10, borderRadius: 5, background: C.bg }}><div style={{ height: '100%', width: val + '%', borderRadius: 5, background: [C.yel, C.pink, C.mint][i] }} /></div>
            </div>); })}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 48, right: 48, top: 600, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span style={{ fontFamily: BF, fontWeight: 700, fontSize: 18, letterSpacing: '.08em', color: C.mute }}>WHAT WE KNOW</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {traits.map(([t, c], i) => <Chip key={i} e={M.pop(P + 3.6 + i * 0.35, 0.45)} bg={c}>{t}</Chip>)}
        </div>
      </div>
      <div style={{ position: 'absolute', right: 40, top: 128, transform: `scale(${toast})`, transformOrigin: '100% 0%', opacity: Math.min(1, toast * 1.4), background: C.ink, color: '#FFFFFF', fontFamily: BF, fontWeight: 600, fontSize: 22, padding: '12px 20px', borderRadius: 16, display: 'flex', gap: 10 }}>
        Joined the robotics club <span style={{ color: C.yel, fontWeight: 700 }}>+6%</span>
      </div>
    </Pane>
  );
}

function CareerMapPane({ name }) {
  const { CUES, M } = useMotion();
  const S = CUES.CareerMap;
  const hl = M.glide(S + 4.4, 0.6);
  const L1 = [['Engineering', 190, '91%', C.yel, true], ['Computer science', 340, '78%', C.blue, false], ['Design', 490, '62%', C.mint, false]];
  const L2 = [['Robotics engineer', 150, 0, true], ['Aerospace engineer', 240, 0, false], ['AI engineer', 340, 1, false], ['Product designer', 490, 2, false]];
  const root = { x: 230, y: 340 };
  const curve = (x1, y1, x2, y2) => `M${x1} ${y1} C${x1 + 70} ${y1}, ${x2 - 70} ${y2}, ${x2} ${y2}`;
  const card = M.enter(S + 5.2, 0.7);
  const cols = [['MAJOR', 'Mechanical & Robotics Engineering'], ['UNIVERSITIES THAT SUIT IT', 'Research universities with strong labs'], ['EXAMPLES', 'Georgia Tech · Purdue · Texas A&M Qatar']];
  return (
    <Pane a={S} b={CUES.Milestones}>
      <div style={{ position: 'absolute', left: 24, right: 24, top: 120, bottom: 24, borderRadius: 24, background: `radial-gradient(#D9D3F5 2px, transparent 2px) 0 0/30px 30px`, backgroundColor: '#FBFAFF' }} />
      <svg width={WW} height={WH} style={{ position: 'absolute', left: 0, top: 0 }}>
        {L1.map(([l, y, , , on], i) => { const e = M.enter(S + 0.6 + i * 0.3, 0.6); return <path key={'a' + i} d={curve(root.x + 10, root.y, 330, y)} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - e} fill="none" stroke={on ? C.pri : '#C9C2EC'} strokeWidth={on ? 3 + 3 * hl : 3} opacity={on ? 1 : 1 - 0.55 * hl} />; })}
        {L2.map(([l, y, p, on], i) => { const e = M.enter(S + 2.0 + i * 0.25, 0.5); return <path key={'b' + i} d={curve(580, L1[p][1], 660, y)} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - e} fill="none" stroke={on ? C.pri : '#C9C2EC'} strokeWidth={on ? 3 + 3 * hl : 3} opacity={on ? 1 : 1 - 0.55 * hl} />; })}
      </svg>
      <span style={{ position: 'absolute', left: root.x - 140, width: 280, top: root.y + 70, textAlign: 'center', fontFamily: HF, fontWeight: 700, fontSize: 26 }}>{name}</span>
      {L1.map(([l, y, sc, c, on], i) => { const e = M.pop(S + 0.9 + i * 0.3, 0.5); return (
        <div key={i} style={{ position: 'absolute', left: 330, top: y - 36, width: 250, height: 72, boxSizing: 'border-box', borderRadius: 20, background: '#FFFFFF', border: `2px solid ${on ? C.pri : C.line}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', transform: `scale(${e})`, opacity: Math.min(1, e * 1.4) * (on ? 1 : 1 - 0.55 * hl), boxShadow: '0 6px 16px rgba(22,18,58,.06)' }}>
          <span style={{ width: 30, height: 30, borderRadius: 10, background: c, flex: '0 0 30px' }} />
          <span style={{ fontFamily: BF, fontWeight: 700, fontSize: 22, flex: 1, whiteSpace: 'nowrap' }}>{l}</span>
          <span style={{ fontFamily: HF, fontWeight: 800, fontSize: 22, color: C.pri }}>{sc}</span>
        </div>); })}
      {L2.map(([l, y, , on], i) => { const e = M.pop(S + 2.3 + i * 0.25, 0.5); return (
        <div key={i} style={{ position: 'absolute', left: 660, top: y - 30, height: 60, boxSizing: 'border-box', borderRadius: 999, background: on ? `rgba(230,225,255,${0.4 + 0.6 * hl})` : '#FFFFFF', border: `2px solid ${on ? C.pri : C.line}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px 0 14px', transform: `scale(${e * (on ? 1 + 0.06 * hl : 1)})`, transformOrigin: '0% 50%', opacity: Math.min(1, e * 1.4) * (on ? 1 : 1 - 0.55 * hl) }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: C.pri }} />
          <span style={{ fontFamily: BF, fontWeight: 600, fontSize: 22, whiteSpace: 'nowrap' }}>{l}</span>
        </div>); })}
      <div style={{ position: 'absolute', left: 48, right: 48, top: 584, height: 172, boxSizing: 'border-box', borderRadius: 24, background: C.ink, color: '#FFFFFF', padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 16, opacity: card, transform: `translateY(${(1 - card) * 50}px)` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: HF, fontWeight: 800, fontSize: 30 }}>Robotics engineer</span>
          <span style={{ fontFamily: BF, fontSize: 20, color: '#B9B2E8' }}>Engineering pathway</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.15fr', gap: 24 }}>
          {cols.map(([k, v], i) => { const e = M.enter(S + 5.8 + i * 0.55, 0.5); return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, opacity: e, transform: `translateY(${(1 - e) * 12}px)` }}>
              <span style={{ fontFamily: BF, fontWeight: 700, fontSize: 15, letterSpacing: '.08em', color: C.yel }}>{k}</span>
              <span style={{ fontFamily: BF, fontWeight: 600, fontSize: 21, lineHeight: 1.3 }}>{v}</span>
            </div>); })}
        </div>
      </div>
    </Pane>
  );
}

function MilestonesPane({ name }) {
  const { T, CUES, M, lin } = useMotion();
  const S = CUES.Milestones;
  const rows = [['Grade 9', 'Keep Math at 6 or above'], ['Grade 9', 'Start a robotics project'], ['Grade 10', 'Join the robotics club'], ['Grade 10', 'Enter a national robotics challenge'], ['Grade 11', 'Engineering summer program'], ['Grade 12', 'Build a university shortlist']];
  const tk = (i) => S + 0.3 + i * 1.5;
  const ticks = rows.map((_, i) => i === 0 ? 1 : M.pop(tk(i), 0.45));
  const doneN = 5 + ticks.slice(1).filter(x => x > 0.5).length;
  const prog = 0.06 + ticks.slice(1).reduce((s, x) => s + Math.min(1, x), 0) * 0.17;
  return (
    <Pane a={S} b={CUES.Finale}>
      <div style={{ position: 'absolute', left: 120, top: 160, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontFamily: HF, fontWeight: 700, fontSize: 30 }}>{name}'s milestones</span>
        <span style={{ fontFamily: BF, fontSize: 22, color: C.mute }}>Engineering + Computer science</span>
      </div>
      <div style={{ position: 'absolute', right: 48, top: 150, display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontFamily: HF, fontWeight: 800, fontSize: 64, color: C.pri, lineHeight: 1 }}>{doneN}</span>
        <span style={{ fontFamily: BF, fontSize: 24, color: C.mute }}>of 28 done</span>
      </div>
      <div style={{ position: 'absolute', left: 64, right: 64, top: 258, height: 70 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 10, height: 10, borderRadius: 5, background: C.lav }} />
        <div style={{ position: 'absolute', left: 0, top: 10, height: 10, borderRadius: 5, width: prog * 100 + '%', background: C.pri }} />
        {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((g, i) => (
          <div key={i} style={{ position: 'absolute', left: (i / 3) * 100 + '%', top: 0, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 30, height: 30, borderRadius: 15, boxSizing: 'border-box', background: prog >= i / 3 ? C.pri : '#FFFFFF', border: `3px solid ${prog >= i / 3 ? C.pri : C.lav}` }} />
            <span style={{ fontFamily: BF, fontWeight: 700, fontSize: 20, color: prog >= i / 3 ? C.ink : C.mute, whiteSpace: 'nowrap' }}>{g}</span>
          </div>))}
        <div style={{ position: 'absolute', left: prog * 100 + '%', top: -8, transform: 'translateX(-50%)', width: 46, height: 46, borderRadius: 23, background: C.yel, border: '4px solid #FFFFFF', boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(22,18,58,.2)' }} />
      </div>
      <div style={{ position: 'absolute', left: 48, right: 48, top: 356, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(([g, t], i) => { const e = M.enter(S + 0.5 + i * 0.12, 0.5), k = ticks[i], f = i > 0 ? lin(tk(i), 1.0) : 0; return (
          <div key={i} style={{ position: 'relative', height: 56, borderRadius: 18, display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', background: k > 0.5 ? C.greenBg : C.bg, opacity: e, transform: `translateX(${(1 - e) * 30}px)` }}>
            <span style={{ fontFamily: BF, fontWeight: 700, fontSize: 17, color: C.pri, background: '#FFFFFF', padding: '5px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>{g}</span>
            <span style={{ flex: 1, fontFamily: BF, fontWeight: 600, fontSize: 24 }}>{t}</span>
            <span style={{ width: 34, height: 34, borderRadius: 10, boxSizing: 'border-box', border: `3px solid ${k > 0.05 ? C.green : '#C9C2EC'}`, background: '#FFFFFF', position: 'relative' }}>
              <span style={{ position: 'absolute', inset: -3, borderRadius: 10, background: C.green, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, transform: `scale(${k})` }}>✓</span>
            </span>
            {f > 0 && f < 1 && <span style={{ position: 'absolute', right: 70, top: 10 - f * 40, opacity: 1 - f, fontFamily: HF, fontWeight: 800, fontSize: 22, color: C.green }}>+2%</span>}
          </div>); })}
      </div>
    </Pane>
  );
}

function Finale() {
  const { T, CUES, M, vis, lin } = useMotion();
  const F = CUES.Finale;
  const o = vis(F, CUES.CTA + 0.2, 0.4, 0.4);
  if (o <= 0.001) return null;
  const cols = [C.yel, C.pink, C.blue, C.mint, C.orange, C.pri];
  const q = lin(F + 0.7, 2.2);
  const conf = Array.from({ length: 30 }, (_, i) => {
    const a = (i / 30) * Math.PI * 2 + (i % 3) * 0.2, d = 300 + ((i * 97) % 240);
    const e = Easing.easeOutCubic(Math.min(1, q * 1.6));
    return { x: 960 + Math.cos(a) * d * e, y: 560 + Math.sin(a) * d * e + 160 * q * q, r: 12 + (i % 4) * 4, c: cols[i % cols.length], rot: q * 360 * (i % 2 ? 1 : -1), sq: i % 3 === 0 };
  });
  const stats = [['Profile 92%', C.yel], ['Robotics engineering', C.blue], ['28 of 28 milestones', C.mint]];
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o }}>
      {q > 0 && q < 1 && conf.map((p, i) => <span key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: p.r, height: p.r, borderRadius: p.sq ? 3 : '50%', background: p.c, opacity: 1 - q, transform: `rotate(${p.rot}deg)` }} />)}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', gap: 16 }}>
        {stats.map(([t, c], i) => <Chip key={i} e={M.pop(F + 1.4 + i * 0.25, 0.5)} bg={c} size={32}>{t}</Chip>)}
      </div>
    </div>
  );
}

function CTA() {
  const { CUES, END, M } = useMotion();
  const S = CUES.CTA;
  const v = M.enter(S - 0.1, 0.6) * (1 - M.enter(END - 0.6, 0.55));
  if (v <= 0.001) return null;
  const logo = M.pop(S + 0.3, 0.6), btn = M.pop(S + 1.6, 0.55);
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.ink, opacity: v, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: -200, top: -260, width: 900, height: 900, borderRadius: '50%', background: `radial-gradient(circle, ${C.pri}88 0%, ${C.pri}00 65%)` }} />
      <div style={{ position: 'absolute', right: -240, bottom: -300, width: 1000, height: 1000, borderRadius: '50%', background: `radial-gradient(circle, ${C.pink}55 0%, ${C.pink}00 65%)` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, transform: `scale(${logo})`, opacity: Math.min(1, logo * 1.4) }}>
        <span style={{ width: 120, height: 120, borderRadius: 34, background: C.teal, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HF, fontWeight: 800, fontSize: 46, border: '3px solid #2A6A7A' }}>AN</span>
        <span style={{ fontFamily: HF, fontWeight: 700, fontSize: 38, color: '#FFFFFF' }}>Al Noor Education</span>
      </div>
      <Headline from={S + 0.6} to={END + 1} align="center" top={470} dark title="Plan your child's future, one milestone at a time." />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center' }}>
        <span style={{ transform: `scale(${btn})`, opacity: Math.min(1, btn * 1.4), background: C.yel, color: C.ink, fontFamily: HF, fontWeight: 800, fontSize: 38, padding: '22px 44px', borderRadius: 999 }}>Start free at alnoor.qa</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center', gap: 8, fontFamily: BF, fontSize: 22, color: '#B9B2E8' }}>
        Powered by <span style={{ fontFamily: HF, fontWeight: 800, color: '#FFFFFF' }}>admit<span style={{ color: '#A99BFF' }}>profile</span></span>
      </div>
    </div>
  );
}

function Piece({ name }) {
  const { T, CUES } = useMotion();
  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, fontFamily: BF, color: C.ink, overflow: 'hidden' }}>
      <Backdrop />
      <Brand />
      <Headline from={0.4} to={CUES.Ask} align="center" top={150} kicker={`Meet ${name} · Grade 9`} title="Loves robotics. No idea what to study." />
      <HookChips />
      <Headline from={CUES.Ask + 0.2} to={CUES.Profiler} kicker="01 · Assistant" title="Just talk about your child." sub="Share what they enjoy. The assistant builds their profile as you chat." />
      <Headline from={CUES.Profiler + 0.2} to={CUES.CareerMap} kicker="02 · Profiler" title="See who they're becoming." sub="Strengths, interests and a profile score that grows with every activity." />
      <Headline from={CUES.CareerMap + 0.2} to={CUES.Milestones} kicker="03 · Career map" title="Explore every path." sub="Careers branch into majors and the universities that suit them." />
      <Headline from={CUES.Milestones + 0.2} to={CUES.Finale} kicker="04 · Milestones" title="Turn plans into progress." sub="A Grade 9 to 12 checklist, so nothing important is left to the last minute." />
      <Headline from={CUES.Finale + 0.5} to={CUES.CTA} align="center" top={110} kicker="Grade 12" title="From unsure to university-ready." />
      <Window>
        <AskPane name={name} />
        <ProfilerPane name={name} />
        <CareerMapPane name={name} />
        <MilestonesPane name={name} />
      </Window>
      <Finale />
      <Avatar />
      <CTA />
    </div>
  );
}

function ShowcaseApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, childName: 'Omar' });
  const name = (t.childName || 'Omar').trim() || 'Omar';
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0E0B26' }}>
      <CompositionStage width={VW} height={VH} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={C.bg}>
        <Piece name={name} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Video" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakText label="Child's name" value={t.childName} onChange={(v) => setTweak('childName', v)} />
      </TweaksPanel>
    </div>
  );
}

window.ShowcaseApp = ShowcaseApp;
