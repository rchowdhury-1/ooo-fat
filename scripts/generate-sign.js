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

/* ── Colours ─────────────────────────────── */
const BG = "#0D0D0D";
const GOLD = "#E8B84B";
const CREAM = "#F5F5F0";
const MUTED = "#9A9A8A";

/* ── Register fonts ──────────────────────── */
registerFont(FONT_PM, { family: "PermanentMarker" });

/* ── Helpers ─────────────────────────────── */
function centredText(ctx, text, y) {
  ctx.fillText(text, W / 2, y);
}

async function main() {
  console.log("Generating menu sign…");

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  /* ── Background ─────────────────────────── */
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  /* ── Gold border ─────────────────────────── */
  const INSET = 40;
  const BW = 8;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = BW;
  ctx.beginPath();
  ctx.roundRect(INSET, INSET, W - INSET * 2, H - INSET * 2, 24);
  ctx.stroke();

  /* ── Corner ornaments (L-shapes) ─────────── */
  const arm = 90;
  const cx1 = INSET, cy1 = INSET;
  const cx2 = W - INSET, cy2 = INSET;
  const cx3 = INSET, cy3 = H - INSET;
  const cx4 = W - INSET, cy4 = H - INSET;

  ctx.lineWidth = BW;
  ctx.strokeStyle = GOLD;
  ctx.lineCap = "square";

  for (const [px, py, dx, dy] of [
    [cx1, cy1, 1, 1],
    [cx2, cy2, -1, 1],
    [cx3, cy3, 1, -1],
    [cx4, cy4, -1, -1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(px, py + dy * arm);
    ctx.lineTo(px, py);
    ctx.lineTo(px + dx * arm, py);
    ctx.stroke();
  }

  /* ── Logo ────────────────────────────────── */
  const LOGO_SIZE = 380;
  const LOGO_TOP = 190;
  const logoImg = await loadImage(LOGO);
  const lx = (W - LOGO_SIZE) / 2;
  // circular clip
  ctx.save();
  ctx.beginPath();
  ctx.arc(lx + LOGO_SIZE / 2, LOGO_TOP + LOGO_SIZE / 2, LOGO_SIZE / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(logoImg, lx, LOGO_TOP, LOGO_SIZE, LOGO_SIZE);
  ctx.restore();

  /* ── Brand name (Permanent Marker) ───────── */
  ctx.font = "bold 220px PermanentMarker";
  ctx.fillStyle = GOLD;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  centredText(ctx, "Ooo..FAT!", LOGO_TOP + LOGO_SIZE + 155);

  /* ── Slogan ──────────────────────────────── */
  ctx.font = "300 52px sans-serif";
  ctx.fillStyle = MUTED;
  centredText(ctx, "Smash the beef, turn up the flavour", LOGO_TOP + LOGO_SIZE + 320);

  /* ── Divider 1 ───────────────────────────── */
  const DIV1 = LOGO_TOP + LOGO_SIZE + 420;
  ctx.strokeStyle = `${GOLD}66`;
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  ctx.moveTo(INSET + 60, DIV1);
  ctx.lineTo(W - INSET - 60, DIV1);
  ctx.stroke();
  ctx.setLineDash([]);

  /* ── "Scan to view" label ────────────────── */
  ctx.font = "700 60px sans-serif";
  ctx.fillStyle = GOLD;
  ctx.letterSpacing = "10px";
  centredText(ctx, "SCAN TO VIEW OUR MENU", DIV1 + 90);

  /* ── QR code ─────────────────────────────── */
  const QR_SIZE = 920;
  const qrImg = await loadImage(QR);
  const DIV2 = H - 560;
  const qrMidY = (DIV1 + DIV2) / 2;
  const qrTop = qrMidY - QR_SIZE / 2 + 60;
  ctx.drawImage(qrImg, (W - QR_SIZE) / 2, qrTop, QR_SIZE, QR_SIZE);

  /* ── Divider 2 ───────────────────────────── */
  ctx.strokeStyle = `${GOLD}66`;
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  ctx.moveTo(INSET + 60, DIV2);
  ctx.lineTo(W - INSET - 60, DIV2);
  ctx.stroke();
  ctx.setLineDash([]);

  /* ── Footer text ─────────────────────────── */
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = "600 70px sans-serif";
  ctx.fillStyle = CREAM;
  centredText(ctx, "Open 7 Days a Week  ·  6PM – 2AM", DIV2 + 95);

  ctx.font = "400 52px sans-serif";
  ctx.fillStyle = MUTED;
  centredText(ctx, "878 Kingsbury Rd, Birmingham B24 9PT", DIV2 + 210);

  ctx.font = "700 50px sans-serif";
  ctx.fillStyle = GOLD;
  centredText(ctx, "DRIVE-THRU ONLY", DIV2 + 320);

  ctx.font = "600 58px sans-serif";
  ctx.fillStyle = GOLD;
  centredText(ctx, "www.ooofat.com", DIV2 + 430);

  /* ── Save ────────────────────────────────── */
  const buf = canvas.toBuffer("image/png");
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, buf);
  console.log(`Saved → ${OUT}`);
  console.log(`Size: ${(buf.length / 1024 / 1024).toFixed(1)} MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
