const input = document.getElementById("pdfFiles");

const fileList = document.getElementById("fileList");

const mergeBtn = document.getElementById("mergeBtn");

const status = document.getElementById("status");

const outputName = document.getElementById("outputName");

const clearBtn = document.getElementById("clearBtn");

const fileCount = document.getElementById("fileCount");

let selectedFiles = [];

// ----------------------------

function renderFiles(){

    fileList.innerHTML = "";

    fileCount.innerHTML = `${selectedFiles.length} File${selectedFiles.length!=1?"s":""}`;

    if(selectedFiles.length===0){

        fileList.innerHTML="No files selected.";

        return;

    }

    selectedFiles.forEach((file,index)=>{

        const div=document.createElement("div");

        div.className="file";

        div.innerHTML=`

            <span>📄 ${file.name}</span>

            <button class="remove-btn"

            onclick="removeFile(${index})">

            ❌

            </button>

        `;

        fileList.appendChild(div);

    });

}

// ----------------------------

function removeFile(index){

    selectedFiles.splice(index,1);

    renderFiles();

}

// ----------------------------

clearBtn.addEventListener("click",()=>{

    selectedFiles=[];

    renderFiles();

});

// ----------------------------

input.addEventListener("change",()=>{

    for(const file of input.files){

        const exists=selectedFiles.some(f=>

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

// ----------------------------

mergeBtn.addEventListener("click",async()=>{

    if(selectedFiles.length<2){

        alert("Please select at least 2 PDFs.");

        return;

    }

    status.innerHTML="Uploading...";

    const formData=new FormData();

    selectedFiles.forEach(file=>{

        formData.append("pdfs",file);

    });

    formData.append("filename",outputName.value);

    try{

        const response=await fetch("http://127.0.0.1:5000/merge",{

            method:"POST",

            body:formData

        });

        if(response.ok){

            const blob=await response.blob();

            const url=window.URL.createObjectURL(blob);

            const a=document.createElement("a");

            a.href=url;

            a.download=(outputName.value||"merged")+".pdf";

            document.body.appendChild(a);

            a.click();

            a.remove();

            status.innerHTML="✅ Merge Successful";

        }

        else{

            status.innerHTML="❌ Merge Failed";

        }

    }

    catch{

        status.innerHTML="❌ Cannot connect to Flask.";

    }

});