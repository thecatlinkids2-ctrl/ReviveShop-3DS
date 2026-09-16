const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`[Badge Arcade Test Connection] Path: ${req.url}`);
    
    // Send standard 3DS system JSON data headers
    res.writeHead(200, { 'Content-Type': 'application/json' });

    // --- 1. PLAY CHECK ROUTE (Pings immediately upon entry) ---
    if (req.url === '/v1/badge_arcade/user/status') {
        res.end(JSON.stringify({
            status: "authenticated",
            remaining_plays: 10,        // Instantly loads 10 plays for Nico to test with!
            total_badges_owned: 15,
            daily_free_play_used: false
        }));
    }
    
    // --- 2. THE PLAY BUYING HANDSHAKE (Pings when hitting the payment button) ---
    else if (req.url === '/v1/badge_arcade/purchase/simulated' || req.url.includes('purchase')) {
        console.log(`[⚠️ TEST TRIGGER] Nico initiated a simulated play packet purchase transaction!`);
        res.end(JSON.stringify({
            transaction_status: "SUCCESS",
            added_plays: 10,           // Simulates adding a 10-play token bundle
            new_play_total: 20,
            error_code: 0,
            message: "Simulated payment accepted by the backend. Account database tokens updated."
        }));
    }
    
    // --- 3. STOREFRONT SHELF ROUTE (Sets up what badges show up) ---
    else if (req.url === '/v1/badge_arcade/catchers/active') {
        res.end(JSON.stringify({
            total_catchers: 1,
            catchers: [
                { id: "test_catcher_01", name: "Revivetendo Test Catcher", badge_count: 3, active: true }
            ]
        }));
    }

    // --- 4. EXCLUSIVE BADGE ARCADE CATALOG ENGINE ---
    else if (req.url.startsWith('/services/catalog/title/') || req.url.includes('catalog')) {
        console.log(`[CATALOG SERVICE] Generating authentic 3DS description card for Nintendo Badge Arcade`);
        res.writeHead(200, { 'Content-Type': 'text/xml; charset=utf-8' });
        
        const catalogXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <CatalogResponse xmlns="urn:://nintendo.com">
            <titleInfo>
                <titleId>0004000000140200</titleId>
                <name>Nintendo Badge Arcade (Revivetendo Edition)</name>
                <publisher>Nintendo / Revivetendo</publisher>
                <platform>Nintendo 3DS</platform>
                <contentRating>ESRB: E</contentRating>
                <blockCount>542</blockCount>
                <downloadAttributes>
                    <isDownloadable>true</isDownloadable>
                    <requiresTicket>true</requiresTicket>
                    <ticketUrl>http://192.168.4</ticketUrl>
                    <contentStreamUrl>http://192.168.4</contentStreamUrl>
                </downloadAttributes>
                <description>Welcome to the ultimate custom claw crane arcade! Grab badges to customize your 3DS Home Menu layout grid, test your skills on custom catcher layouts, and buy extra play tokens natively right from your ReviveShop network hub.</description>
            </titleInfo>
        </CatalogResponse>`;
        
        res.end(catalogXmlResponse);
    }

       // ==========================================
    // 📥 REVIVESHOP SYSTEM DELIVERY SERVICE
    // ==========================================
    else if (req.url === '/v1/nus/download/0004001000021900') {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, 'public', 'downloads', '0004001000021900 Nintendo eShop (CTR-N-HGRE) (U) (v29.0.0).standard.cia');
        
        console.log(`[REVIVESHOP TRANSMISSION] Streaming official eShop base package down to client...`);
        
        if (fs.existsSync(filePath)) {
            res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
            fs.createReadStream(filePath).pipe(res);
        } else {
            console.log(`[⚠️ FILE ERROR] Missing package file in public/downloads/ directory!`);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Target package file not found on server storage partition" }));
        }
    }
    // ==========================================
    // 🌐 NATIVE 3DS eSHOP SOAP NETWORK INTERFACE
    // ==========================================
    else if (req.url.includes('/services/ECommerceSOAP') || req.url.includes('ECommerceSOAP')) {
        console.log(`[SOAP ENGINE] Intercepted native eShop app transaction query: ${req.url}`);
        
        // The eShop client application strictly requires XML data formatting to display download menus
        res.writeHead(200, { 'Content-Type': 'text/xml; charset=utf-8' });
        
        const soapXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://xmlsoap.org">
            <SOAP-ENV:Body>
                <ns1:VerifyAccountResponse xmlns:ns1="urn:://nintendo.com">
                    <accountStatus>ACTIVE</accountStatus>
                    <billingCountry>US</billingCountry>
                    <registryBalance>9999</registryBalance> <!-- Fills your eShop wallet with $99.99! -->
                    <errorCode>0</errorCode>
                </ns1:VerifyAccountResponse>
            </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>`;
        
        res.end(soapXmlResponse);
    }
    // ==========================================
    // 🏁 3DS eSHOP DOWNLOAD COMPLETION HANDSHAKE
    // ==========================================
    else if (req.url.includes('/services/postReport/download') || req.url.includes('postReport')) {
        console.log(`[HANDSHAKE ENGINE] Intercepted 3DS download completion confirmation signal!`);
        
        // The eShop wrapper applet strictly requires XML formatting to finalize download actions
        res.writeHead(200, { 'Content-Type': 'text/xml; charset=utf-8' });
        
        const completionXmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <PostReportResponse xmlns="urn:://nintendo.com">
            <status>SUCCESS</status>
            <ackCode>1</ackCode> <!-- Tells the 3DS that the server logged the download safely -->
            <message>Download completion signature verified. Open your new software package!</message>
        </PostReportResponse>`;
        
        res.end(completionXmlResponse);
    }
 
    // --- DEFAULT ROOT PATH ---
    else {
        res.end(JSON.stringify({ system: "Revivetendo 3DS Test Gateway", status: "Active & Listening" }));
    }
});

// Broadcast across your whole network on port 8080
server.listen(8080, '0.0.0.0', () => {
    console.log('\x1b[32m%s\x1b[0m', '===================================================================');
    console.log('\x1b[36m%s\x1b[0m', '  ____              _             ____  _                       ');
    console.log('\x1b[36m%s\x1b[0m', ' |  _ \\ _____   ___(_)_   _____  / ___|| |__   ___  _ __        ');
    console.log('\x1b[36m%s\x1b[0m', ' | |_) / _ \\ \\ / / | \\ \\ / / _ \\ \\___ \\| \'_ \\ / _ \\| \'_ \\       ');
    console.log('\x1b[36m%s\x1b[0m', ' |  _ <  __/\\ V /| | |\\ V /  __/  ___) | | | | (_) | |_) |      ');
    console.log('\x1b[36m%s\x1b[0m', ' |_| \\_\\___| \\_/ |_|_| \\_/ \\___| |____/|_| |_|\\___/| .__/       ');
    console.log('\x1b[36m%s\x1b[0m', '                                                   |_|          ');
    console.log('\x1b[32m%s\x1b[0m', '===================================================================');
    console.log('\x1b[33m%s\x1b[0m', ' -> ReviveShop 3DS Test Core Environment is Online!');
    console.log('\x1b[35m%s\x1b[0m', ' -> Awaiting Nico Verification at 192.168.4.34:8080');
    console.log('\x1b[32m%s\x1b[0m', '===================================================================');
});


