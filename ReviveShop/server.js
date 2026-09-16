const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`[ReviveShop Connection] Route Requested: ${req.url}`);
    
    // Set standard headers for 3DS application data streams
    res.writeHead(200, { 'Content-Type': 'application/json' });

    // ==========================================
    // 🔲 REVIVESHOP NATIVE FRONTEND LAYOUTS
    // ==========================================
    
    // 1. Initial Store Connection Handshake (Pings on Boot)
    if (req.url === '/v1/3ds/eshop/initialize') {
        res.end(JSON.stringify({
            server_status: "online",
            project_name: "ReviveShop Official Front End",
            network_backend: "ReviveShop Core",
            region: "USA",
            currency: "USD",
            user_auth: "SUCCESS",
            message: "Initialization handshake successful. Welcome to ReviveShop!"
        }));
    }
    
    // 2. Main Storefront Home View (Banners, Music, and Layout Trees)
    else if (req.url === '/v1/3ds/eshop/home') {
        res.end(JSON.stringify({
            store_title: "ReviveShop",
            theme_color: "Orange_Classic",
            assets: {
                home_banner_url: "http://192.168.4",
                background_music_enabled: true,
                music_stream_path: "http://192.168.4"
            },
            home_shelf_categories: [
                { id: "shelf_01", name: "System Utilities & Homebrew", endpoint: "/v1/3ds/eshop/shelf/homebrew" }
            ]
        }));
    }

    // ==========================================
    // 📥 NATIVE SYSTEM DELIVERY SERVICE (CIA STREAM)
    // ==========================================
    else if (req.url === '/v1/nus/download/0004001000021900') {
        const filePath = path.join(__dirname, 'public', 'downloads', '0004001000021900 Nintendo eShop (CTR-N-HGRE) (U) (v29.0.0).standard.cia');
        console.log(`[REVIVESHOP TRANSMISSION] Streaming official eShop base package...`);
        
        if (fs.existsSync(filePath)) {
            res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
            fs.createReadStream(filePath).pipe(res);
        } else {
            console.log(`[⚠️ FILE ERROR] Missing package file in public/downloads/!`);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Target package file not found" }));
        }
    }
    
    // ==========================================
    // 🌐 NATIVE ECOMMERCE SOAP HANDSHAKES
    // ==========================================
    else if (req.url.includes('/services/ECommerceSOAP') || req.url.includes('ECommerceSOAP')) {
        res.writeHead(200, { 'Content-Type': 'text/xml; charset=utf-8' });
        res.end(`<?xml version="1.0" encoding="UTF-8"?>
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://xmlsoap.org">
            <SOAP-ENV:Body>
                <ns1:VerifyAccountResponse xmlns:ns1="urn:://nintendo.com">
                    <accountStatus>ACTIVE</accountStatus>
                    <billingCountry>US</billingCountry>
                    <registryBalance>9999</registryBalance>
                    <errorCode>0</errorCode>
                </ns1:VerifyAccountResponse>
            </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>`);
    }
    
    // --- DEFAULT FALLBACK PATH ---
    else {
        res.end(JSON.stringify({ system: "ReviveShop Dedicated 3DS Server Engine", status: "Online" }));
    }
});

// Broadcast across your network on port 8765 to match Nico's preferred port!
server.listen(8765, '0.0.0.0', () => {
    console.log('\x1b[32m%s\x1b[0m', '===================================================================');
    console.log('\x1b[36m%s\x1b[0m', '  ____              _             ____  _                       ');
    console.log('\x1b[36m%s\x1b[0m', ' |  _ \\ _____   ___(_)_   _____  / ___|| |__   ___  _ __        ');
    console.log('\x1b[36m%s\x1b[0m', ' | |_) / _ \\ \\ / / | \\ \\ / / _ \\ \\___ \\| \'_ \\ / _ \\| \'_ \\       ');
    console.log('\x1b[36m%s\x1b[0m', ' |  _ <  __/\\ V /| | |\\ V /  __/  ___) | | | | (_) | |_) |      ');
    console.log('\x1b[36m%s\x1b[0m', ' |_| \\_\\___| \\_/ |_|_| \\_/ \\___| |____/|_| |_|\\___/| .__/       ');
    console.log('\x1b[36m%s\x1b[0m', '                                                   |_|          ');
    console.log('\x1b[32m%s\x1b[0m', '===================================================================');
    console.log('\x1b[33m%s\x1b[0m', ' -> ReviveShop Isolated Storefront Environment is Online!');
    console.log('\x1b[35m%s\x1b[0m', ' -> Listening locally on your home router at port 8765');
    console.log('\x1b[32m%s\x1b[0m', '===================================================================');
});

