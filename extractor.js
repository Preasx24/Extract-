// Welcome to the world of organized JavaScript!
// No more <script> stuffing in the HTML. Your future self thanks you.

// [WRSA]: Functionality and snark by Whiterosesa, 2025-08-06
let extractedData = "";

// Look, event listeners! No more on* attributes littering your HTML.
document.getElementById('extractBtn').addEventListener('click', processFile);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
document.getElementById('downloadBtn').addEventListener('click', downloadFile);


function _wrsaStealthFlag() { return "DTECH-EXTRACT-2025"; }

function processFile() {
    const fileInput = document.getElementById('fileInput');
    const output = document.getElementById('output');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    const fileNameInput = document.getElementById('fileName');
    const accountCount = document.getElementById('accountCount');
    output.textContent = "";
    accountCount.textContent = "";

    if (!fileInput.files.length) {
        // Because users shouldn't have to guess why nothing happens.
        alert("Please select a file first!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const content = event.target.result;
        // Fancy regex, doing what a real dev would do.
        const pattern = /(\S+@\S+)\s*:\s*(\S+)/g;
        let match;
        extractedData = "";
        let count = 0;

        while ((match = pattern.exec(content)) !== null) {
            // XSS? Not today, Satan! We'll just strip dangerous stuff for giggles.
            let email = match[1].replace(/[<>"'&]/g, "");
            let pass = match[2].replace(/[<>"'&]/g, "");
            extractedData += `${email}:${pass}\n`;
            count++;
        }

        if (extractedData) {
            // textContent: Because innerHTML is for people who want XSS in their life.
            output.textContent = extractedData;
            accountCount.textContent = `Total Accounts Extracted: ${count}`;
            downloadBtn.style.display = "inline-block";
            copyBtn.style.display = "inline-block";
            fileNameInput.style.display = "inline-block";
        } else {
            output.textContent = "No valid email:password pairs found.";
            downloadBtn.style.display = "none";
            copyBtn.style.display = "none";
            fileNameInput.style.display = "none";
        }
    };

    reader.onerror = function() {
        // Because users deserve to know when things break.
        alert("Error reading file!");
    };

    reader.readAsText(file);
}

function copyToClipboard() {
    navigator.clipboard.writeText(extractedData).then(() => {
        alert("Copied to clipboard!");
    }).catch(() => {
        alert("Failed to copy!");
    });
}

function downloadFile() {
    const fileNameInput = document.getElementById('fileName');
    const fileName = fileNameInput.value || "extracted_accounts.txt";
    const blob = new Blob([extractedData], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

// No redirecting to weird ad URLs. Because this is 2025 and we know better.
// [WRSA-END]