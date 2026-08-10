// Raghad logo pipeline — Stage 3: vector construction from Cairo glyph outlines.
// Shapes رغد through OpenType Arabic layout (positional forms by construction),
// then applies hybrid direction mods: circular Ghain dot, softened stem terminals,
// Reh-bowl embrace extension, seal + lockups. Never auto-traces raster.
const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
const { Resvg } = require('@resvg/resvg-js');

const WORD = 'رغد';
const LATIN = 'Raghad';
const PLUM = '#2C2230';
const TERRACOTTA = '#D48C80';
const WHITE = '#FFFFFF';
const OUT = path.join(__dirname, '..', '..', 'docs', 'design', 'logo-concepts', 'vector');
fs.mkdirSync(OUT, { recursive: true });

const variable = fontkit.openSync(path.join(__dirname, 'Cairo-Variable.ttf'));

function layoutWord(weight) {
  const font = variable.getVariation({ wght: weight });
  const run = font.layout(WORD, { script: 'arab', language: 'ARA ', direction: 'rtl' });
  let x = 0;
  const glyphs = run.glyphs.map((g, i) => {
    const p = run.positions[i];
    const item = {
      name: g.name || `gid${g.id}`,
      id: g.id,
      x,
      xAdvance: p.xAdvance,
      path: g.path.toSVG() || '',
      bbox: g.path.bbox,
    };
    x += p.xAdvance;
    return item;
  });
  return {
    glyphs,
    advance: x,
    upm: font.unitsPerEm,
    ascent: font.ascent,
    descent: font.descent,
  };
}

function layoutLatin(weight) {
  const font = variable.getVariation({ wght: weight });
  const run = font.layout(LATIN, { script: 'latn', language: 'ENG ', direction: 'ltr' });
  let x = 0;
  const paths = [];
  run.glyphs.forEach((g, i) => {
    const p = run.positions[i];
    const d = g.path.toSVG();
    if (d) paths.push(`<path transform="translate(${x + p.xOffset} ${p.yOffset})" d="${d}"/>`);
    x += p.xAdvance;
  });
  return { paths: paths.join('\n    '), advance: x, ascent: font.ascent, descent: font.descent };
}

/** Replace Cairo's square Ghain nuqta with a perfect circle. */
function circularizeGhainDot(svgPath) {
  const square = /M227\s+596L227\s+718L381\s+718L381\s+596Z/;
  if (!square.test(svgPath)) {
    console.warn('Ghain square-dot pattern not found; leaving path unchanged');
    return svgPath;
  }
  const cx = 304;
  const cy = 657;
  const r = 72;
  const circle =
    `M${cx} ${cy - r}` +
    `A${r} ${r} 0 1 1 ${cx} ${cy + r}` +
    `A${r} ${r} 0 1 1 ${cx} ${cy - r}Z`;
  return svgPath.replace(square, circle);
}

/** Round the flat top cap of Dal's upright. */
function softenDalTop(svgPath) {
  const flat = /L71\s+503L152\s+503/;
  if (!flat.test(svgPath)) {
    console.warn('Dal flat cap not found');
    return svgPath;
  }
  return svgPath.replace(flat, 'L71 459Q71 503 115 503L152 503');
}

/**
 * Construct Reh with softened top + extended calligraphic embrace bowl.
 * Coords are relative to the Reh glyph origin (as in the Cairo outline).
 * The bowl sweeps left under Ghain–Dal — Direction 1, built not traced.
 */
function rehWithEmbrace(rehX, advance, { compact = false } = {}) {
  const L = 125;
  const R = 278;
  const TOP = 503;
  const rad = 48;

  // Tip under the left of the word (absolute → Reh-relative).
  const tipAbsX = compact ? advance * 0.14 : advance * 0.04;
  const tipX = tipAbsX - rehX;
  const tipY = compact ? -250 : -280;
  const deepY = compact ? -320 : -400;
  const midAbsX = compact ? advance * 0.5 : advance * 0.4;
  const midX = midAbsX - rehX;
  const bowlT = compact ? 110 : 120;

  // Path: soft top → right stem → early-dipping crescent → round tip → return → left stem
  return [
    `M${L + rad} ${TOP}`,
    `L${R - rad} ${TOP}`,
    `Q${R} ${TOP} ${R} ${TOP - rad}`,
    `L${R} 60`,
    `C${R} -40 ${R - 80} -160 ${(midX + R) / 2} ${deepY + 60}`,
    `C${midX} ${deepY} ${(midX + tipX) / 2} ${deepY - 20} ${tipX} ${tipY}`,
    `C${tipX - bowlT * 0.65} ${tipY + 20} ${tipX - bowlT * 0.65} ${tipY + bowlT * 0.85} ${tipX} ${tipY + bowlT}`,
    `C${(midX + tipX) / 2 + 20} ${deepY + bowlT + 30} ${midX + 60} ${deepY + bowlT + 40} ${L + 20} 0`,
    `L${L} 60`,
    `L${L} ${TOP - rad}`,
    `Q${L} ${TOP} ${L + rad} ${TOP}`,
    'Z',
  ].join('');
}

/** Softened Reh without embrace — keeps Cairo's native short bowl, rounds top. */
function rehSoftOnly(originalPath) {
  // Soften top: L125 503L278 503 → rounded
  const flat = /L125\s+503L278\s+503/;
  if (!flat.test(originalPath)) {
    console.warn('Reh flat cap not found');
    return originalPath;
  }
  return originalPath.replace(flat, 'L125 455Q125 503 173 503L230 503Q278 503 278 455');
}

function modifiedGlyphPaths(layout, { embrace = true, compact = false } = {}) {
  // Drawn L→R: [0]=Dal final (uniFEAA), [1]=Ghain initial (uniFECF), [2]=Reh (uni0631)
  const [dal, ghain, reh] = layout.glyphs;
  if (!dal || !ghain || !reh) throw new Error('Expected 3 shaped glyphs for رغد');

  const dalPath = softenDalTop(dal.path);
  const ghainPath = circularizeGhainDot(ghain.path);
  const rehPath = embrace
    ? rehWithEmbrace(reh.x, layout.advance, { compact })
    : rehSoftOnly(reh.path);

  const parts = [
    `<path transform="translate(${dal.x} 0)" d="${dalPath}"/>`,
    `<path transform="translate(${ghain.x} 0)" d="${ghainPath}"/>`,
    `<path transform="translate(${reh.x} 0)" d="${rehPath}"/>`,
  ];

  return {
    paths: parts.join('\n    '),
    names: layout.glyphs.map((g) => g.name),
    minY: embrace ? (compact ? -360 : -460) : -280,
    maxY: 780,
  };
}

function boundsFor(layout, mod) {
  const padX = layout.upm * 0.1;
  const padY = layout.upm * 0.12;
  const minX = -padX;
  const maxX = layout.advance + padX;
  const minY = mod.minY - padY;
  const maxY = Math.max(layout.ascent, mod.maxY) + padY;
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

function wordmarkGroup(layout, mod, fill, { tx = 0, ty = 0, scale = 1 } = {}) {
  return `<g fill="${fill}" transform="translate(${tx} ${ty}) scale(${scale} ${-scale})">
    ${mod.paths}
  </g>`;
}

function wordmarkSVG(weight, color, opts = {}) {
  const layout = layoutWord(weight);
  const mod = modifiedGlyphPaths(layout, opts);
  const b = boundsFor(layout, mod);
  const baseline = b.maxY;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${b.w} ${b.h}">
  ${wordmarkGroup(layout, mod, color, { tx: -b.minX, ty: baseline, scale: 1 })}
</svg>`;
  return { svg, layout, mod, b, names: mod.names };
}

function sealContent(layout, mod, fill, D = 1000) {
  const b = boundsFor(layout, mod);
  const target = D * 0.7;
  const sc = Math.min(target / b.w, target / b.h);
  const cW = b.w * sc;
  const cH = b.h * sc;
  const sx = (D - cW) / 2;
  const sy = (D - cH) / 2 - D * 0.015;
  const bl = sy + b.maxY * sc;
  return wordmarkGroup(layout, mod, fill, {
    tx: sx - b.minX * sc,
    ty: bl,
    scale: sc,
  });
}

function sealSVG(weight, { embrace = true, compact = true, diameter = 1000 } = {}) {
  const layout = layoutWord(weight);
  const mod = modifiedGlyphPaths(layout, { embrace, compact });
  const D = diameter;
  const r = D / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${D} ${D}">
  <circle cx="${r}" cy="${r}" r="${r}" fill="${TERRACOTTA}"/>
  <circle cx="${r}" cy="${r}" r="${r * 0.93}" fill="none" stroke="${WHITE}" stroke-width="${D * 0.008}"/>
  ${sealContent(layout, mod, WHITE, D)}
</svg>`;
}

function sealGroupInline(weight, sealSize) {
  const layout = layoutWord(weight);
  const mod = modifiedGlyphPaths(layout, { embrace: true, compact: true });
  const sealScale = sealSize / 1000;
  return {
    layout,
    mod,
    markup: `<g transform="scale(${sealScale})">
    <circle cx="500" cy="500" r="500" fill="${TERRACOTTA}"/>
    <circle cx="500" cy="500" r="465" fill="none" stroke="${WHITE}" stroke-width="8"/>
    ${sealContent(layout, mod, WHITE, 1000)}
  </g>`,
  };
}

function lockupHorizontalSVG(weight) {
  const layout = layoutWord(weight);
  const mod = modifiedGlyphPaths(layout, { embrace: true, compact: false });
  const b = boundsFor(layout, mod);
  const latin = layoutLatin(500);

  const sealSize = Math.max(b.h * 0.92, 880);
  const gap = 200;
  const wmScale = 1;
  const wmW = b.w * wmScale;
  const wmH = b.h * wmScale;
  const latinScale = 0.22;
  const latinW = latin.advance * latinScale;
  const latinH = (latin.ascent - latin.descent) * latinScale;
  const captionGap = 80;

  const contentRightW = Math.max(wmW, latinW);
  const totalW = sealSize + gap + contentRightW + 140;
  const totalH = Math.max(sealSize, wmH + captionGap + latinH) + 140;
  const sealX = 70;
  const sealY = (totalH - sealSize) / 2;
  const rightX = sealX + sealSize + gap;
  const wmY = (totalH - (wmH + captionGap + latinH)) / 2;
  const baseline = wmY + b.maxY * wmScale;
  const latinBaseline = wmY + wmH + captionGap + latin.ascent * latinScale;
  const latinX = rightX + (contentRightW - latinW) / 2;

  const seal = sealGroupInline(weight, sealSize);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}">
  <g transform="translate(${sealX} ${sealY})">
    ${seal.markup}
  </g>
  ${wordmarkGroup(layout, mod, PLUM, { tx: rightX - b.minX * wmScale, ty: baseline, scale: wmScale })}
  <g fill="${PLUM}" transform="translate(${latinX} ${latinBaseline}) scale(${latinScale} ${-latinScale})">
    ${latin.paths}
  </g>
</svg>`;
}

function lockupStackedSVG(weight) {
  const layout = layoutWord(weight);
  const mod = modifiedGlyphPaths(layout, { embrace: true, compact: false });
  const b = boundsFor(layout, mod);
  const latin = layoutLatin(500);

  const sealSize = 700;
  const gap = 130;
  const wmScale = 0.82;
  const wmW = b.w * wmScale;
  const wmH = b.h * wmScale;
  const latinScale = 0.2;
  const latinW = latin.advance * latinScale;
  const latinH = (latin.ascent - latin.descent) * latinScale;
  const captionGap = 64;

  const totalW = Math.max(sealSize, wmW, latinW) + 160;
  const totalH = sealSize + gap + wmH + captionGap + latinH + 120;
  const cx = totalW / 2;

  const sealX = cx - sealSize / 2;
  const sealY = 60;
  const wmX = cx - wmW / 2;
  const wmY = sealY + sealSize + gap;
  const baseline = wmY + b.maxY * wmScale;
  const latinX = cx - latinW / 2;
  const latinBaseline = wmY + wmH + captionGap + latin.ascent * latinScale;

  const seal = sealGroupInline(weight, sealSize);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}">
  <g transform="translate(${sealX} ${sealY})">
    ${seal.markup}
  </g>
  ${wordmarkGroup(layout, mod, PLUM, { tx: wmX - b.minX * wmScale, ty: baseline, scale: wmScale })}
  <g fill="${PLUM}" transform="translate(${latinX} ${latinBaseline}) scale(${latinScale} ${-latinScale})">
    ${latin.paths}
  </g>
</svg>`;
}

function writeSVGandPNG(name, svg, widths, { transparent = false } = {}) {
  fs.writeFileSync(path.join(OUT, `${name}.svg`), svg, 'utf8');
  for (const wpx of widths) {
    const opts = { fitTo: { mode: 'width', value: wpx } };
    if (!transparent) opts.background = 'white';
    const png = new Resvg(svg, opts).render().asPng();
    fs.writeFileSync(path.join(OUT, `${name}-${wpx}px.png`), png);
  }
}

// --- Build candidates ---
const weight = 800;
const layout = layoutWord(weight);
console.log(`weight ${weight} glyph order (drawn L->R):`, layout.glyphs.map((g) => g.name).join(' | '));

const wm = wordmarkSVG(weight, PLUM, { embrace: true });
writeSVGandPNG('raghad-wordmark-hybrid-800', wm.svg, [1200, 96]);

const wmBare = wordmarkSVG(weight, PLUM, { embrace: false });
writeSVGandPNG('raghad-wordmark-soft-800', wmBare.svg, [1200, 96]);

writeSVGandPNG('raghad-seal-hybrid-800', sealSVG(weight, { embrace: true, compact: true }), [1200, 64]);

writeSVGandPNG('raghad-lockup-horizontal-800', lockupHorizontalSVG(weight), [1400, 200]);
writeSVGandPNG('raghad-lockup-stacked-800', lockupStackedSVG(weight), [1000, 200]);

// Legacy raw Cairo drafts (unmodified outlines) for comparison
for (const w of [700, 800]) {
  const raw = layoutWord(w);
  const pad = raw.upm * 0.08;
  const width = raw.advance + pad * 2;
  const height = raw.ascent - raw.descent + pad * 2;
  const baseline = raw.ascent + pad;
  const paths = raw.glyphs
    .map((g) => `<path transform="translate(${g.x} 0)" d="${g.path}"/>`)
    .join('\n    ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <g fill="${PLUM}" transform="translate(${pad} ${baseline}) scale(1 -1)">
    ${paths}
  </g>
</svg>`;
  writeSVGandPNG(`raghad-wordmark-${w}`, svg, [1200, 96]);
}

// Raw seal (no mods)
{
  const raw = layoutWord(800);
  const D = 1000;
  const targetW = D * 0.62;
  const scale = targetW / raw.advance;
  const glyphH = (raw.ascent - raw.descent) * scale;
  const baselineY = D / 2 + glyphH * 0.5 - Math.abs(raw.descent) * scale - glyphH * 0.06;
  const startX = (D - raw.advance * scale) / 2;
  const paths = raw.glyphs
    .map((g) => `<path transform="translate(${g.x} 0)" d="${g.path}"/>`)
    .join('\n    ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${D} ${D}">
  <circle cx="500" cy="500" r="500" fill="${TERRACOTTA}"/>
  <circle cx="500" cy="500" r="465" fill="none" stroke="${WHITE}" stroke-width="8"/>
  <g fill="${WHITE}" transform="translate(${startX} ${baselineY}) scale(${scale} ${-scale})">
    ${paths}
  </g>
</svg>`;
  writeSVGandPNG('raghad-seal-draft-800', svg, [1200, 64]);
}

console.log('done ->', OUT);
