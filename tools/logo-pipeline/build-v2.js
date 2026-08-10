// Stage 3 iteration 2 — direction updated per Business Owner (concepts 2 × 3):
// geometric-soft letterforms, Ghain dot replaced with a perfect circle accent.
const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
const { Resvg } = require('@resvg/resvg-js');

const PLUM = '#2C2230';
const TERRACOTTA = '#D48C80';
const OUT = path.join(__dirname, '..', '..', 'docs', 'design', 'logo-concepts', 'vector');
const variable = fontkit.openSync(path.join(__dirname, 'Cairo-Variable.ttf'));

function contoursOf(glyph) {
  const cs = [];
  let cur = [];
  for (const c of glyph.path.commands) {
    if (c.command === 'moveTo') { if (cur.length) cs.push(cur); cur = [c]; }
    else { cur.push(c); if (c.command === 'closePath') { cs.push(cur); cur = []; } }
  }
  if (cur.length) cs.push(cur);
  return cs;
}
function bbox(contour) {
  let xs = [], ys = [];
  for (const c of contour) for (let i = 0; i + 1 < (c.args || []).length; i += 2) { xs.push(c.args[i]); ys.push(c.args[i + 1]); }
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}
function toD(contours) {
  let d = '';
  for (const contour of contours) for (const c of contour) {
    const a = c.args || [];
    if (c.command === 'moveTo') d += `M${a[0]} ${a[1]}`;
    else if (c.command === 'lineTo') d += `L${a[0]} ${a[1]}`;
    else if (c.command === 'quadraticCurveTo') d += `Q${a[0]} ${a[1]} ${a[2]} ${a[3]}`;
    else if (c.command === 'bezierCurveTo') d += `C${a[0]} ${a[1]} ${a[2]} ${a[3]} ${a[4]} ${a[5]}`;
    else if (c.command === 'closePath') d += 'Z';
  }
  return d;
}

// Shape رغد; strip the Ghain dot contour and report a circle to draw in its place.
function shapeArabic(weight) {
  const font = variable.getVariation({ wght: weight });
  const run = font.layout('رغد', { script: 'arab', language: 'ARA ', direction: 'rtl' });
  let x = 0;
  const paths = [];
  let dot = null;
  const ink = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  run.glyphs.forEach((g, i) => {
    const p = run.positions[i];
    let cs = contoursOf(g);
    if ((g.name || '').includes('FECF') || g.id === run.glyphs[1].id && i === 1) {
      // Ghain initial: the dot is the contour with the highest minY (topmost).
      const withB = cs.map(c => ({ c, b: bbox(c) }));
      withB.sort((a, b) => b.b.minY - a.b.minY);
      const cand = withB[0];
      const mainMaxY = Math.max(...withB.slice(1).map(w => w.b.maxY));
      if (cand.b.minY > mainMaxY * 0.65) {
        dot = {
          cx: x + p.xOffset + (cand.b.minX + cand.b.maxX) / 2,
          cy: (cand.b.minY + cand.b.maxY) / 2,
          r: Math.max(cand.b.maxX - cand.b.minX, cand.b.maxY - cand.b.minY) / 2 * 1.12,
        };
        cs = withB.slice(1).map(w => w.c);
      }
    }
    const d = toD(cs);
    if (d) {
      paths.push(`<path transform="translate(${x + p.xOffset} ${p.yOffset})" d="${d}"/>`);
      for (const c of cs) {
        const b = bbox(c);
        ink.minX = Math.min(ink.minX, b.minX + x + p.xOffset); ink.maxX = Math.max(ink.maxX, b.maxX + x + p.xOffset);
        ink.minY = Math.min(ink.minY, b.minY + p.yOffset); ink.maxY = Math.max(ink.maxY, b.maxY + p.yOffset);
      }
    }
    x += p.xAdvance;
  });
  if (dot) {
    ink.minY = Math.min(ink.minY, dot.cy - dot.r); ink.maxY = Math.max(ink.maxY, dot.cy + dot.r);
    ink.minX = Math.min(ink.minX, dot.cx - dot.r); ink.maxX = Math.max(ink.maxX, dot.cx + dot.r);
  }
  return { paths, dot, advance: x, ascent: font.ascent, descent: font.descent, upm: font.unitsPerEm, ink };
}

// Latin caption from Cairo's own Latin glyphs, manually letterspaced.
function shapeLatin(text, weight, tracking) {
  const font = variable.getVariation({ wght: weight });
  const run = font.layout(text);
  let x = 0;
  const paths = [];
  run.glyphs.forEach((g, i) => {
    const p = run.positions[i];
    const d = g.path.toSVG();
    if (d) paths.push(`<path transform="translate(${x + p.xOffset} ${p.yOffset})" d="${d}"/>`);
    x += p.xAdvance + tracking;
  });
  return { paths, advance: x - tracking };
}

function render(name, svg, widths) {
  fs.writeFileSync(path.join(OUT, `${name}.svg`), svg);
  for (const wpx of widths) {
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: wpx }, background: 'white' }).render().asPng();
    fs.writeFileSync(path.join(OUT, `${name}-${wpx}px.png`), png);
  }
}

const W = shapeArabic(800);
console.log('dot found:', !!W.dot, W.dot);

// V2 wordmark: plum letters, terracotta circular dot.
{
  const pad = W.upm * 0.1;
  const w = W.advance + pad * 2;
  const h = W.ascent - W.descent + pad * 2;
  const base = W.ascent + pad;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
  <g transform="translate(${pad} ${base}) scale(1 -1)">
    <g fill="${PLUM}">${W.paths.join('')}</g>
    ${W.dot ? `<circle cx="${W.dot.cx}" cy="${W.dot.cy}" r="${W.dot.r}" fill="${TERRACOTTA}"/>` : ''}
  </g>
</svg>`;
  render('raghad-wordmark-v2', svg, [1200, 96]);
}

// V2 seal: white letters + white circular dot on terracotta.
{
  const D = 1000, r = D / 2;
  const scale = (D * 0.6) / W.advance;
  const glyphH = (W.ascent - W.descent) * scale;
  const baseY = r + glyphH * 0.5 - Math.abs(W.descent) * scale - glyphH * 0.06;
  const startX = (D - W.advance * scale) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${D} ${D}">
  <circle cx="${r}" cy="${r}" r="${r}" fill="${TERRACOTTA}"/>
  <circle cx="${r}" cy="${r}" r="${r * 0.93}" fill="none" stroke="#FFFFFF" stroke-width="${D * 0.008}"/>
  <g transform="translate(${startX} ${baseY}) scale(${scale} ${-scale})">
    <g fill="#FFFFFF">${W.paths.join('')}</g>
    ${W.dot ? `<circle cx="${W.dot.cx}" cy="${W.dot.cy}" r="${W.dot.r}" fill="#FFFFFF"/>` : ''}
  </g>
</svg>`;
  render('raghad-seal-v2', svg, [1200, 64]);
}

// V2 stacked lockup: seal above, wordmark below, RAGHAD caption beneath.
// Layout is driven by measured ink bounds, not nominal font metrics.
{
  const L = shapeLatin('RAGHAD', 600, 180);
  const cw = 1400;
  const inkW = W.ink.maxX - W.ink.minX, inkH = W.ink.maxY - W.ink.minY;

  const sealD = 700, sealX = (cw - sealD) / 2, sealY = 60;
  const gap1 = 110, gap2 = 90;

  const wmScale = (cw * 0.62) / inkW;
  const wmTop = sealY + sealD + gap1;               // top edge of wordmark ink
  const wmX = (cw - inkW * wmScale) / 2 - W.ink.minX * wmScale;
  const wmBase = wmTop + W.ink.maxY * wmScale;      // SVG y of baseline (ink.maxY above baseline)

  const capScale = (cw * 0.22) / L.advance;
  const capH = 700 * capScale;
  const capTop = wmTop + inkH * wmScale + gap2;
  const capBase = capTop + capH;
  const capX = (cw - L.advance * capScale) / 2;

  const ch = capBase + 60;

  // Seal inner placement, also ink-driven.
  const sScale = (1000 * 0.60) / inkW;
  const sX = (1000 - inkW * sScale) / 2 - W.ink.minX * sScale;
  const sBase = 500 + (inkH * sScale) / 2 - (-W.ink.minY) * sScale * 0 + W.ink.maxY * sScale - inkH * sScale + (inkH * sScale) * 0; // baseline so ink is vertically centered
  const sBaseline = 500 - (inkH * sScale) / 2 + W.ink.maxY * sScale;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cw} ${ch}">
  <g transform="translate(${sealX} ${sealY}) scale(${sealD / 1000})">
    <circle cx="500" cy="500" r="500" fill="${TERRACOTTA}"/>
    <circle cx="500" cy="500" r="465" fill="none" stroke="#FFFFFF" stroke-width="8"/>
    <g transform="translate(${sX} ${sBaseline}) scale(${sScale} ${-sScale})">
      <g fill="#FFFFFF">${W.paths.join('')}</g>
      ${W.dot ? `<circle cx="${W.dot.cx}" cy="${W.dot.cy}" r="${W.dot.r}" fill="#FFFFFF"/>` : ''}
    </g>
  </g>
  <g transform="translate(${wmX} ${wmBase}) scale(${wmScale} ${-wmScale})">
    <g fill="${PLUM}">${W.paths.join('')}</g>
    ${W.dot ? `<circle cx="${W.dot.cx}" cy="${W.dot.cy}" r="${W.dot.r}" fill="${TERRACOTTA}"/>` : ''}
  </g>
  <g fill="${PLUM}" opacity="0.85" transform="translate(${capX} ${capBase}) scale(${capScale} ${-capScale})">
    ${L.paths.join('')}
  </g>
</svg>`;
  render('raghad-lockup-stacked-v2', svg, [900]);
}
console.log('v2 done');
