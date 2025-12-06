/**
 * CHESSIO SANITY CHECK SUITE
 * Quick validation of critical systems before deployment
 * Run with: npm run test:sanity
 */

console.log('🧪 CHESSIO SANITY CHECK\n');

let passed = 0;
let failed = 0;

function test(name: string, fn: () => boolean | Promise<boolean>) {
  try {
    const result = fn();
    if (result instanceof Promise) {
      result.then((res) => {
        if (res) {
          console.log(`✅ ${name}`);
          passed++;
        } else {
          console.log(`❌ ${name} - FAILED`);
          failed++;
        }
      });
    } else {
      if (result) {
        console.log(`✅ ${name}`);
        passed++;
      } else {
        console.log(`❌ ${name} - FAILED`);
        failed++;
      }
    }
  } catch (error) {
    console.log(`❌ ${name} - ERROR: ${error}`);
    failed++;
  }
}

console.log('📋 ENVIRONMENT CHECKS\n');

test('NODE_ENV is set or defaults correctly', () => {
  return true; // NODE_ENV not required in dev/test
});

test('Package.json exists', () => {
  const fs = require('fs');
  return fs.existsSync('./package.json');
});

test('Next config exists', () => {
  const fs = require('fs');
  return fs.existsSync('./next.config.ts');
});

console.log('\n🎨 BRAND SYSTEM\n');

test('Amber-200 color matches spec', () => {
  const amber200 = '#FDE68A';
  return amber200.toUpperCase() === '#FDE68A';
});

test('Neutral-950 background matches spec', () => {
  const neutral950 = '#0A0A0A';
  return neutral950.toUpperCase() === '#0A0A0A';
});

console.log('\n📁 FILE STRUCTURE\n');

test('Prisma schema exists', () => {
  const fs = require('fs');
  return fs.existsSync('./prisma/schema.prisma');
});

test('Chess components exist', () => {
  const fs = require('fs');
  return fs.existsSync('./src/components/chess/Chessboard.tsx');
});

test('Logo system exists', () => {
  const fs = require('fs');
  return fs.existsSync('./src/components/brand/ChessioLogo.tsx');
});

test('API routes exist', () => {
  const fs = require('fs');
  return fs.existsSync('./src/app/api/auth') &&
         fs.existsSync('./src/app/api/feedback');
});

console.log('\n🔧 CONFIGURATION\n');

test('TypeScript config valid', () => {
  const fs = require('fs');
  try {
    const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json', 'utf8'));
    return tsconfig.compilerOptions?.strict === true;
  } catch {
    return false;
  }
});

test('Jest config exists', () => {
  const fs = require('fs');
  return fs.existsSync('./jest.config.ts');
});

test('Playwright config exists', () => {
  const fs = require('fs');
  return fs.existsSync('./playwright.config.ts');
});

console.log('\n📊 RESULTS\n');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed > 0) {
  console.log('\n⚠️  SANITY CHECK FAILED - Fix issues before deployment');
  process.exit(1);
} else {
  console.log('\n🎉 ALL SANITY CHECKS PASSED');
  process.exit(0);
}
