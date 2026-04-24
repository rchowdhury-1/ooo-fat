/**
 * Generates a printable A4 menu QR-code sign for Ooo..FAT!
 * Output: public/images/menu-sign.png  (2480×3508 px @ 300 dpi)
 *
 * Run:  node scripts/generate-sign.js
 */

const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");
const fs = require("fs");

/* ── Paths ───────────────────────────────── */
const ROOT = path.join(__dirname, "..");
const FONT_PM = path.join(__dirname, "PermanentMarker-Regular.ttf");
const LOGO = path.join(ROOT, "public", "images", "logo.jpeg");
const QR = path.join(ROOT, "public", "images", "qr-code-ooofat.png");
const OUT = path.join(ROOT, "public", "images", "menu-sign.png");

/* ── Dimensions ──────────────────────────── */
const W = 2480;
const H = 3508;
const INSET = 40;
const BW = 8;

/* ── Colours ─────────────────────────────── */
const BG    = "#0D0D0D";
const GOLD  = "#E8B84B";
const CREAM = "#F5F5F0";
const MUTED = "#9A9A8A";

registerFont(FONT_PM, { family: "PermanentMarker" });

function mid(ctx, text, y) {
  ctx.fillText(text, W / 2, y);
}

function dashedLine(ctx, y) {
  ctx.save();
  ctx.strokeStyle = GOLD + "55";
  ctx.lineWidth = 2;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.moveTo(INSET + 80, y);
  ctx.lineTo(W - INSET - 80, y);
  ctx.stroke();
  ctx.restore();
}

async function main() {
  console.log("Generating menu sign…");

  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext("2d");

  /* ── Background ───────────────────────── */
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  /* ── Gold border ──────────────────────── */
  ctx.strokeStyle = GOLD;
  ctx.lineWidth   = BW;
  ctx.beginPath();
  ctx.roundRect(INSET, INSET, W - INSET * 2, H - INSET * 2, 28);
  ctx.stroke();

  /* ── Corner ornaments ─────────────────── */
  const arm = 100;
  ctx.lineWidth  = BW;
  ctx.lineCap    = "square";
  ctx.strokeStyle = GOLD;
  for (const [px, py, dx, dy] of [
    [INSET, INSET, 1, 1], [W - INSET, INSET, -1, 1],
    [INSET, H - INSET, 1, -1], [W - INSET, H - INSET, -1, -1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(px, py + dy * arm);
    ctx.lineTo(px, py);
    ctx.lineTo(px + dx * arm, py);
    ctx.stroke();
  }

  /* ──────────────────────────────────────
     TOP BRANDING — compact
  ────────────────────────────────────── */

  // Logo: 200px circle
  const LOGO_SIZE = 200;
  const LOGO_TOP  = 130;
  const logoImg   = await loadImage(LOGO);
  const lx        = (W - LOGO_SIZE) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(lx + LOGO_SIZE / 2, LOGO_TOP + LOGO_SIZE / 2, LOGO_SIZE / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(logoImg, lx, LOGO_TOP, LOGO_SIZE, LOGO_SIZE);
  ctx.restore();

  // Brand name — Permanent Marker, 150px
  ctx.font         = "150px PermanentMarker";
  ctx.fillStyle    = GOLD;
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  mid(ctx, "Ooo..FAT!", LOGO_TOP + LOGO_SIZE + 110);

  // Dashed divider below branding
  const DIV_TOP = LOGO_TOP + LOGO_SIZE + 210;
  dashedLine(ctx, DIV_TOP);

  /* ──────────────────────────────────────
     QR CODE — dominant, 64% of width
  ────────────────────────────────────── */

  const QR_SIZE = Math.round(W * 0.64); // 1587px ≈ 64%
  const QR_TOP  = DIV_TOP + 60;
  const qrImg   = await loadImage(QR);
  ctx.drawImage(qrImg, (W - QR_SIZE) / 2, QR_TOP, QR_SIZE, QR_SIZE);

  /* ──────────────────────────────────────
     "SCAN TO VIEW OUR MENU" — primary CTA
     sits directly below the QR code
  ────────────────────────────────────── */

  const CTA_Y = QR_TOP + QR_SIZE + 90;

  ctx.font         = "bold 96px sans-serif";
  ctx.fillStyle    = GOLD;
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  mid(ctx, "SCAN TO VIEW OUR MENU", CTA_Y);

  /* ──────────────────────────────────────
     FOOTER — secondary info, small
  ────────────────────────────────────── */

  const DIV_BOT = CTA_Y + 110;
  dashedLine(ctx, DIV_BOT);

  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";

  ctx.font      = "600 50px sans-serif";
  ctx.fillStyle = CREAM;
  mid(ctx, "Open 7 Days a Week  ·  6PM – 2AM", DIV_BOT + 76);

  ctx.font      = "400 42px sans-serif";
  ctx.fillStyle = MUTED;
  mid(ctx, "878 Kingsbury Rd, Birmingham B24 9PT  ·  Drive-Thru Only", DIV_BOT + 152);

  ctx.font      = "500 46px sans-serif";
  ctx.fillStyle = GOLD;
  mid(ctx, "www.ooofat.com", DIV_BOT + 232);

  /* ── Save ─────────────────────────────── */
  const buf = canvas.toBuffer("image/png");
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, buf);
  console.log(`Saved → ${OUT}`);
  console.log(`Size: ${(buf.length / 1024 / 1024).toFixed(1)} MB`);
  console.log(`QR size: ${QR_SIZE}px (${((QR_SIZE/W)*100).toFixed(0)}% of width)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
