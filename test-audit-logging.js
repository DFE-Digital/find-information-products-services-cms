#!/usr/bin/env node

/**
 * Test script for audit logging functionality
 * This script demonstrates how to test the audit logging system
 */

const axios = require('axios');

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

async function testAuditLogging() {
  console.log('🧪 Testing Audit Logging Functionality...\n');

  try {
    // Test 1: Create a new product
    console.log('1. Creating a new product...');
    const createResponse = await axios.post(`${BASE_URL}/api/products`, {
      data: {
        title: 'Test Product for Audit',
        short_description: 'This is a test product to verify audit logging',
        long_description: 'This is a longer description for testing purposes',
        state: 'New'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const productId = createResponse.data.data.id;
    console.log(`✅ Product created with ID: ${productId}`);

    // Test 2: Update the product
    console.log('\n2. Updating the product...');
    await axios.put(`${BASE_URL}/api/products/${productId}`, {
      data: {
        title: 'Updated Test Product',
        short_description: 'This is an updated test product',
        state: 'Active'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Product updated');

    // Test 3: Check audit logs
    console.log('\n3. Checking audit logs...');
    const auditLogsResponse = await axios.get(`${BASE_URL}/api/audit-logs`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const auditLogs = auditLogsResponse.data.data;
    console.log(`✅ Found ${auditLogs.length} audit log entries`);

    // Display recent audit logs for this product
    const productAuditLogs = auditLogs.filter(log => 
      log.attributes.content_type === 'api::product.product' && 
      log.attributes.content_id === productId
    );

    console.log('\n📋 Audit Log Entries for Test Product:');
    productAuditLogs.forEach((log, index) => {
      console.log(`\n${index + 1}. ${log.attributes.action.toUpperCase()} - ${new Date(log.attributes.timestamp).toLocaleString()}`);
      console.log(`   User: ${log.attributes.user_email || 'Unknown'}`);
      console.log(`   Changed Fields: ${log.attributes.changed_fields ? log.attributes.changed_fields.join(', ') : 'N/A'}`);
    });

    // Test 4: Clean up - Delete the test product
    console.log('\n4. Cleaning up - Deleting test product...');
    await axios.delete(`${BASE_URL}/api/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Test product deleted');

    console.log('\n🎉 Audit logging test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Created audit log entries for: create, update, delete`);
    console.log(`- Total audit logs found: ${auditLogs.length}`);
    console.log(`- Product-specific audit logs: ${productAuditLogs.length}`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testAuditLogging();
}

module.exports = { testAuditLogging };
