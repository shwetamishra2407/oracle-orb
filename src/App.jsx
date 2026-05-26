import { useEffect, useRef, useState } from 'react'

const MOODS = {
  sad:     { label:'melancholy',  oh:'#b8c8e8', oc:'#2a4a7a', od:'#050d1f', gs1:'rgba(40,80,160,0.45)',   gs2:'rgba(20,50,120,0.22)',  ringCol:['#b8d0ff','#8ab0e8','#c8d8f0','#a0c0f8','#dde8ff'], faerieCol:['#b8d0ff','#8ab0e8','#a8c8ff','#c0d8ff','#ddeeff'], fog:'rgba(20,40,120,0.18)', hum:180 },
  happy:   { label:'joyful',     oh:'#fff4a0', oc:'#e8a020', od:'#3d1a00', gs1:'rgba(255,200,60,0.55)',  gs2:'rgba(230,140,20,0.28)', ringCol:['#fff4a0','#ffd060','#ffe880','#ffb830','#ffffff'],  faerieCol:['#fff4a0','#ffd060','#ffe880','#ffb830','#ffeebb'], fog:'rgba(120,80,0,0.15)',  hum:528 },
  love:    { label:'loving',     oh:'#ffd0e8', oc:'#c0306a', od:'#400020', gs1:'rgba(220,80,140,0.5)',   gs2:'rgba(180,40,100,0.25)', ringCol:['#ffd0e8','#ffaad0','#ff80b8','#ffc0e0','#ffffff'],  faerieCol:['#ffd0e8','#ffaad0','#ffb8d8','#ffc8e4','#fff0f8'], fog:'rgba(120,20,60,0.18)',  hum:396 },
  mystery: { label:'mysterious', oh:'#a0f0f0', oc:'#086878', od:'#020e12', gs1:'rgba(20,160,180,0.45)',  gs2:'rgba(10,100,130,0.22)', ringCol:['#a0f0f0','#60d0d8','#80e8f0','#40c0d0','#c0f8ff'],  faerieCol:['#a0f0f0','#60d0d8','#80e8f0','#b0f4ff','#e0fdff'], fog:'rgba(0,80,100,0.18)',   hum:210 },
  angry:   { label:'fierce',     oh:'#ffb090', oc:'#b82010', od:'#250000', gs1:'rgba(220,60,20,0.55)',   gs2:'rgba(180,30,10,0.28)',  ringCol:['#ffb090','#ff7050','#ff9070','#ff5030','#ffd0c0'],  faerieCol:['#ffb090','#ff7050','#ff9070','#ffc0a0','#ffd8c8'], fog:'rgba(120,20,0,0.2)',    hum:150 },
  nature:  { label:'natural',    oh:'#b8f0b0', oc:'#1a7a2a', od:'#021008', gs1:'rgba(40,160,60,0.45)',   gs2:'rgba(20,120,40,0.22)',  ringCol:['#b8f0b0','#80d880','#a0e8a0','#60c860','#d8f8d0'],  faerieCol:['#b8f0b0','#80d880','#a0e8a0','#c8f0c0','#e0f8e0'], fog:'rgba(0,80,20,0.15)',    hum:341 },
  tech:    { label:'analytical', oh:'#a0c8ff', oc:'#1838c8', od:'#020818', gs1:'rgba(40,80,220,0.45)',   gs2:'rgba(20,50,180,0.22)',  ringCol:['#a0c8ff','#60a0ff','#80b8ff','#40a0ff','#d0e8ff'],  faerieCol:['#a0c8ff','#60a0ff','#80b8ff','#b0d0ff','#d0e8ff'], fog:'rgba(0,20,120,0.18)',   hum:432 },
  wisdom:  { label:'wise',       oh:'#f0d890', oc:'#a06010', od:'#201000', gs1:'rgba(200,140,30,0.45)',  gs2:'rgba(160,100,20,0.22)', ringCol:['#f0d890','#e0b840','#f0c860','#d0a020','#fff0b0'],  faerieCol:['#f0d890','#e0b840','#f0c860','#f8e0a0','#fff8d0'], fog:'rgba(100,60,0,0.15)',   hum:285 },
  neutral: { label:'awaiting',   oh:'#e8e0ff', oc:'#8b6ef5', od:'#2d1d7a', gs1:'rgba(120,90,255,0.3)',   gs2:'rgba(90,60,200,0.15)',  ringCol:['#ffffff','#e0d7ff','#c4b5fd','#a78bfa','#fde68a'],  faerieCol:['#e0d7ff','#c4b5fd','#fbcfe8','#fde68a','#bfdbfe','#d9f99d','#ffffff','#fecdd3','#a5f3fc','#f0abfc'], fog:'rgba(40,20,100,0.12)', hum:256 },
}

function detectMood(t) {
  t = t.toLowerCase()
  if (/\b(sad|grief|cry|miss|lost|lonely|heartbreak|depress|mourn|sorrow|hurt|pain|disappoint|cheat|betray|broke|broken)\b/.test(t)) return 'sad'
  if (/\b(happy|joy|excit|celebrat|wonderful|amazing|great|fantastic|beautiful|blessed|thrill)\b/.test(t)) return 'happy'
  if (/\b(love|romance|crush|partner|relation|heart|together|marriage|kiss|darling|soulmate|boyfriend|girlfriend)\b/.test(t)) return 'love'
  if (/\b(angry|rage|furious|hate|frustrat|annoy|mad|upset|betray|unfair|resent)\b/.test(t)) return 'angry'
  if (/\b(secret|hidden|mystery|unknown|strange|dark|dream|spirit|magic|myth|omen|fate|prophecy)\b/.test(t)) return 'mystery'
  if (/\b(nature|plant|animal|forest|ocean|earth|tree|flower|mountain|river|garden)\b/.test(t)) return 'nature'
  if (/\b(code|tech|program|ai|data|compute|machine|algorithm|software|science|math|physics)\b/.test(t)) return 'tech'
  if (/\b(why|meaning|exist|purpose|soul|conscious|reality|truth|universe|god|life|death|wisdom|ancient)\b/.test(t)) return 'wisdom'
  return 'neutral'
}

function hexLerp(a, b, t) {
  const p = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]
  const ca = p(a), cb = p(b)
  return '#' + ca.map((v,i) => Math.round(v+(cb[i]-v)*t).toString(16).padStart(2,'0')).join('')
}

function rgbaLerp(a, b, t) {
  const p = s => s.match(/[\d.]+/g).map(Number)
  const ca = p(a), cb = p(b)
  return `rgba(${ca.map((v,i) => i<3 ? Math.round(v+(cb[i]-v)*t) : +(v+(cb[i]-v)*t).toFixed(3)).join(',')})`
}

const RING_LAYERS = [
  { rx:112, ry:22, count:90,  speedMult:1.0  },
  { rx:130, ry:28, count:110, speedMult:0.82 },
  { rx:150, ry:35, count:130, speedMult:0.65 },
  { rx:172, ry:43, count:120, speedMult:0.5  },
]

function buildRings() {
  return RING_LAYERS.map(layer =>
    Array.from({ length: layer.count }, (_, i) => {
      const band = (Math.random() - 0.5) * 16
      return {
        angle:   (i / layer.count) * Math.PI * 2 + Math.random() * 0.04,
        speed:   (0.00013 + Math.random() * 0.00005) * layer.speedMult,
        rx:      layer.rx + band * 0.8,
        ry:      layer.ry + band * 0.18,
        r:       Math.random() < 0.1 ? Math.random()*2+1.1 : Math.random()*0.9+0.3,
        op:      0.4 + Math.random() * 0.6,
        ps:      0.5 + Math.random() * 1.8,
        pp:      Math.random() * Math.PI * 2,
        colIdx:  Math.floor(Math.random() * 5),
      }
    })
  )
}

function buildFaeries(mood) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2
    const radius = 185 + Math.random() * 50
    return {
      angle:      a,
      radius,
      baseRadius: radius,
      floatPhase: Math.random() * Math.PI * 2,
      floatSpd:   0.5 + Math.random() * 0.9,
      orbitSpd:   (0.0003 + Math.random() * 0.0004) * (Math.random() < 0.5 ? 1 : -1),
      r:          2.2 + Math.random() * 1.8,
      col:        mood.faerieCol[i % mood.faerieCol.length],
      alpha:      0.7 + Math.random() * 0.3,
      trailX:     [],
      trailY:     [],
      sparkles:   [],
      wingPhase:  Math.random() * Math.PI * 2,
    }
  })
}

function getZodiac(dob) {
  const d = new Date(dob)
  const day = d.getDate()
  const month = d.getMonth() + 1
  if ((month===3&&day>=21)||(month===4&&day<=19)) return '♈ Aries'
  if ((month===4&&day>=20)||(month===5&&day<=20)) return '♉ Taurus'
  if ((month===5&&day>=21)||(month===6&&day<=20)) return '♊ Gemini'
  if ((month===6&&day>=21)||(month===7&&day<=22)) return '♋ Cancer'
  if ((month===7&&day>=23)||(month===8&&day<=22)) return '♌ Leo'
  if ((month===8&&day>=23)||(month===9&&day<=22)) return '♍ Virgo'
  if ((month===9&&day>=23)||(month===10&&day<=22)) return '♎ Libra'
  if ((month===10&&day>=23)||(month===11&&day<=21)) return '♏ Scorpio'
  if ((month===11&&day>=22)||(month===12&&day<=21)) return '♐ Sagittarius'
  if ((month===12&&day>=22)||(month===1&&day<=19)) return '♑ Capricorn'
  if ((month===1&&day>=20)||(month===2&&day<=18)) return '♒ Aquarius'
  return '♓ Pisces'
}

// ── WELCOME SCREEN ──
function WelcomeScreen({ onEnter }) {
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, raf
    const stars = Array.from({length:120}, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random()*1.2+0.2,
      op: Math.random()*0.4+0.05,
      sp: 0.3+Math.random()*1.5,
      ph: Math.random()*Math.PI*2
    }))
    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)
    function loop(ts) {
      ctx.clearRect(0,0,W,H)
      stars.forEach(s => {
        const op = s.op*(0.4+0.6*Math.sin(ts*0.001*s.sp+s.ph))
        ctx.beginPath()
        ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2)
        ctx.fillStyle = `rgba(255,255,255,${op})`
        ctx.fill()
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'#07040f', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />

      {/* floating orb glow */}
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(120,90,255,0.15) 0%, transparent 70%)', animation:'pulse 4s ease-in-out infinite', top:'50%', left:'50%', transform:'translate(-50%,-60%)' }} />

      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', gap:24, opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(30px)', transition:'all 1.4s ease', textAlign:'center', padding:'2rem' }}>

        <div style={{ fontSize:'clamp(38px,8vw,58px)', marginBottom:8 }}>🔮</div>

        <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(28px,6vw,48px)', fontWeight:400, color:'rgba(255,255,255,0.92)', letterSpacing:'0.1em', lineHeight:1.2, margin:0 }}>
          The Oracle Orb
        </h1>

        <div style={{ width:60, height:1, background:'linear-gradient(to right, transparent, rgba(180,150,255,0.6), transparent)' }} />

        <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:'clamp(12px,2.5vw,15px)', color:'rgba(255,255,255,0.38)', letterSpacing:'0.18em', fontStyle:'italic', maxWidth:360, lineHeight:1.8 }}>
          Beyond the veil of time and space lies ancient wisdom waiting to be revealed
        </p>

        <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:'clamp(11px,2vw,13px)', color:'rgba(180,150,255,0.5)', letterSpacing:'0.12em', maxWidth:320, lineHeight:1.9 }}>
          The stars have aligned. The cosmos awaits your question. Enter, seeker, and let the oracle illuminate your path.
        </p>

        <button
          onClick={onEnter}
          style={{ marginTop:12, background:'rgba(120,90,255,0.12)', border:'1px solid rgba(180,150,255,0.35)', borderRadius:32, padding:'14px 44px', color:'rgba(255,255,255,0.85)', fontFamily:"'Cinzel',serif", fontSize:'clamp(12px,2.5vw,14px)', letterSpacing:'0.14em', cursor:'pointer', transition:'all 0.4s ease' }}
          onMouseEnter={e => { e.target.style.background='rgba(120,90,255,0.25)'; e.target.style.borderColor='rgba(180,150,255,0.7)'; e.target.style.boxShadow='0 0 30px rgba(120,90,255,0.3)' }}
          onMouseLeave={e => { e.target.style.background='rgba(120,90,255,0.12)'; e.target.style.borderColor='rgba(180,150,255,0.35)'; e.target.style.boxShadow='none' }}
        >
          ✦ Enter the Oracle ✦
        </button>

        <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:10, color:'rgba(255,255,255,0.15)', letterSpacing:'0.2em', textTransform:'uppercase', marginTop:8 }}>
          What the stars know, the orb shall speak
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Raleway:ital,wght@0,300;0,400;1,300&display=swap');
        @keyframes pulse { 0%,100%{transform:translate(-50%,-60%) scale(1);opacity:0.7} 50%{transform:translate(-50%,-60%) scale(1.1);opacity:1} }
      `}</style>
    </div>
  )
}

// ── REGISTRATION SCREEN ──
function RegistrationScreen({ onComplete }) {
  const [form, setForm] = useState({ name:'', dob:'', time:'', place:'' })
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const canvasRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, raf
    const stars = Array.from({length:100}, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random()*1+0.2,
      op: Math.random()*0.3+0.04,
      sp: 0.3+Math.random()*1.2,
      ph: Math.random()*Math.PI*2
    }))
    function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    function loop(ts) {
      ctx.clearRect(0,0,W,H)
      stars.forEach(s => {
        const op = s.op*(0.4+0.6*Math.sin(ts*0.001*s.sp+s.ph))
        ctx.beginPath(); ctx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(255,255,255,${op})`; ctx.fill()
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  function handleSubmit() {
    if (!form.name.trim()) { setError('The oracle needs your name, seeker.'); return }
    if (!form.dob) { setError('Your date of birth unlocks the stars.'); return }
    setError('')
    localStorage.setItem('oracle_user', JSON.stringify(form))
    onComplete(form)
  }

  const inputStyle = {
    width:'100%',
    background:'rgba(255,255,255,0.04)',
    border:'1px solid rgba(180,150,255,0.2)',
    borderRadius:10,
    padding:'13px 16px',
    color:'rgba(255,255,255,0.82)',
    fontFamily:"'Raleway',sans-serif",
    fontSize:14,
    outline:'none',
    transition:'border-color 0.3s, background 0.3s',
  }

  const labelStyle = {
    fontFamily:"'Cinzel',serif",
    fontSize:10,
    letterSpacing:'0.2em',
    color:'rgba(180,150,255,0.6)',
    textTransform:'uppercase',
    marginBottom:6,
    display:'block',
  }

  return (
    <div style={{ minHeight:'100vh', background:'#07040f', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', padding:'2rem 1.5rem' }}>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />

      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(120,90,255,0.08) 0%, transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:2, width:'100%', maxWidth:420, opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(20px)', transition:'all 1.2s ease' }}>

        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:28, marginBottom:12 }}>✦</div>
          <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(18px,4vw,24px)', fontWeight:400, color:'rgba(255,255,255,0.88)', letterSpacing:'0.08em', marginBottom:8 }}>
            Reveal Your Essence
          </h2>
          <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:12, color:'rgba(255,255,255,0.28)', letterSpacing:'0.12em', fontStyle:'italic' }}>
            The oracle reads your celestial blueprint
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          <div>
            <label style={labelStyle}>✦ Your Name</label>
            <input
              style={inputStyle}
              placeholder="What shall the oracle call you?"
              value={form.name}
              onChange={e => setForm({...form, name:e.target.value})}
              onFocus={e => { e.target.style.borderColor='rgba(180,150,255,0.5)'; e.target.style.background='rgba(255,255,255,0.07)' }}
              onBlur={e => { e.target.style.borderColor='rgba(180,150,255,0.2)'; e.target.style.background='rgba(255,255,255,0.04)' }}
            />
          </div>

          <div>
            <label style={labelStyle}>✦ Date of Birth</label>
            <input
              type="date"
              style={{ ...inputStyle, colorScheme:'dark' }}
              value={form.dob}
              onChange={e => setForm({...form, dob:e.target.value})}
              onFocus={e => { e.target.style.borderColor='rgba(180,150,255,0.5)'; e.target.style.background='rgba(255,255,255,0.07)' }}
              onBlur={e => { e.target.style.borderColor='rgba(180,150,255,0.2)'; e.target.style.background='rgba(255,255,255,0.04)' }}
            />
          </div>

          <div>
            <label style={labelStyle}>✦ Time of Birth <span style={{ opacity:0.4, fontSize:9 }}>(optional)</span></label>
            <input
              type="time"
              style={{ ...inputStyle, colorScheme:'dark' }}
              value={form.time}
              onChange={e => setForm({...form, time:e.target.value})}
              onFocus={e => { e.target.style.borderColor='rgba(180,150,255,0.5)'; e.target.style.background='rgba(255,255,255,0.07)' }}
              onBlur={e => { e.target.style.borderColor='rgba(180,150,255,0.2)'; e.target.style.background='rgba(255,255,255,0.04)' }}
            />
          </div>

          <div>
            <label style={labelStyle}>✦ Place of Birth <span style={{ opacity:0.4, fontSize:9 }}>(optional)</span></label>
            <input
              style={inputStyle}
              placeholder="City where you entered this world..."
              value={form.place}
              onChange={e => setForm({...form, place:e.target.value})}
              onFocus={e => { e.target.style.borderColor='rgba(180,150,255,0.5)'; e.target.style.background='rgba(255,255,255,0.07)' }}
              onBlur={e => { e.target.style.borderColor='rgba(180,150,255,0.2)'; e.target.style.background='rgba(255,255,255,0.04)' }}
            />
          </div>

          {error && (
            <p style={{ fontFamily:"'Cinzel',serif", fontSize:11, color:'rgba(255,150,150,0.8)', textAlign:'center', letterSpacing:'0.08em' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            style={{ marginTop:8, background:'rgba(120,90,255,0.15)', border:'1px solid rgba(180,150,255,0.4)', borderRadius:28, padding:'14px 28px', color:'rgba(255,255,255,0.85)', fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:'0.1em', cursor:'pointer', transition:'all 0.3s ease', width:'100%' }}
            onMouseEnter={e => { e.target.style.background='rgba(120,90,255,0.28)'; e.target.style.boxShadow='0 0 25px rgba(120,90,255,0.25)' }}
            onMouseLeave={e => { e.target.style.background='rgba(120,90,255,0.15)'; e.target.style.boxShadow='none' }}
          >
            ✦ Reveal My Destiny ✦
          </button>

          <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:10, color:'rgba(255,255,255,0.15)', textAlign:'center', letterSpacing:'0.12em' }}>
            Your secrets are sacred — stored only in your browser
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Raleway:ital,wght@0,300;0,400;1,300&display=swap');
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.6) sepia(1) saturate(2) hue-rotate(220deg); cursor:pointer; }
      `}</style>
    </div>
  )
}

// ── MAIN ORACLE ──
export default function App() {
  const [screen, setScreen]         = useState('welcome')
  const [userData, setUserData]     = useState(null)
  const [uiState, setUiState]       = useState('question')
  const [question, setQuestion]     = useState('')
  const [answer, setAnswer]         = useState('')
  const [displayText, setDisplayText] = useState('')
  const [moodLabel, setMoodLabel]   = useState('awaiting')
  const lastQRef = useRef('')

  // check localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem('oracle_user')
    if (saved) {
      const user = JSON.parse(saved)
      setUserData(user)
      setScreen('oracle')
    }
  }, [])

  const bgRef    = useRef(null)
  const orbCvRef = useRef(null)
  const frontRef = useRef(null)
  const orbElRef = useRef(null)
  const sceneRef = useRef(null)
  const appRef   = useRef(null)

  const ringsRef       = useRef(buildRings())
  const faeriesRef     = useRef(buildFaeries(MOODS.neutral))
  const activeMoodRef  = useRef(MOODS.neutral)
  const lockedMoodRef  = useRef(null)
  const gatherModeRef  = useRef(false)
  const gatherTRef     = useRef(0)
  const answerReadyRef = useRef(null)
  const revealDoneRef  = useRef(false)

  const orbOhRef   = useRef('#e8e0ff')
  const orbOcRef   = useRef('#8b6ef5')
  const orbOdRef   = useRef('#2d1d7a')
  const orbGs1Ref  = useRef('rgba(120,90,255,0.3)')
  const orbGs2Ref  = useRef('rgba(90,60,200,0.15)')
  const tgtOhRef   = useRef('#e8e0ff')
  const tgtOcRef   = useRef('#8b6ef5')
  const tgtOdRef   = useRef('#2d1d7a')
  const tgtGs1Ref  = useRef('rgba(120,90,255,0.3)')
  const tgtGs2Ref  = useRef('rgba(90,60,200,0.15)')
  const colorLockedRef = useRef(false)

  const fogColorRef    = useRef('rgba(40,20,100,0.12)')
  const tgtFogRef      = useRef('rgba(40,20,100,0.12)')
  const ripplesRef     = useRef([])
  const rippleColorRef = useRef('180,150,255')
  const doRevealRef    = useRef(null)
  const rafRef         = useRef(null)

  const audioRef     = useRef(null)
  const isPlayingRef = useRef(false)

  function fadeVolume(from, to, duration, onDone) {
    const audio = audioRef.current
    if (!audio) return
    const steps = 30, interval = duration/steps, diff = (to-from)/steps
    let current = from, count = 0
    const timer = setInterval(() => {
      current += diff; count++
      audio.volume = Math.max(0, Math.min(1, current))
      if (count >= steps) { clearInterval(timer); if (onDone) onDone() }
    }, interval)
  }

  function startHum() {
    if (isPlayingRef.current) return
    if (!audioRef.current) {
      audioRef.current = new Audio('/humm.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = 0
    }
    audioRef.current.play().catch(e => {
      console.log('Audio blocked:', e)
      document.addEventListener('click', () => audioRef.current?.play(), { once: true })
    })
    isPlayingRef.current = true
    fadeVolume(0, 0.18, 2000)
  }

  function fadeHum() {
    fadeVolume(audioRef.current?.volume || 0, 0, 2000, () => {
      audioRef.current?.pause()
      isPlayingRef.current = false
    })
  }

  function pulseHum() {
    fadeVolume(audioRef.current?.volume || 0, 0.35, 300, () => {
      fadeVolume(0.35, 0.18, 1000)
    })
  }

  function typewriterReveal(text) {
    setDisplayText('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayText(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, 28)
  }

  function setOrbTarget(moodKey) {
    if (colorLockedRef.current) return
    const m = MOODS[moodKey]
    tgtOhRef.current=m.oh; tgtOcRef.current=m.oc; tgtOdRef.current=m.od
    tgtGs1Ref.current=m.gs1; tgtGs2Ref.current=m.gs2; tgtFogRef.current=m.fog
  }

  function lockOrbColor() {
    colorLockedRef.current = true
    orbOhRef.current=tgtOhRef.current; orbOcRef.current=tgtOcRef.current
    orbOdRef.current=tgtOdRef.current; orbGs1Ref.current=tgtGs1Ref.current
    orbGs2Ref.current=tgtGs2Ref.current
  }

  function unlockOrbColor() {
    colorLockedRef.current = false
    const nm = MOODS.neutral
    tgtOhRef.current=nm.oh; tgtOcRef.current=nm.oc; tgtOdRef.current=nm.od
    tgtGs1Ref.current=nm.gs1; tgtGs2Ref.current=nm.gs2; tgtFogRef.current=nm.fog
  }

  function fireRipple() {
    const col = activeMoodRef.current.gs1.replace('rgba(','').replace(')','').split(',').slice(0,3).join(',')
    rippleColorRef.current = col
    ripplesRef.current = [
      { r:0, maxR:320, alpha:0.9, width:3.5, speed:5.5 },
      { r:0, maxR:280, alpha:0.6, width:2.0, speed:4.2, delay:80 },
      { r:0, maxR:240, alpha:0.4, width:1.2, speed:3.2, delay:160 },
    ]
  }

  useEffect(() => {
    if (screen !== 'oracle') return
    const bgCv  = bgRef.current
    const orbCv = orbCvRef.current
    const fCv   = frontRef.current
    const orbEl = orbElRef.current
    const app   = appRef.current
    if (!bgCv || !orbCv || !fCv || !orbEl || !app) return

    const bgCtx  = bgCv.getContext('2d')
    const orbCtx = orbCv.getContext('2d')
    const fCtx   = fCv.getContext('2d')
    let W, H, OX, OY
    const OR = 90

    function resize() {
      W = bgCv.width = orbCv.width = fCv.width = app.offsetWidth
      H = bgCv.height = orbCv.height = fCv.height = app.offsetHeight
      const ar = app.getBoundingClientRect()
      const sr = sceneRef.current.getBoundingClientRect()
      OX = sr.left - ar.left + sr.width/2
      OY = sr.top  - ar.top  + sr.height/2
    }
    resize()
    window.addEventListener('resize', resize)

    const bgStars = Array.from({length:80}, () => ({
      x:Math.random(), y:Math.random(),
      r:Math.random()*1+0.2, op:Math.random()*0.28+0.04,
      sp:0.3+Math.random()*1.2, ph:Math.random()*Math.PI*2,
    }))

    function drawFog() {
      fogColorRef.current = rgbaLerp(fogColorRef.current, tgtFogRef.current, 0.008)
      const grad = bgCtx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*0.7)
      grad.addColorStop(0, fogColorRef.current)
      grad.addColorStop(0.5, fogColorRef.current)
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      bgCtx.fillStyle = grad
      bgCtx.fillRect(0,0,W,H)
    }

    function drawRingLayer(ctx2, stars, front, ts, mood) {
      for (const s of stars) {
        s.angle += s.speed
        const sinA = Math.sin(s.angle), isFront = sinA >= 0
        if (front !== isFront) continue
        const x = OX + Math.cos(s.angle)*s.rx
        const y = OY + sinA*s.ry
        const depth = 0.3+0.7*((sinA+1)/2)
        const pulse = 0.5+0.5*Math.sin(ts*0.001*s.ps+s.pp)
        const a = s.op*pulse*depth*(front?1:0.45)
        const col = mood.ringCol[s.colIdx%mood.ringCol.length]
        const hex = Math.round(a*255).toString(16).padStart(2,'0')
        const grd = ctx2.createRadialGradient(x,y,0,x,y,s.r*3.8)
        grd.addColorStop(0, col+hex); grd.addColorStop(1, col+'00')
        ctx2.beginPath(); ctx2.arc(x,y,s.r*3.8,0,Math.PI*2)
        ctx2.fillStyle=grd; ctx2.fill()
        ctx2.beginPath(); ctx2.arc(x,y,s.r*(0.6+pulse*0.4),0,Math.PI*2)
        ctx2.fillStyle=col+hex; ctx2.fill()
      }
    }

    function drawFaerie(ctx2, f, ts) {
      if (gatherModeRef.current) {
        f.radius += (OR+30-f.radius)*0.022; f.angle += 0.009
      } else {
        f.radius += (f.baseRadius-f.radius)*0.018; f.angle += f.orbitSpd
      }
      const floatY = Math.sin(ts*0.001*f.floatSpd+f.floatPhase)*5
      const fx = OX+Math.cos(f.angle)*f.radius
      const fy = OY+Math.sin(f.angle)*f.radius*0.7+floatY
      f.trailX.push(fx); f.trailY.push(fy)
      if (f.trailX.length>20) { f.trailX.shift(); f.trailY.shift() }
      const pulse = 0.55+0.45*Math.sin(ts*0.001*f.floatSpd+f.floatPhase)
      const al = f.alpha*pulse

      for (let i=1;i<f.trailX.length;i++) {
        const tp=i/f.trailX.length
        ctx2.beginPath(); ctx2.arc(f.trailX[i],f.trailY[i],f.r*0.38*tp,0,Math.PI*2)
        ctx2.fillStyle=f.col+Math.round(al*tp*0.4*255).toString(16).padStart(2,'0'); ctx2.fill()
      }
      const halo=ctx2.createRadialGradient(fx,fy,0,fx,fy,f.r*8)
      halo.addColorStop(0,f.col+Math.round(al*0.45*255).toString(16).padStart(2,'0'))
      halo.addColorStop(1,f.col+'00')
      ctx2.beginPath(); ctx2.arc(fx,fy,f.r*8,0,Math.PI*2)
      ctx2.fillStyle=halo; ctx2.fill()

      ctx2.save(); ctx2.translate(fx,fy)
      const wp=Math.sin(ts*0.005+f.wingPhase)
      for (const side of [-1,1]) {
        ctx2.save(); ctx2.scale(side,1); ctx2.beginPath()
        ctx2.ellipse(f.r*1.1,-f.r*0.5,f.r*2*(0.75+wp*0.25),f.r*0.85,-0.4,0,Math.PI*2)
        ctx2.fillStyle=f.col+Math.round(al*0.2*255).toString(16).padStart(2,'0')
        ctx2.fill(); ctx2.restore()
      }
      ctx2.restore()
      ctx2.beginPath(); ctx2.arc(fx,fy,f.r,0,Math.PI*2)
      ctx2.fillStyle=f.col+Math.round(al*255).toString(16).padStart(2,'0'); ctx2.fill()
      ctx2.beginPath(); ctx2.arc(fx-f.r*0.28,fy-f.r*0.28,f.r*0.38,0,Math.PI*2)
      ctx2.fillStyle=`rgba(255,255,255,${al*0.75})`; ctx2.fill()

      if (gatherModeRef.current) {
        const distToOrb=Math.sqrt((fx-OX)**2+(fy-OY)**2)
        const proximity=Math.max(0,1-distToOrb/220)
        if (proximity>0.1) {
          const tx=OX+Math.cos(f.angle)*OR*0.85
          const ty=OY+Math.sin(f.angle)*OR*0.85*0.7
          const grad=ctx2.createLinearGradient(fx,fy,tx,ty)
          grad.addColorStop(0,f.col+Math.round(al*proximity*0.6*255).toString(16).padStart(2,'0'))
          grad.addColorStop(1,f.col+Math.round(al*proximity*0.05*255).toString(16).padStart(2,'0'))
          ctx2.beginPath(); ctx2.moveTo(fx,fy); ctx2.lineTo(tx,ty)
          ctx2.strokeStyle=grad; ctx2.lineWidth=0.5+proximity*2; ctx2.stroke()
          if (proximity>0.5&&Math.random()<0.15) {
            const sparkX=fx+(tx-fx)*Math.random(), sparkY=fy+(ty-fy)*Math.random()
            ctx2.beginPath(); ctx2.arc(sparkX,sparkY,Math.random()*1.5+0.3,0,Math.PI*2)
            ctx2.fillStyle=f.col+Math.round(proximity*180).toString(16).padStart(2,'0'); ctx2.fill()
          }
        }
      }

      if (Math.random()<0.07) f.sparkles.push({x:fx+(Math.random()-0.5)*14,y:fy+(Math.random()-0.5)*14,life:1,r:Math.random()*1.2+0.4,col:f.col})
      f.sparkles=f.sparkles.filter(s=>s.life>0.04)
      f.sparkles.forEach(s => {
        s.life-=0.035
        ctx2.beginPath(); ctx2.arc(s.x,s.y,s.r*s.life,0,Math.PI*2)
        ctx2.fillStyle=s.col+Math.round(s.life*200).toString(16).padStart(2,'0'); ctx2.fill()
      })
    }

    function updateOrbVisual() {
      if (!colorLockedRef.current) {
        const speed=gatherModeRef.current?0.012+gatherTRef.current*0.08:0.015
        orbOhRef.current=hexLerp(orbOhRef.current,tgtOhRef.current,speed)
        orbOcRef.current=hexLerp(orbOcRef.current,tgtOcRef.current,speed)
        orbOdRef.current=hexLerp(orbOdRef.current,tgtOdRef.current,speed)
        orbGs1Ref.current=rgbaLerp(orbGs1Ref.current,tgtGs1Ref.current,speed)
        orbGs2Ref.current=rgbaLerp(orbGs2Ref.current,tgtGs2Ref.current,speed)
      }
      const glowBoost=gatherModeRef.current?1+gatherTRef.current*1.8:1
      orbEl.style.background=`radial-gradient(circle at 38% 33%,${orbOhRef.current},${orbOcRef.current} 40%,${orbOdRef.current} 100%)`
      orbEl.style.boxShadow=`0 0 ${35*glowBoost}px ${10*glowBoost}px ${orbGs1Ref.current},0 0 ${70*glowBoost}px ${28*glowBoost}px ${orbGs2Ref.current},inset 0 0 28px rgba(0,0,0,0.3)`
    }

    function loop(ts) {
      bgCtx.clearRect(0,0,W,H); orbCtx.clearRect(0,0,W,H); fCtx.clearRect(0,0,W,H)
      bgStars.forEach(s => {
        const op=s.op*(0.5+0.5*Math.sin(ts*0.001*s.sp+s.ph))
        bgCtx.beginPath(); bgCtx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2)
        bgCtx.fillStyle=`rgba(255,255,255,${op})`; bgCtx.fill()
      })
      drawFog()
      const mood=lockedMoodRef.current||activeMoodRef.current
      ringsRef.current.forEach(layer=>drawRingLayer(orbCtx,layer,false,ts,mood))
      ringsRef.current.forEach(layer=>drawRingLayer(fCtx,layer,true,ts,mood))
      faeriesRef.current.forEach(f=>drawFaerie(fCtx,f,ts))

      if (ripplesRef.current.length>0) {
        ripplesRef.current=ripplesRef.current.filter(rp => {
          if (rp.delay&&rp.delay>0) { rp.delay-=16; return true }
          rp.r+=rp.speed
          const progress=rp.r/rp.maxR, alpha=rp.alpha*(1-progress)
          if (alpha<=0.01||rp.r>=rp.maxR) return false
          const col=rippleColorRef.current
          fCtx.beginPath(); fCtx.arc(OX,OY,rp.r,0,Math.PI*2)
          fCtx.strokeStyle=`rgba(${col},${alpha})`; fCtx.lineWidth=rp.width*(1-progress*0.5); fCtx.stroke()
          fCtx.beginPath(); fCtx.arc(OX,OY,rp.r,0,Math.PI*2)
          fCtx.strokeStyle=`rgba(${col},${alpha*0.25})`; fCtx.lineWidth=rp.width*4; fCtx.stroke()
          return true
        })
      }

      if (gatherModeRef.current) {
        gatherTRef.current=Math.min(gatherTRef.current+0.005,1)
        if (gatherTRef.current>0.9&&answerReadyRef.current&&!revealDoneRef.current) {
          revealDoneRef.current=true
          const text=answerReadyRef.current; answerReadyRef.current=null
          if (doRevealRef.current) doRevealRef.current(text)
        }
      }
      updateOrbVisual()
      rafRef.current=requestAnimationFrame(loop)
    }

    rafRef.current=requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize',resize) }
  }, [screen])

  useEffect(() => {
    doRevealRef.current = (text) => {
      lockedMoodRef.current=activeMoodRef.current
      lockOrbColor(); fireRipple(); pulseHum()
      setTimeout(() => {
        gatherModeRef.current=false
        setAnswer(text); setUiState('answer')
        setTimeout(()=>typewriterReveal(text),300)
      }, 600)
    }
  })

  async function askOrb() {
    if (!question.trim()||gatherModeRef.current) return
    lastQRef.current=question
    const moodKey=detectMood(question)
    activeMoodRef.current=MOODS[moodKey]
    colorLockedRef.current=false
    setMoodLabel(MOODS[moodKey].label)
    faeriesRef.current.forEach((f,i)=>{ f.col=MOODS[moodKey].faerieCol[i%MOODS[moodKey].faerieCol.length] })
    setOrbTarget(moodKey)
    gatherModeRef.current=true; gatherTRef.current=0
    answerReadyRef.current=null; revealDoneRef.current=false
    setUiState('gathering'); startHum()

    const zodiac = userData?.dob ? getZodiac(userData.dob) : ''
    const context = [
      userData?.name ? `The seeker's name is ${userData.name}.` : '',
      zodiac ? `Their zodiac sign is ${zodiac}.` : '',
      userData?.time ? `They were born at ${userData.time}.` : '',
      userData?.place ? `They were born in ${userData.place}.` : '',
    ].filter(Boolean).join(' ')

    try {
      const res = await fetch('/api/ask', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ question, context }),
      })
      const d = await res.json()
      answerReadyRef.current = d.answer || 'The cosmos withholds its answer...'
    } catch {
      answerReadyRef.current = 'The stars have gone quiet... try once more.'
    }
  }

  function goHome() {
    gatherModeRef.current=false; gatherTRef.current=0
    answerReadyRef.current=null; revealDoneRef.current=false
    lockedMoodRef.current=null; activeMoodRef.current=MOODS.neutral
    unlockOrbColor(); faeriesRef.current=buildFaeries(MOODS.neutral)
    setQuestion(''); setAnswer(''); setDisplayText('')
    setUiState('question'); setMoodLabel('awaiting'); fadeHum()
  }

  function tryAgain() {
    const q=lastQRef.current; goHome()
    setTimeout(()=>setQuestion(q),300)
  }

  function handleSignOut() {
    localStorage.removeItem('oracle_user')
    setUserData(null); setScreen('welcome')
    goHome()
  }

  if (screen === 'welcome') return <WelcomeScreen onEnter={() => setScreen('register')} />
  if (screen === 'register') return <RegistrationScreen onComplete={user => { setUserData(user); setScreen('oracle') }} />

  const pillStyle = {
    background:'rgba(255,255,255,0.055)', border:'1px solid rgba(255,255,255,0.13)',
    borderRadius:28, padding:'11px 28px', color:'rgba(255,255,255,0.72)',
    fontFamily:"'Cinzel',serif", fontSize:12, letterSpacing:'0.09em',
    cursor:'pointer', whiteSpace:'nowrap',
  }

  const zodiac = userData?.dob ? getZodiac(userData.dob) : ''

  return (
    <div ref={appRef} style={{ minHeight:'100vh', background:'#07040f', display:'flex', flexDirection:'column', alignItems:'center', position:'relative', overflow:'hidden', fontFamily:"'Raleway',sans-serif", paddingTop:'2rem' }}>

      <canvas ref={bgRef}    style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:1 }} />
      <canvas ref={orbCvRef} style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:2 }} />
      <canvas ref={frontRef} style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:6 }} />

      {/* top bar */}
      <div style={{ position:'relative', zIndex:8, width:'100%', maxWidth:500, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 1.5rem', marginBottom:'1rem' }}>
        <div>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:11, color:'rgba(255,255,255,0.55)', letterSpacing:'0.1em' }}>
            Welcome, {userData?.name || 'Seeker'}
          </p>
          {zodiac && <p style={{ fontFamily:"'Raleway',sans-serif", fontSize:10, color:'rgba(180,150,255,0.4)', letterSpacing:'0.08em' }}>{zodiac}</p>}
        </div>
        <button
          onClick={handleSignOut}
          style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'6px 14px', color:'rgba(255,255,255,0.3)', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.08em', cursor:'pointer' }}
        >
          Leave
        </button>
      </div>

      <div style={{ textAlign:'center', marginBottom:'1.2rem', position:'relative', zIndex:8 }}>
        <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(18px,5vw,25px)', fontWeight:400, color:'rgba(255,255,255,0.88)', letterSpacing:'0.08em', marginBottom:4 }}>
          The Oracle Orb
        </h1>
        <p style={{ fontSize:'clamp(9px,2.5vw,11px)', color:'rgba(255,255,255,0.28)', letterSpacing:'0.14em', fontStyle:'italic' }}>
          Ask with intention, and receive with an open heart
        </p>
      </div>

      <div ref={sceneRef} style={{ position:'relative', width:'min(320px,85vw)', height:'min(320px,85vw)', flexShrink:0, zIndex:4, marginBottom:'1.5rem', pointerEvents:'none' }}>
        <div style={{ position:'absolute', width:'75%', height:'75%', top:'50%', left:'50%', transform:'translate(-50%,-50%)', borderRadius:'50%', background:'radial-gradient(circle,rgba(120,90,255,0.09) 0%,transparent 70%)', animation:'softbreathe 5s ease-in-out infinite', pointerEvents:'none', zIndex:2 }} />
        <div ref={orbElRef} style={{ position:'absolute', width:'56%', height:'56%', top:'50%', left:'50%', transform:'translate(-50%,-50%)', borderRadius:'50%', zIndex:3 }} />
      </div>

      {uiState === 'question' && (
        <div style={{ position:'relative', zIndex:8, width:'100%', maxWidth:400, display:'flex', flexDirection:'column', alignItems:'center', gap:13, padding:'0 1.5rem' }}>
          <input
            value={question}
            onChange={e=>setQuestion(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&askOrb()}
            placeholder={`What weighs on your heart, ${userData?.name?.split(' ')[0] || 'seeker'}?`}
            style={{ width:'100%', background:'rgba(255,255,255,0.045)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:10, padding:'13px 18px', color:'rgba(255,255,255,0.78)', fontFamily:"'Raleway',sans-serif", fontSize:'clamp(12px,3.5vw,14px)', outline:'none', textAlign:'center' }}
          />
          <button onClick={askOrb} style={pillStyle}>Ask the Orb ✦</button>
        </div>
      )}

      {uiState === 'gathering' && (
        <div style={{ position:'relative', zIndex:8, textAlign:'center', padding:'0 1.5rem' }}>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:'0.28em', color:'rgba(255,255,255,0.25)', textTransform:'uppercase' }}>
            The faeries gather...
          </p>
        </div>
      )}

      {uiState === 'answer' && (
        <div style={{ position:'relative', zIndex:8, width:'100%', maxWidth:420, display:'flex', flexDirection:'column', alignItems:'center', gap:13, padding:'0 1.5rem' }}>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.28em', color:'rgba(255,255,255,0.28)', textTransform:'uppercase' }}>
            The Orb Speaks...
          </p>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(12px,3.2vw,13.5px)', lineHeight:2, color:'rgba(255,255,255,0.82)', textAlign:'center', letterSpacing:'0.03em', maxWidth:380, minHeight:80 }}>
            {displayText}<span style={{ opacity:displayText.length<answer.length?1:0, animation:'blink 0.8s infinite' }}>|</span>
          </p>
          <div style={{ display:'flex', gap:12, marginTop:4, flexWrap:'wrap', justifyContent:'center' }}>
            <button onClick={goHome}   style={pillStyle}>Ask Again</button>
            <button onClick={tryAgain} style={pillStyle}>Try Again</button>
          </div>
        </div>
      )}

      <p style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', fontFamily:"'Cinzel',serif", color:'rgba(180,150,255,0.35)', marginTop:'0.8rem', zIndex:8, position:'relative', paddingBottom:'1rem' }}>
        {moodLabel}
      </p>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Raleway:ital,wght@0,300;0,400;1,300&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#07040f; }
        @keyframes softbreathe { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.7} 50%{transform:translate(-50%,-50%) scale(1.07);opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        input::placeholder { color:rgba(255,255,255,0.2); }
        input:focus { border-color:rgba(180,140,255,0.4)!important; background:rgba(255,255,255,0.07)!important; }
        button:hover { opacity:0.85; }
        @media (max-width:480px) { button { padding:10px 18px!important; font-size:11px!important; } }
      `}</style>
    </div>
  )
}