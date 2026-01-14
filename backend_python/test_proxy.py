import requests
import os
import sys

# Proxy from user request
PROXY_URL = "http://PoV957:6JxUgm@161.0.10.157:8000"
TEST_URL = "https://api.ipify.org?format=json"

def test_proxy(proxy_url, description):
    print(f"--- Testing {description} ---")
    print(f"Proxy URL: {proxy_url}")
    proxies = {
        "http": proxy_url,
        "https": proxy_url,
    }
    try:
        start_time = os.times()[4]
        response = requests.get(TEST_URL, proxies=proxies, timeout=10)
        end_time = os.times()[4]
        print(f"✅ Success! Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        print(f"Time: {end_time - start_time:.2f}s")
        return True
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False
    print("\n")

if __name__ == "__main__":
    print("Starting Proxy Connectivity Test...\n")
    
    # Test 1: As HTTP Proxy (What the user provided)
    success_http = test_proxy(PROXY_URL, "HTTP Proxy Mode")
    
    print("-" * 30 + "\n")

    # Test 2: As SOCKS5 Proxy (What the backend code does)
    socks_proxy_url = PROXY_URL.replace("http://", "socks5h://", 1)
    success_socks = test_proxy(socks_proxy_url, "SOCKS5 Proxy Mode (Current Backend Logic)")

    print("-" * 30 + "\n")
    
    if success_http and not success_socks:
        print("CONCLUSION: The proxy works as HTTP but fails as SOCKS5.")
        print("RECOMMENDATION: The backend code needs to be updated to stop forcing 'socks5h://'.")
    elif success_socks:
        print("CONCLUSION: The proxy works as SOCKS5.")
        print("RECOMMENDATION: The issue might be elsewhere (e.g., firewall, specific Google blocking).")
    elif not success_http and not success_socks:
        print("CONCLUSION: The proxy failed in both modes.")
        print("RECOMMENDATION: Verify proxy credentials, IP whitelist, or if the proxy is alive.")
