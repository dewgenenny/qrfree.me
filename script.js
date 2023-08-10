
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}




document.getElementById('type').addEventListener('change', function() {
    const typeDivs = ['urlDiv', 'emailDiv', 'wifiDiv', 'textDiv', 'vcardDiv', 'veventDiv', 'geoDiv', 'telDiv', 'smsDiv', 'paypalDiv'];

    // First, hide all input divs
    typeDivs.forEach(div => {
        document.getElementById(div).style.display = 'none';
    });

    // Then, display the selected one
    const selectedType = this.value;
    const selectedDiv = selectedType + "Div";
    if (typeDivs.includes(selectedDiv)) {
        document.getElementById(selectedDiv).style.display = 'block';
    }
});

function generateQRCode() {
    const type = document.getElementById('type').value;
    let text = "";

    if (type === 'url') {
        text = document.getElementById('url').value;
    } else if (type === 'email') {
        text = 'mailto:' + document.getElementById('email').value;
    } else if (type === 'wifi') {
        const ssid = document.getElementById('ssid').value;
        const password = document.getElementById('password').value;
        const encryption = document.getElementById('encryption').value;

        text = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    }

    if (type === 'text') {
        text = document.getElementById('text').value;
    } else if (type === 'vcard') {
        text = `BEGIN:VCARD\nVERSION:3.0\nFN:${document.getElementById('vcardName').value}\nTEL:${document.getElementById('vcardTel').value}\nEMAIL:${document.getElementById('vcardEmail').value}\nADR:${document.getElementById('vcardAddress').value}\nORG:${document.getElementById('vcardOrg').value}\nTITLE:${document.getElementById('vcardTitle').value}\nURL:${document.getElementById('vcardURL').value}\nEND:VCARD`;
    } else if (type === 'vevent') {
        text = `BEGIN:VEVENT\nSUMMARY:${document.getElementById('veventSummary').value}\nDTSTART:${document.getElementById('veventStart').value}\nDTEND:${document.getElementById('veventEnd').value}\nLOCATION:${document.getElementById('veventLocation').value}\nDESCRIPTION:${document.getElementById('veventDescription').value}\nEND:VEVENT`;
    } else if (type === 'geo') {
        text = `geo:${document.getElementById('geoLat').value},${document.getElementById('geoLon').value}`;
    } else if (type === 'tel') {
        text = `tel:${document.getElementById('tel').value}`;
    } else if (type === 'sms') {
        text = `sms:${document.getElementById('smsTel').value}?body=${document.getElementById('smsText').value}`;
    } else if (type === 'paypal') {
        const paypalEmail = document.getElementById('paypalEmail').value;
        const amount = document.getElementById('paypalAmount').value;
        text = amount ? `https://www.paypal.me/${paypalEmail}/${amount}` : `https://www.paypal.me/${paypalEmail}`;
    }

    const size = document.getElementById('size').value;
    let cellSize = 4;  // Default for small
    if (size === "medium") {
        cellSize = 6;
    } else if (size === "large") {
        cellSize = 8;
    } else if (size === "xl") {
        cellSize = 10;
    }

    const qr = qrcode(8, 'L');
    qr.addData(text);
    qr.make();

    const imgElement = document.createElement('img');
    imgElement.src = qr.createDataURL(cellSize);  // Adjust cell size here

    imgElement.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgElement, 0, 0);

        const pngUrl = canvas.toDataURL('image/png');
        const jpgUrl = canvas.toDataURL('image/jpeg');

        const qrCodeDiv = document.getElementById('qrcode');
        qrCodeDiv.innerHTML = '';  // clear the div first
        qrCodeDiv.appendChild(imgElement);
        qrCodeDiv.appendChild(document.createElement('br'));

        const downloadLinkPng = createDownloadLink(pngUrl, 'Download as PNG', 'QRCode.png');
        const downloadLinkJpg = createDownloadLink(jpgUrl, 'Download as JPEG', 'QRCode.jpg');
        const downloadLinkGif = createDownloadLink(imgElement.src, 'Download as GIF', 'QRCode.gif');

        qrCodeDiv.appendChild(downloadLinkPng);
        qrCodeDiv.appendChild(document.createElement('br'));
        qrCodeDiv.appendChild(downloadLinkJpg);
        qrCodeDiv.appendChild(document.createElement('br'));
        qrCodeDiv.appendChild(downloadLinkGif);

        if (isMobileDevice()) {
            const qrCodeDiv = document.getElementById('qrcode');
            qrCodeDiv.classList.add('mobile-instructions');
        }

        qrCodeDiv.scrollIntoView({
            behavior: 'smooth'
        });

        if (isMobileDevice()) {
            downloadLinkPng.onclick = mobileDownloadHandler;
            downloadLinkJpg.onclick = mobileDownloadHandler;
            downloadLinkGif.onclick = mobileDownloadHandler;
        }

        function mobileDownloadHandler(event) {
            event.preventDefault();
            alert("To save the image on mobile: \n1. Tap and hold on the image.\n2. Choose 'Add to Photos' or 'Save Image'.");
        }



    };

}

function createDownloadLink(url, text, filename) {
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.innerText = text;
    return downloadLink;
}

