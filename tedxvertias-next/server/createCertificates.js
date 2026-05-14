const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const categories = ['UnderGraduate', 'PostGraduate', 'Staff', 'Guest', 'Alumni'];

const certificatesDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true });
}

categories.forEach(category => {
  const width = 2000;
  const height = 1414; // A landscape orientation
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, width, height);
  
  // Border
  ctx.strokeStyle = '#EB0028';
  ctx.lineWidth = 20;
  ctx.strokeRect(40, 40, width - 80, height - 80);
  
  // Inner border
  ctx.strokeStyle = '#d4af37'; // Gold
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, width - 120, height - 120);
  
  // TEDx logo area
  ctx.fillStyle = '#EB0028';
  ctx.font = 'bold 120px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('TEDx', width / 2, 200);
  
  ctx.fillStyle = '#000';
  ctx.font = 'bold 100px Arial';
  ctx.fillText('VeritasUniversity', width / 2, 320);
  
  // Certificate title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 80px Montserrat';
  ctx.fillText('CERTIFICATE OF ATTENDANCE', width / 2, 500);
  
  // Category label
  ctx.fillStyle = '#EB0028';
  ctx.font = '30px Montserrat';
  ctx.fillText(category.toUpperCase(), width / 2, 570);
  
  // Name placeholder (will be filled programmatically)
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 100px Montserrat';
  ctx.fillText('[NAME]', width / 2, 750);
  
  // Date
  ctx.fillStyle = '#666';
  ctx.font = '30px Montserrat';
  ctx.fillText('May 16, 2026', width / 2, 900);
  
  ctx.fillText('Veritas University, Abuja, Nigeria', width / 2, 950);
  
  // Theme
  ctx.fillStyle = '#EB0028';
  ctx.font = 'bold 40px Montserrat';
  ctx.fillText('NEO-INTELLIGENCE', width / 2, 1100);
  
  ctx.fillStyle = '#666';
  ctx.font = '24px Montserrat';
  ctx.fillText('Shaping an Intelligent Africa Through Innovation and Culture', width / 2, 1150);
  
  // Footer
  ctx.fillStyle = '#999';
  ctx.font = '20px Montserrat';
  ctx.fillText('Licensed by TED • This certificate verifies attendance at TEDxVeritasUniversity', width / 2, height - 80);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(certificatesDir, `${category}.png`), buffer);
  console.log(`Created ${category}.png`);
});

// Also create a default Certificate.png
fs.copyFileSync(
  path.join(certificatesDir, 'Guest.png'),
  path.join(certificatesDir, 'Certificate.png')
);

console.log('All certificate templates created!');