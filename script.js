const input = document.getElementById("pdfFiles");
const fileList = document.getElementById("fileList");
const mergeBtn = document.getElementById("mergeBtn");
const outputName = document.getElementById("outputName");
const clearBtn = document.getElementById("clearBtn");
const fileCount = document.getElementById("fileCount");
const status = document.getElementById("status");

let selectedFiles = [];

// ---------------------------
// Update Status
// ---------------------------

function setStatus(message, color = "#0d6efd") {
    if (status) {
        status.innerHTML = message;
        status.style.color = color;
    }
}

// ---------------------------
// Render File List
// ---------------------------

function renderFiles() {

    fileList.innerHTML = "";

    fileCount.textContent =
        `${selectedFiles.length} File${selectedFiles.length !== 1 ? "s" : ""}`;

    if (selectedFiles.length === 0) {

        fileList.innerHTML =
            "<p style='color:gray'>No files selected.</p>";

        return;
    }

    selectedFiles.forEach((file, index) => {

        const div = document.createElement("div");

        div.className = "file";

        div.innerHTML = `

            <span>📄 ${file.name}</span>

            <button
                class="remove-btn"
                onclick="removeFile(${index})">
                ❌
            </button>

        `;

        fileList.appendChild(div);

    });

}

// ---------------------------
// Remove File
// ---------------------------

window.removeFile = function(index){

    selectedFiles.splice(index,1);

    renderFiles();

}

// ---------------------------
// Clear All
// ---------------------------

clearBtn.addEventListener("click",()=>{

    selectedFiles=[];

    input.value="";

    renderFiles();

    setStatus("");

});

// ---------------------------
// Add Files
// ---------------------------

input.addEventListener("change",()=>{

    for(const file of input.files){

        const exists = selectedFiles.some(f =>

            f.name===file.name &&
            f.size===file.size

        );

        if(!exists){

            selectedFiles.push(file);

        }

    }

    input.value="";

    renderFiles();

});

// ---------------------------
// Merge PDFs
// ---------------------------

mergeBtn.addEventListener("click",async()=>{

    if(selectedFiles.length<2){

        alert("Please select at least 2 PDF files.");

        return;

    }

    setStatus("Uploading PDFs...");

    const formData = new FormData();

    selectedFiles.forEach(file=>{

        formData.append("pdfs",file);

    });

    formData.append(
        "filename",
        outputName.value || "merged"
    );

    try{

        const response = await fetch(
            "https://pdfmerge-8iy9.onrender.com/merge",
            {

                method:"POST",

                body:formData

            }
        );

        if(!response.ok){

            throw new Error("Server Error");

        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download =
            (outputName.value || "merged") + ".pdf";

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

        setStatus(
            "✅ PDF Merged Successfully!",
            "green"
        );

    }

    catch(error){

        console.error(error);

        setStatus(
            "❌ Failed to merge PDF.",
            "red"
        );

    }

});