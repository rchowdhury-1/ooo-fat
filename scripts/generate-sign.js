/**
 * Generates a printable A4 menu QR-code sign for Ooo..FAT!
 * Output: public/images/menu-sign.png  (2480×3508 px @ 300 dpi)
 *
 * Run:  node scripts/generate-sign.js
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

/* ── Constants ───────────────────────────── */
const W = 2480;
const H = 3508;
const BORDER = 40;
const BORDER_W = 8;

const BG = "#0D0D0D";
const GOLD = "#E8B84B";
const CREAM = "#F5F5F0";
const MUTED = "#9A9A8A";

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "images", "menu-sign.png");
const LOGO = path.join(ROOT, "public", "images", "logo.jpeg");
const QR = path.join(ROOT, "public", "images", "qr-code-ooofat.png");

/* ── Hex → RGB ───────────────────────────── */
function hex(h) {
  const n = parseInt(h.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/* ── SVG text helpers ───────────────────── */
function svgText(x, y, text, opts = {}) {
  const {
    fill = CREAM,
    fontSize = 60,
    fontFamily = "sans-serif",
    fontWeight = "normal",
    letterSpacing = 0,
    anchor = "middle",
  } = opts;
  return `<text
    x="${x}" y="${y}"
    fill="${fill}"
    font-size="${fontSize}"
    font-family="${fontFamily}"
    font-weight="${fontWeight}"
    letter-spacing="${letterSpacing}"
    text-anchor="${anchor}"
    dominant-baseline="middle"
  >${text}</text>`;
}

/* ── Build SVG overlay ───────────────────── */
function buildSvg() {
  const cx = W / 2;

  // Outer border rect (inset by BORDER)
  const bx = BORDER;
  const by = BORDER;
  const bw = W - BORDER * 2;
  const bh = H - BORDER * 2;

  // Corner ornament lines (L-shaped, 80px arms)
  const arm = 80;
  const corners = [
    // top-left
    `M ${bx} ${by + arm} L ${bx} ${by} L ${bx + arm} ${by}`,
    // top-right
    `M ${bx + bw - arm} ${by} L ${bx + bw} ${by} L ${bx + bw} ${by + arm}`,
    // bottom-left
    `M ${bx} ${by + bh - arm} L ${bx} ${by + bh} L ${bx + arm} ${by + bh}`,
    // bottom-right
    `M ${bx + bw - arm} ${by + bh} L ${bx + bw} ${by + bh} L ${bx + bw} ${by + bh - arm}`,
  ];

  // Divider lines
  const divY1 = 860;  // below logo+brand block
  const divY2 = H - 560; // above footer block

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <!-- border -->
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}"
          fill="none" stroke="${GOLD}" stroke-width="${BORDER_W}" rx="24"/>

    <!-- corner ornaments -->
    ${corners.map((d) => `<path d="${d}" fill="none" stroke="${GOLD}" stroke-width="${BORDER_W}" stroke-linecap="square"/>`).join("\n")}

    <!-- dividers -->
    <line x1="${bx + 60}" y1="${divY1}" x2="${bx + bw - 60}" y2="${divY1}"
          stroke="${GOLD}" stroke-width="2" stroke-dasharray="12 8" opacity="0.4"/>
    <line x1="${bx + 60}" y1="${divY2}" x2="${bx + bw - 60}" y2="${divY2}"
          stroke="${GOLD}" stroke-width="2" stroke-dasharray="12 8" opacity="0.4"/>

    <!-- brand name -->
    ${svgText(cx, 680, "Ooo..FAT!", {
      fill: GOLD,
      fontSize: 200,
      fontFamily: "Georgia, serif",
      fontWeight: "bold",
    })}

    <!-- slogan -->
    ${svgText(cx, 810, "Smash the beef, turn up the flavour", {
      fill: MUTED,
      fontSize: 52,
      fontFamily: "sans-serif",
      fontWeight: "300",
      letterSpacing: 2,
    })}

    <!-- QR label -->
    ${svgText(cx, divY1 + 80, "SCAN TO VIEW OUR MENU", {
      fill: GOLD,
      fontSize: 58,
      fontFamily: "sans-serif",
      fontWeight: "700",
      letterSpacing: 10,
    })}

    <!-- hours -->
    ${svgText(cx, divY2 + 80, "Open 7 Days a Week  ·  6PM – 2AM", {
      fill: CREAM,
      fontSize: 64,
      fontFamily: "sans-serif",
      fontWeight: "600",
    })}

    <!-- address -->
    ${svgText(cx, divY2 + 200, "878 Kingsbury Rd, Birmingham B24 9PT", {
      fill: MUTED,
      fontSize: 52,
      fontFamily: "sans-serif",
    })}

    <!-- drive-thru only -->
    ${svgText(cx, divY2 + 310, "DRIVE-THRU ONLY", {
      fill: GOLD,
      fontSize: 48,
      fontFamily: "sans-serif",
      fontWeight: "700",
      letterSpacing: 10,
    })}

    <!-- website -->
    ${svgText(cx, divY2 + 430, "www.ooofat.com", {
      fill: GOLD,
      fontSize: 56,
      fontFamily: "sans-serif",
      fontWeight: "600",
      letterSpacing: 2,
    })}
  </svg>`;

  return Buffer.from(svg);
}

/* ── Main ───────────────────────────────── */
async function main() {
  console.log("Generating menu sign...");

  const { r, g, b } = hex(BG);

  // 1. Background
  const base = await sharp({
    create: { width: W, height: H, channels: 3, background: { r, g, b } },
  })
    .png()
    .toBuffer();

  // 2. Resize + composite logo (400×400, centred horizontally, top ~180px from top edge)
  const LOGO_SIZE = 400;
  const logoBuffer = await sharp(LOGO)
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: "cover" })
    .toBuffer();

  // 3. Resize QR code (900×900, centred)
  const QR_SIZE = 900;
  const qrBuffer = await sharp(QR)
    .resize(QR_SIZE, QR_SIZE, { fit: "contain", background: { r, g, b, alpha: 1 } })
    .toBuffer();

  // 4. Build SVG overlay
  const svgBuffer = buildSvg();

  // 5. Composite everything
  const logoLeft = Math.round((W - LOGO_SIZE) / 2);
  const logoTop = 180;
  const qrLeft = Math.round((W - QR_SIZE) / 2);
  // QR sits between the two dividers; divY1=860, divY2=H-560=2948
  // Centre of that zone: (860 + 2948) / 2 = 1904; QR centred there
  const qrTop = Math.round((860 + (H - 560)) / 2 - QR_SIZE / 2) + 80;

  const output = await sharp(base)
    .composite([
      { input: logoBuffer, left: logoLeft, top: logoTop },
      { input: svgBuffer, left: 0, top: 0 },
      { input: qrBuffer, left: qrLeft, top: qrTop },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, output);
  console.log(`Saved → ${OUT}`);
  console.log(`Size: ${(output.length / 1024 / 1024).toFixed(1)} MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
