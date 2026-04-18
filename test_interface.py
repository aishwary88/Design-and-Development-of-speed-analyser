#!/usr/bin/env python3
"""
Simple test script to verify the interface changes are working
"""

import requests
import webbrowser
import time

def test_interface():
    """Test if the new interface is loading correctly"""
    
    print("🚀 Testing Traffic Speed Analyser Interface...")
    
    # Test if Flask is running
    try:
        response = requests.get('http://localhost:5000', timeout=5)
        if response.status_code == 200:
            print("✅ Flask server is running")
            
            # Check if new CSS is being served
            if 'Traffic Speed Analyser' in response.text:
                print("✅ Main page is loading")
                
                # Check for futuristic styling indicators
                if '--primary-blue' in response.text or 'glassmorphism' in response.text.lower():
                    print("✅ New futuristic CSS detected in HTML")
                else:
                    print("⚠️  New CSS might not be loading - checking CSS file...")
                    
                    # Test CSS endpoint
                    css_response = requests.get('http://localhost:5000/static/style.css', timeout=5)
                    if '--primary-blue' in css_response.text:
                        print("✅ New futuristic CSS is available at /static/style.css")
                        print("💡 Try hard refresh (Ctrl+F5) in your browser to clear cache")
                    else:
                        print("❌ CSS file doesn't contain new styles")
                
                print("\n🌐 Opening browser to test interface...")
                webbrowser.open('http://localhost:5000')
                
                print("\n📋 Interface Test Checklist:")
                print("   □ Dark background with blue gradients")
                print("   □ Glassmorphism cards with blur effects") 
                print("   □ Neon blue/cyan text and accents")
                print("   □ Smooth hover animations on cards")
                print("   □ Modern typography (Inter font)")
                print("   □ Futuristic metric cards at the top")
                print("   □ Enhanced tab navigation")
                print("   □ Glowing buttons and effects")
                
                print("\n🔧 If you don't see changes:")
                print("   1. Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)")
                print("   2. Clear browser cache completely")
                print("   3. Try incognito/private browsing mode")
                print("   4. Check browser developer tools for CSS errors")
                
            else:
                print("❌ Unexpected page content")
        else:
            print(f"❌ Server returned status code: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Flask server")
        print("💡 Make sure Flask is running: python app.py")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_interface()