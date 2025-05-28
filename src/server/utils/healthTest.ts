
import prisma from '../lib/prisma';

export async function runProductionTests() {
  console.log('🧪 Running production health tests...');
  
  const tests = [];
  
  // Test 1: Database Connection
  try {
    await prisma.user.count();
    tests.push({ name: 'Database Connection', status: 'PASS' });
  } catch (error) {
    tests.push({ name: 'Database Connection', status: 'FAIL', error: error.message });
  }
  
  // Test 2: Environment Variables
  const requiredEnvs = ['DATABASE_URL', 'JWT_SECRET'];
  const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
  
  if (missingEnvs.length === 0) {
    tests.push({ name: 'Environment Variables', status: 'PASS' });
  } else {
    tests.push({ name: 'Environment Variables', status: 'FAIL', error: `Missing: ${missingEnvs.join(', ')}` });
  }
  
  // Test 3: Authentication System
  try {
    const testUser = await prisma.user.findFirst();
    tests.push({ name: 'Authentication System', status: testUser ? 'PASS' : 'WARN' });
  } catch (error) {
    tests.push({ name: 'Authentication System', status: 'FAIL', error: error.message });
  }
  
  // Test 4: Event System
  try {
    const eventCount = await prisma.eventLog.count();
    tests.push({ name: 'Event System', status: 'PASS', info: `${eventCount} events logged` });
  } catch (error) {
    tests.push({ name: 'Event System', status: 'FAIL', error: error.message });
  }
  
  console.log('\n📊 Production Test Results:');
  console.log('='.repeat(50));
  
  tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : test.status === 'WARN' ? '⚠️' : '❌';
    console.log(`${icon} ${test.name}: ${test.status}`);
    if (test.error) console.log(`   Error: ${test.error}`);
    if (test.info) console.log(`   Info: ${test.info}`);
  });
  
  const failedTests = tests.filter(t => t.status === 'FAIL');
  
  if (failedTests.length === 0) {
    console.log('\n🎉 All tests passed! System ready for production.');
  } else {
    console.log(`\n⚠️ ${failedTests.length} test(s) failed. Please fix before deploying.`);
  }
  
  return tests;
}
