async function testLogin() {
  console.log('🧪 TESTING LOGIN API DIRECTLY...\n')
  
  const requestBody = {
    email: 'demo@coaching.com',
    password: 'Demo123!@#',
    remember: false
  }

  console.log('📤 Request:', JSON.stringify(requestBody, null, 2))

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Test-Script',
      'Cookie': 'session=test'
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    console.log('📥 Response Status:', response.status)
    console.log('📄 Response Headers:', Object.fromEntries(response.headers.entries()))
    console.log('📦 Response Body:', JSON.stringify(data, null, 2))

    if (data.success) {
      console.log('✅ LOGIN SUCCEEDED')
      console.log('   User:', data.user?.email)
      console.log('   Token (first 20 chars):', data.user ? 'Not included' : 'N/A')
      
      const cookies = response.headers.getSetCookie()
      if (cookies) {
        console.log('🍪 Cookies Set:', cookies)
      }
    } else {
      console.log('❌ LOGIN FAILED')
      console.log('   Error:', data.error)
    }
  } catch (error) {
    console.error('❌ REQUEST ERROR:', error)
  }
}

testLogin()
