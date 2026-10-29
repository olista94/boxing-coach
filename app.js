'use strict';
const SOURCES = {
    guardia: { name: 'Guardia · numeración y combinaciones', url: 'https://guardiaboxing.app/boxing-combos/' },
    numbers: { name: 'Guardia · golpes 1–6', url: 'https://guardiaboxing.app/boxing-numbers/' },
    ar: { name: 'AR Boxing · combinaciones con defensa', url: 'https://arboxing.app/boxing-combos-with-defense/' },
    esprit: { name: 'Esprit Boxe · combinaciones y distancia', url: 'https://esprit-boxe.com/en/blogs/blog-esprit-boxe/types-of-punches-in-boxing' },
    os: { name: 'Boxing OS · progresión para principiantes', url: 'https://www.boxingatelier.com/magazine/boxing-combinations-beginners' }
};
// kind 'fuente': secuencia recogida explícitamente en el enlace. 'variante': ejercicio derivado, NO cita literal.
const C = [
    ['1-2', 1, 'guardia', 'fuente', 'Jab para medir la distancia y directo sin perder el equilibrio.'],
    ['1-1-2', 1, 'guardia', 'fuente', 'Recupera el primer jab antes del segundo.'],
    ['1-2-3', 1, 'guardia', 'fuente', 'Gira la cadera del directo al gancho adelantado.'],
    ['3-2', 1, 'guardia', 'fuente', 'Trabaja a media distancia; gancho corto y directo.'],
    ['2-3', 1, 'numbers', 'fuente', 'La rotación del directo prepara el gancho adelantado.'],
    ['1-2-1', 1, 'numbers', 'fuente', 'Recupera distancia con el jab final.'],
    ['1-2-1-2', 1, 'numbers', 'fuente', 'Mantén guardia y base durante los cuatro golpes.'],
    ['1-4', 2, 'guardia', 'fuente', 'Acércate sin abrir el gancho atrasado en exceso.'],
    ['1-2-3-2', 2, 'guardia', 'fuente', 'Alterna manos y recupera el centro al terminar.'],
    ['2-3-2', 2, 'esprit', 'fuente', 'Trabajo rítmico de rotación adelantada y atrasada.'],
    ['1-6', 2, 'numbers', 'fuente', 'Entra con jab y acorta distancia para el uppercut atrasado.'],
    ['5-2', 2, 'numbers', 'fuente', 'Uppercut adelantado a corta distancia y directo al salir.'],
    ['1-6-3', 2, 'esprit', 'fuente', 'Uppercut atrasado enlazado con gancho adelantado.'],
    ['1-2-ED-2', 2, 'ar', 'fuente', 'Tras el directo, simula un contraataque recto, esquiva a tu derecha y responde.'],
    ['1-2-3-RI', 2, 'ar', 'fuente', 'Tras el gancho, pasa bajo un gancho imaginario hacia izquierda.'],
    ['1-2-3-2-ED', 3, 'ar', 'fuente', 'Termina la serie apartando la cabeza de la línea del golpe recto imaginario.'],
    ['1-2-PL', 2, 'os', 'variante', 'Acaba la combinación saliendo con un paso lateral.'],
    ['1-1-2-ED', 2, 'ar', 'variante', 'Añade defensa tras doble jab y directo; simula una respuesta recta.'],
    ['1-2-3-PL', 2, 'os', 'variante', 'Gana ángulo después del gancho, sin cruzar los pies.'],
    ['1-2-ED-2-3', 3, 'ar', 'variante', 'Después de la esquiva y contraataque, enlaza un gancho adelantado.'],
    ['1-2-3-RI-3', 3, 'ar', 'variante', 'Tras rodar bajo el gancho imaginario, responde desde distancia corta.'],
    ['1-2-3-2-PL', 3, 'os', 'variante', 'Acaba la serie desplazándote fuera de la línea.'],
    ['1-6-3-RI', 3, 'esprit', 'variante', 'Añade una salida defensiva bajo un gancho imaginario.'],
    ['5-2-ED', 3, 'ar', 'variante', 'Tras el directo final, simula una respuesta recta y esquiva.'],
    ['2-3-2-PL', 3, 'esprit', 'variante', 'Después de enlazar el contraataque, cambia el ángulo de salida.'],
    ['1-2-RD-3', 3, 'ar', 'variante', 'Simula un gancho rival y pasa por debajo hacia tu derecha antes de contraatacar.'],
    ['1-2-EI-3', 3, 'ar', 'variante', 'Esquiva un recto imaginario hacia tu izquierda y entra con gancho.']
].map(([code, level, source, kind, note], i) => ({ id: i + 1, code, seq: code.split('-'), level, source, kind, note, defense: /ED|EI|RD|RI|PL/.test(code) }));
const DEF = { ED: 'Esquiva derecha', EI: 'Esquiva izquierda', RD: 'Rodar derecha', RI: 'Rodar izquierda', PL: 'Paso lateral' };
const $ = id => document.getElementById(id);
const settings = ['level', 'stance', 'defense', 'interval', 'roundTime', 'restTime', 'rounds'];
for (const s of settings) { try { const v = localStorage.getItem('bc_' + s); if (v && [...$(s).options].some(o => o.value === v)) $(s).value = v } catch { } }
let current = null, phase = 'ready', round = 1, remaining = + $('roundTime').value * 1000, phaseDuration = remaining, deadline = 0, ticker = null, comboDeadline = 0, shown = [];
const labelLevel = n => ['', 'BÁSICO', 'INTERMEDIO', 'AVANZADO'][n];
function nameFor(t) { if (DEF[t]) return DEF[t]; const names = ['', 'Jab', 'Directo', 'Gancho adelantado', 'Gancho atrasado', 'Uppercut adelantado', 'Uppercut atrasado']; let side = +t % 2 === 1 ? 'izquierda' : 'derecha'; if ($('stance').value === 'southpaw') side = side === 'izquierda' ? 'derecha' : 'izquierda'; return `${names[+t]} ${side}` }
function pool() { return C.filter(c => ($('level').value === 'all' || c.level === +$('level').value) && ($('defense').value === 'yes' || !c.defense)) }
function draw() { const a = pool(); if (!a.length) { $('comboNames').textContent = 'No hay combinaciones con estos filtros'; return } let options = a.filter(c => c.id !== current?.id && !shown.slice(-Math.min(a.length - 1, 5)).includes(c.id)); if (!options.length) options = a.filter(c => c.id !== current?.id); if (!options.length) options = a; current = options[Math.floor(Math.random() * options.length)]; shown.push(current.id); $('comboTag').textContent = 'COMBINACIÓN · ' + labelLevel(current.level); $('comboCount').textContent = String(current.id).padStart(2, '0'); $('comboSequence').replaceChildren(...current.seq.map(t => { let el = document.createElement('span'); el.className = 'move' + (DEF[t] ? ' def' : ''); el.textContent = t; el.title = nameFor(t); return el })); $('comboNames').textContent = current.seq.map(nameFor).join(' · '); if (window.BCTutorials) window.BCTutorials.currentCombo = current; $('comboNote').textContent = current.note + ' · ' + (current.kind === 'fuente' ? 'Secuencia documentada' : 'Variante de entrenamiento'); $('comboSource').href = SOURCES[current.source].url; $('comboSource').textContent = current.kind === 'fuente' ? 'Ver secuencia en fuente ↗' : 'Ver fundamento técnico ↗'; comboDeadline = performance.now() + Number($('interval').value) * 1000 }
function format(ms) { let s = Math.max(0, Math.ceil(ms / 1000)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0') }
function renderClock() { $('timer').textContent = format(remaining); $('progressBar').style.width = (phaseDuration ? 100 * remaining / phaseDuration : 0) + '%'; $('roundLabel').textContent = 'ASALTO ' + round + ' / ' + $('rounds').value; $('phase').textContent = { ready: 'PREPARADO', work: 'EN COMBATE', rest: 'DESCANSO', paused: 'PAUSADO', done: 'SESIÓN COMPLETADA' }[phase]; $('start').textContent = phase === 'work' || phase === 'rest' ? 'Ⅱ Pausar' : phase === 'paused' ? '▶ Continuar' : phase === 'done' ? '↺ Nueva sesión' : '▶ Iniciar'; $('hint').textContent = { ready: 'Pulsa iniciar para comenzar el asalto', work: 'Ejecuta la combinación y vuelve a la guardia', rest: 'Respira y recupera', paused: 'Cronómetro en pausa', done: 'Entrenamiento finalizado' }[phase] }
function enter(next) { phase = next; if (next === 'work') { phaseDuration = +$('roundTime').value * 1000; remaining = phaseDuration; draw() } else if (next === 'rest') { phaseDuration = +$('restTime').value * 1000; remaining = phaseDuration } else if (next === 'done') { remaining = 0; clearInterval(ticker); ticker = null } deadline = performance.now() + remaining; renderClock() }
function tick() { let now = performance.now(); remaining = Math.max(0, deadline - now); if (phase === 'work' && now >= comboDeadline) draw(); if (remaining <= 0) { if (phase === 'work') { if (round >= +$('rounds').value) enter('done'); else enter('rest') } else if (phase === 'rest') { round++; enter('work') } } renderClock() }
function startPause() { if (phase === 'done') { reset(); return } if (phase === 'work' || phase === 'rest') { remaining = Math.max(0, deadline - performance.now()); clearInterval(ticker); ticker = null; phase = 'paused'; renderClock(); return } if (phase === 'ready') { enter('work') } else if (phase === 'paused') { phase = previousPhase; deadline = performance.now() + remaining; comboDeadline = performance.now() + Math.min(comboTimeLeft, Number($('interval').value) * 1000) } if (!ticker) ticker = setInterval(tick, 100); renderClock() }
let previousPhase = 'work', comboTimeLeft = 0;
$('start').addEventListener('click', () => { if (phase === 'work' || phase === 'rest') { previousPhase = phase; comboTimeLeft = Math.max(0, comboDeadline - performance.now()) } startPause() });
function reset() { clearInterval(ticker); ticker = null; phase = 'ready'; round = 1; phaseDuration = +$('roundTime').value * 1000; remaining = phaseDuration; shown = []; draw(); renderClock() }
$('reset').addEventListener('click', reset); $('next').addEventListener('click', draw);
for (const s of settings) $(s).addEventListener('change', () => { try { localStorage.setItem('bc_' + s, $(s).value) } catch { } if (['level', 'defense', 'stance'].includes(s)) draw(); if (['roundTime', 'restTime', 'rounds'].includes(s)) reset(); if (s === 'interval') comboDeadline = performance.now() + Number($('interval').value) * 1000; if (s === 'stance') renderLibrary() });
function renderLibrary() { let filter = document.querySelector('.filter.active')?.dataset.filter || 'all'; let items = C.filter(c => filter === 'all' || filter === 'def' && c.defense || c.level === +filter); $('libraryList').replaceChildren(...items.map(c => { let d = document.createElement('article'); d.className = 'lib-item'; let top = document.createElement('div'); top.className = 'lib-top'; let code = document.createElement('strong'); code.className = 'lib-code'; code.textContent = c.code; let badge = document.createElement('span'); badge.className = 'lib-badge'; badge.textContent = labelLevel(c.level) + ' · ' + (c.kind === 'fuente' ? 'FUENTE' : 'VARIANTE'); top.append(code, badge); let desc = document.createElement('p'); desc.textContent = c.seq.map(nameFor).join(' → ') + ' · ' + c.note; let a = document.createElement('a'); a.href = SOURCES[c.source].url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = c.kind === 'fuente' ? 'Consultar secuencia ↗' : 'Consultar fundamento ↗'; d.append(top, desc, a); return d })) }
for (const b of document.querySelectorAll('.tab')) b.addEventListener('click', () => { document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === b)); document.querySelectorAll('.view').forEach(x => x.classList.toggle('active', x.id === b.dataset.tab)); if (b.dataset.tab === 'library') renderLibrary(); if (b.dataset.tab === 'tutorials' && window.BCTutorials) window.BCTutorials.render() });
for (const b of document.querySelectorAll('.filter')) b.addEventListener('click', () => { document.querySelectorAll('.filter').forEach(x => x.classList.toggle('active', x === b)); renderLibrary() });
function renderGuide() { $('punchGuide').replaceChildren(...[1, 2, 3, 4, 5, 6].map(i => { let d = document.createElement('div'); d.className = 'punch'; let n = document.createElement('b'); n.textContent = i; let t = document.createElement('span'); t.textContent = nameFor(String(i)); d.append(n, t); return d })); $('sources').replaceChildren(...Object.values(SOURCES).map(s => { let a = document.createElement('a'); a.className = 'source-link'; a.href = s.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = s.name + ' ↗'; return a })) }
$('stance').addEventListener('change', renderGuide);
function network() { $('network').textContent = navigator.onLine ? 'LISTO' : 'SIN CONEXIÓN' } window.addEventListener('online', network); window.addEventListener('offline', network); network(); renderGuide(); reset();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => { }));
