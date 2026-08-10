// Production export — Approved logo system (Version A, seal word @ 70%).
// Business Owner lock: 2026-08-10. Do not regenerate without Director + Owner gate.
const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
const { Resvg } = require('@resvg/resvg-js');

const PLUM = '#2C2230';
const TERRACOTTA = '#D48C80';
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const ROOT = path.join(__dirname, '..', '..', 'docs', 'design', 'logo');
const DIRS = {
  root: ROOT,
  masters: path.join(ROOT, 'masters'),
  png: path.join(ROOT, 'png'),
  mono: path.join(ROOT, 'mono'),
  favicon: path.join(ROOT, 'favicon'),
};
Object.values(DIRS).forEach((d) => fs.mkdirSync(d, { recursive: true }));

const variable = fontkit.openSync(path.join(__dirname, 'Cairo-Variable.ttf'));

function contoursOf(glyph) {
  const cs = [];
  let cur = [];
  for (const c of glyph.path.commands) {
    if (c.command === 'moveTo') {
      if (cur.length) cs.push(cur);
      cur = [c];
    } else {
      cur.push(c);
      if (c.command === 'closePath') {
        cs.push(cur);
        cur = [];
      }
    }
  }
  if (cur.length) cs.push(cur);
  return cs;
}
function bbox(contour) {
  const xs = [];
  const ys = [];
  for (const c of contour) {
    for (let i = 0; i + 1 < (c.args || []).length; i += 2) {
      xs.push(c.args[i]);
      ys.push(c.args[i + 1]);
    }
  }
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}
function toD(contours) {
  let d = '';
  for (const contour of contours) {
    for (const c of contour) {
      const a = c.args || [];
      if (c.command === 'moveTo') d += `M${a[0]} ${a[1]}`;
      else if (c.command === 'lineTo') d += `L${a[0]} ${a[1]}`;
      else if (c.command === 'quadraticCurveTo') d += `Q${a[0]} ${a[1]} ${a[2]} ${a[3]}`;
      else if (c.command === 'bezierCurveTo') d += `C${a[0]} ${a[1]} ${a[2]} ${a[3]} ${a[4]} ${a[5]}`;
      else if (c.command === 'closePath') d += 'Z';
    }
  }
  return d;
}

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
    if (i === 1) {
      const withB = cs.map((c) => ({ c, b: bbox(c) }));
      withB.sort((a, b) => b.b.minY - a.b.minY);
      const cand = withB[0];
      const mainMaxY = Math.max(...withB.slice(1).map((w) => w.b.maxY));
      if (cand.b.minY > mainMaxY * 0.65) {
        dot = {
          cx: x + p.xOffset + (cand.b.minX + cand.b.maxX) / 2,
          cy: (cand.b.minY + cand.b.maxY) / 2,
          r: (Math.max(cand.b.maxX - cand.b.minX, cand.b.maxY - cand.b.minY) / 2) * 1.12,
        };
        cs = withB.slice(1).map((w) => w.c);
      }
    }
    const d = toD(cs);
    if (d) {
      paths.push(`<path transform="translate(${x + p.xOffset} ${p.yOffset})" d="${d}"/>`);
      for (const c of cs) {
        const b = bbox(c);
        ink.minX = Math.min(ink.minX, b.minX + x + p.xOffset);
        ink.maxX = Math.max(ink.maxX, b.maxX + x + p.xOffset);
        ink.minY = Math.min(ink.minY, b.minY + p.yOffset);
        ink.maxY = Math.max(ink.maxY, b.maxY + p.yOffset);
      }
    }
    x += p.xAdvance;
  });
  if (dot) {
    ink.minY = Math.min(ink.minY, dot.cy - dot.r);
    ink.maxY = Math.max(ink.maxY, dot.cy + dot.r);
    ink.minX = Math.min(ink.minX, dot.cx - dot.r);
    ink.maxX = Math.max(ink.maxX, dot.cx + dot.r);
  }
  return { paths, dot, advance: x, ascent: font.ascent, descent: font.descent, upm: font.unitsPerEm, ink };
}

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

function writeSvg(dir, name, svg) {
  fs.writeFileSync(path.join(dir, `${name}.svg`), svg);
}
function writePng(dir, name, svg, widths, { background } = {}) {
  for (const wpx of widths) {
    const opts = { fitTo: { mode: 'width', value: wpx } };
    if (background) opts.background = background;
    const png = new Resvg(svg, opts).render().asPng();
    fs.writeFileSync(path.join(dir, `${name}-${wpx}px.png`), png);
  }
}

const W = shapeArabic(800);
const L = shapeLatin('RAGHAD', 600, 180);
if (!W.dot) throw new Error('Ghain circular dot not extracted — aborting production export');
const inkW = W.ink.maxX - W.ink.minX;
const inkH = W.ink.maxY - W.ink.minY;
const SEAL_FILL = 0.7; // approved: 70% of inner ring diameter

function sealSvg({ fill, ring, letter, dot }) {
  const D = 1000;
  const r = D / 2;
  const ringR = r * 0.93;
  const scale = ((D * 0.93) * SEAL_FILL) / inkW;
  const startX = (D - inkW * scale) / 2 - W.ink.minX * scale;
  const baseY = r - (inkH * scale) / 2 + W.ink.maxY * scale;
  const ringEl = ring
    ? `<circle cx="${r}" cy="${r}" r="${ringR}" fill="none" stroke="${ring}" stroke-width="${D * 0.008}"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${D} ${D}">
  <circle cx="${r}" cy="${r}" r="${r}" fill="${fill}"/>
  ${ringEl}
  <g transform="translate(${startX} ${baseY}) scale(${scale} ${-scale})">
    <g fill="${letter}">${W.paths.join('')}</g>
    <circle cx="${W.dot.cx}" cy="${W.dot.cy}" r="${W.dot.r}" fill="${dot}"/>
  </g>
</svg>`;
}

function wordmarkSvg({ letter, dot, padRatio = 0.1 }) {
  const pad = W.upm * padRatio;
  const w = W.advance + pad * 2;
  const h = W.ascent - W.descent + pad * 2;
  const base = W.ascent + pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
  <g transform="translate(${pad} ${base}) scale(1 -1)">
    <g fill="${letter}">${W.paths.join('')}</g>
    <circle cx="${W.dot.cx}" cy="${W.dot.cy}" r="${W.dot.r}" fill="${dot}"/>
  </g>
</svg>`;
}

function sealInnerGroup(letter, dot) {
  const sScale = (1000 * 0.93 * SEAL_FILL) / inkW;
  const sX = (1000 - inkW * sScale) / 2 - W.ink.minX * sScale;
  const sBaseline = 500 - (inkH * sScale) / 2 + W.ink.maxY * sScale;
  return `<g transform="translate(${sX} ${sBaseline}) scale(${sScale} ${-sScale})">
      <g fill="${letter}">${W.paths.join('')}</g>
      <circle cx="${W.dot.cx}" cy="${W.dot.cy}" r="${W.dot.r}" fill="${dot}"/>
    </g>`;
}

function stackedSvg({ sealFill, ring, sealLetter, sealDot, wmLetter, wmDot, capFill }) {
  const cw = 1400;
  const sealD = 700;
  const sealX = (cw - sealD) / 2;
  const sealY = 60;
  const gap1 = 110;
  const gap2 = 90;
  const wmScale = (cw * 0.62) / inkW;
  const wmTop = sealY + sealD + gap1;
  const wmX = (cw - inkW * wmScale) / 2 - W.ink.minX * wmScale;
  const wmBase = wmTop + W.ink.maxY * wmScale;
  const capScale = (cw * 0.22) / L.advance;
  const capH = 700 * capScale;
  const capTop = wmTop + inkH * wmScale + gap2;
  const capBase = capTop + capH;
  const capX = (cw - L.advance * capScale) / 2;
  const ch = capBase + 60;
  const ringEl = ring
    ? `<circle cx="500" cy="500" r="465" fill="none" stroke="${ring}" stroke-width="8"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cw} ${ch}">
  <g transform="translate(${sealX} ${sealY}) scale(${sealD / 1000})">
    <circle cx="500" cy="500" r="500" fill="${sealFill}"/>
    ${ringEl}
    ${sealInnerGroup(sealLetter, sealDot)}
  </g>
  <g transform="translate(${wmX} ${wmBase}) scale(${wmScale} ${-wmScale})">
    <g fill="${wmLetter}">${W.paths.join('')}</g>
    <circle cx="${W.dot.cx}" cy="${W.dot.cy}" r="${W.dot.r}" fill="${wmDot}"/>
  </g>
  <g fill="${capFill}" opacity="0.85" transform="translate(${capX} ${capBase}) scale(${capScale} ${-capScale})">
    ${L.paths.join('')}
  </g>
</svg>`;
}

function horizontalSvg({ sealFill, ring, sealLetter, sealDot, wmLetter, wmDot, capFill }) {
  const sealD = 520;
  const gap = 80;
  const wmScale = 0.55;
  const wmW = inkW * wmScale;
  const wmH = inkH * wmScale;
  const capScale = (wmW * 0.42) / L.advance;
  const capH = 700 * capScale;
  const textBlockH = wmH + 50 + capH;
  const ch = Math.max(sealD, textBlockH) + 80;
  const sealY = (ch - sealD) / 2;
  const textX = 60 + sealD + gap;
  const textTop = (ch - textBlockH) / 2;
  const wmX = textX - W.ink.minX * wmScale;
  const wmBase = textTop + W.ink.maxY * wmScale;
  const capX = textX + (wmW - L.advance * capScale) / 2;
  const capBase = textTop + wmH + 50 + capH;
  const cw = textX + wmW + 60;
  const ringEl = ring
    ? `<circle cx="500" cy="500" r="465" fill="none" stroke="${ring}" stroke-width="8"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cw} ${ch}">
  <g transform="translate(60 ${sealY}) scale(${sealD / 1000})">
    <circle cx="500" cy="500" r="500" fill="${sealFill}"/>
    ${ringEl}
    ${sealInnerGroup(sealLetter, sealDot)}
  </g>
  <g transform="translate(${wmX} ${wmBase}) scale(${wmScale} ${-wmScale})">
    <g fill="${wmLetter}">${W.paths.join('')}</g>
    <circle cx="${W.dot.cx}" cy="${W.dot.cy}" r="${W.dot.r}" fill="${wmDot}"/>
  </g>
  <g fill="${capFill}" opacity="0.85" transform="translate(${capX} ${capBase}) scale(${capScale} ${-capScale})">
    ${L.paths.join('')}
  </g>
</svg>`;
}

// --- Full color masters ---
const seal = sealSvg({ fill: TERRACOTTA, ring: WHITE, letter: WHITE, dot: WHITE });
const wordmark = wordmarkSvg({ letter: PLUM, dot: TERRACOTTA });
const stacked = stackedSvg({
  sealFill: TERRACOTTA, ring: WHITE, sealLetter: WHITE, sealDot: WHITE,
  wmLetter: PLUM, wmDot: TERRACOTTA, capFill: PLUM,
});
const horizontal = horizontalSvg({
  sealFill: TERRACOTTA, ring: WHITE, sealLetter: WHITE, sealDot: WHITE,
  wmLetter: PLUM, wmDot: TERRACOTTA, capFill: PLUM,
});

writeSvg(DIRS.masters, 'raghad-seal', seal);
writeSvg(DIRS.masters, 'raghad-wordmark', wordmark);
writeSvg(DIRS.masters, 'raghad-lockup-stacked', stacked);
writeSvg(DIRS.masters, 'raghad-lockup-horizontal', horizontal);

writePng(DIRS.png, 'raghad-seal', seal, [1200, 512, 256, 128, 64], { background: 'white' });
writePng(DIRS.png, 'raghad-wordmark', wordmark, [1200, 600, 96], { background: 'white' });
writePng(DIRS.png, 'raghad-lockup-stacked', stacked, [1000, 500], { background: 'white' });
writePng(DIRS.png, 'raghad-lockup-horizontal', horizontal, [1400, 400], { background: 'white' });
// Transparent PNGs (no background)
writePng(DIRS.png, 'raghad-seal-transparent', seal, [512, 256, 128]);
writePng(DIRS.png, 'raghad-wordmark-transparent', wordmark, [600, 96]);

// --- Monochrome ---
const sealPlum = sealSvg({ fill: PLUM, ring: WHITE, letter: WHITE, dot: WHITE });
const sealBlack = sealSvg({ fill: BLACK, ring: WHITE, letter: WHITE, dot: WHITE });
// White disk + plum letters — for dark backgrounds (reversed / knockout presentation).
const sealKnockout = sealSvg({ fill: WHITE, ring: null, letter: PLUM, dot: PLUM });
const wordmarkPlum = wordmarkSvg({ letter: PLUM, dot: PLUM });
const wordmarkBlack = wordmarkSvg({ letter: BLACK, dot: BLACK });
const wordmarkWhite = wordmarkSvg({ letter: WHITE, dot: WHITE });

writeSvg(DIRS.mono, 'raghad-seal-plum', sealPlum);
writeSvg(DIRS.mono, 'raghad-seal-black', sealBlack);
writeSvg(DIRS.mono, 'raghad-seal-white-knockout', sealKnockout);
writeSvg(DIRS.mono, 'raghad-wordmark-plum', wordmarkPlum);
writeSvg(DIRS.mono, 'raghad-wordmark-black', wordmarkBlack);
writeSvg(DIRS.mono, 'raghad-wordmark-white', wordmarkWhite);

writePng(DIRS.mono, 'raghad-seal-plum', sealPlum, [512], { background: 'white' });
writePng(DIRS.mono, 'raghad-seal-black', sealBlack, [512], { background: 'white' });
writePng(DIRS.mono, 'raghad-seal-white-knockout', sealKnockout, [512], { background: PLUM });
writePng(DIRS.mono, 'raghad-wordmark-plum', wordmarkPlum, [600], { background: 'white' });
writePng(DIRS.mono, 'raghad-wordmark-black', wordmarkBlack, [600], { background: 'white' });
writePng(DIRS.mono, 'raghad-wordmark-white', wordmarkWhite, [600], { background: PLUM });

// --- Favicons from seal ---
writePng(DIRS.favicon, 'favicon', seal, [16, 32, 48, 180], { background: 'white' });
writePng(DIRS.favicon, 'apple-touch-icon', seal, [180], { background: 'white' });

console.log('Production export complete →', ROOT);
console.log('Seal fill ratio locked at', SEAL_FILL * 100 + '%');
