// Raghad logo pipeline — Stage 3: vector construction from Cairo glyph outlines.
// Shapes the word رغد through the font's OpenType layout engine so Arabic
// positional forms are correct by construction, then assembles SVG masters.
const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
const { Resvg } = require('@resvg/resvg-js');

const WORD = 'رغد';
const PLUM = '#2C2230';
const TERRACOTTA = '#D48C80';
const OUT = path.join(__dirname, '..', '..', 'docs', 'design', 'logo-concepts', 'vector');
fs.mkdirSync(OUT, { recursive: true });

const variable = fontkit.openSync(path.join(__dirname, 'Cairo-Variable.ttf'));

function shape(weight) {
  const font = variable.getVariation({ wght: weight });
  const run = font.layout(WORD, { script: 'arab', language: 'ARA ', direction: 'rtl' });
  const upm = font.unitsPerEm;
  let x = 0;
  const parts = [];
  const names = [];
  run.glyphs.forEach((g, i) => {
    const p = run.positions[i];
    names.push(g.name || `gid${g.id}`);
    const d = g.path.toSVG();
    if (d) parts.push(`<path transform="translate(${x + p.xOffset} ${p.yOffset})" d="${d}"/>`);
    x += p.xAdvance;
  });
  return { paths: parts.join('\n    '), advance: x, upm, ascent: font.ascent, descent: font.descent, names };
}

// Wordmark SVG: glyphs drawn in font units, flipped to SVG Y-down space.
function wordmarkSVG(weight, color) {
  const s = shape(weight);
  const pad = s.upm * 0.08;
  const w = s.advance + pad * 2;
  const h = s.ascent - s.descent + pad * 2;
  const baseline = s.ascent + pad;
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
  <g fill="${color}" transform="translate(${pad} ${baseline}) scale(1 -1)">
    ${s.paths}
  </g>
</svg>`,
    names: s.names, w, h,
  };
}

// Seal draft: terracotta circle, white wordmark centered inside.
function sealSVG(weight) {
  const s = shape(weight);
  const D = 1000; // seal canvas
  const r = D / 2;
  const targetW = D * 0.62;
  const scale = targetW / s.advance;
  const glyphH = (s.ascent - s.descent) * scale;
  // Optical vertical centering: Arabic mass sits near the baseline; bias upward slightly.
  const baselineY = r + (glyphH * 0.5) - (Math.abs(s.descent) * scale) - glyphH * 0.06;
  const startX = (D - s.advance * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${D} ${D}">
  <circle cx="${r}" cy="${r}" r="${r}" fill="${TERRACOTTA}"/>
  <circle cx="${r}" cy="${r}" r="${r * 0.93}" fill="none" stroke="#FFFFFF" stroke-width="${D * 0.008}"/>
  <g fill="#FFFFFF" transform="translate(${startX} ${baselineY}) scale(${scale} ${-scale})">
    ${s.paths}
  </g>
</svg>`;
}

function writeSVGandPNG(name, svg, widths) {
  fs.writeFileSync(path.join(OUT, `${name}.svg`), svg);
  for (const wpx of widths) {
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: wpx }, background: 'white' }).render().asPng();
    fs.writeFileSync(path.join(OUT, `${name}-${wpx}px.png`), png);
  }
}

for (const weight of [700, 800]) {
  const wm = wordmarkSVG(weight, PLUM);
  console.log(`weight ${weight} glyph order (drawn L->R):`, wm.names.join(' | '));
  writeSVGandPNG(`raghad-wordmark-${weight}`, wm.svg, [1200, 96]);
}
writeSVGandPNG('raghad-seal-draft-800', sealSVG(800), [1200, 64]);
console.log('done ->', OUT);
