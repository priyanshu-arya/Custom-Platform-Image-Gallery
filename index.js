// Get element references from HTML page
const uploadButton = document.getElementById("uploadButton");
const imageGallery = document.getElementById("imageGallery");
const slideshowContainer = document.getElementById("slideshowContainer");
const slideshow = document.getElementById('slideshow');


// Event listener for the "Upload" button
uploadButton.addEventListener("click", openFilePicker);

// Variables for managing the current image index and sources
let currentImageIndex = 0;
let imageSources = [];
let previewContainer, previewImage, prevIcon, nextIcon, closePreview;

// Function to open the file picker dialog Box
function openFilePicker() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", handleFileSelect);
    fileInput.click();
}



// Function to handle file selection and create image containers
function handleFileSelect(event) {
    const files = event.target.files;

    for (const file of files) {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("img-container");

        // Create Delete Button and add Event Listner
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => deleteImage(imgContainer));

       
    

        const img = document.createElement("img");
        const blobUrl = URL.createObjectURL(file);
        img.src = blobUrl;
        // img.addEventListener("load", ()=>{
        //     imgContainer.style.width = img.naturalWidth + "px";
        //     imgContainer.style.height = img.naturalHeight + "px";
        // });
        img.addEventListener("click", () => openSlideshow(blobUrl));
        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteButton);
        imageGallery.appendChild(imgContainer);
        imageSources.push(blobUrl);
    }
}

// Function to delete an image from the gallery
function deleteImage(container) {
    const img = container.querySelector("img");
    const index = imageSources.indexOf(img.src);
    if (index !== -1) {
        imageSources.splice(index, 1);
        container.remove();
    }
}

let zoomLevel = 100; 
function zoomIn() {
    console.log("Zoom In clicked");
        if (zoomLevel < 180) {
            zoomLevel += 10;
            updateZoom();
        
    }
}

// Function to zoom out the preview image
function zoomOut() {
    console.log("Zoom Level ZoomOut FUN: ",zoomLevel)
    console.log("Zoom Out clicked");
        if (zoomLevel > 100) {
            zoomLevel -= 10;
            updateZoom();
        }
    
}

// Function to update the zoom level and preview image size
function updateZoom() {
    console.log("Updating zoom level:", zoomLevel);
    previewImage.style.transform = `scale(${zoomLevel / 100})`;
    console.log("Updating zoom level:", zoomLevel);
}

// Function to open the image slideshow Container
function openSlideshow(imageSrc) {
    // Create the slideshow container and controls if not already created
    // Will only work when not in slide show mode
    if (!previewContainer) {
        // Create and append slideshow container
        previewContainer = document.createElement("div");
        previewContainer.id = "previewContainer";
        document.body.appendChild(previewContainer);

        // Create and append preview image
        previewImage = document.createElement("img");
        previewImage.id = "previewImage";
        previewContainer.appendChild(previewImage);

        // Create and append slideshow controls
        const previewControls = document.createElement("div");
        previewControls.id = "previewControls";
        previewControls.innerHTML = `
        <i class="fa fa-chevron-left" id="prevIcon"></i>
        <i class="fa fa-times" id="closePreview"></i>
        <i class="fa fa-chevron-right" id="nextIcon"></i>
        <i class="fa fa-plus" id="zoomInIcon"></i>
        <i class="fa fa-minus" id="zoomOutIcon"></i>
        `;
        previewContainer.appendChild(previewControls);

        // Get references to controls from slide show container
        prevIcon = previewControls.querySelector("#prevIcon");
        nextIcon = previewControls.querySelector("#nextIcon");
        closePreview = previewControls.querySelector("#closePreview");
        zoomInIcon = previewControls.querySelector("#zoomInIcon");
        zoomOutIcon = previewControls.querySelector("#zoomOutIcon");   

        zoomInIcon.addEventListener("click", () => {
            zoomIn();
        });

        zoomOutIcon.addEventListener("click", () => {
            zoomOut();
        });

        // Add event listeners to controls
        prevIcon.addEventListener("click", () => {
            currentImageIndex--;
            updatePreview();
        });

        nextIcon.addEventListener("click", () => {
            currentImageIndex++;
            updatePreview();
        });

        // Create and append preview image container
        const previewImageContainer = document.createElement("div");
        previewImageContainer.id = "previewImageContainer";
        previewImageContainer.appendChild(previewImage);

        // Add event listeners for zoom-in and zoom-out
        //previewImageContainer.addEventListener("click", toggleZoom);
        previewContainer.appendChild(previewImageContainer)

        // Close preview and clear slideshow when the close icon is clicked
        closePreview.addEventListener("click", () => {
            clearInterval(slideshowInterval);
            zoomLevel = 100;
            updateZoom();
            console.log("CURR ZOOM LVL : ",zoomLevel);
            previewContainer.style.display = "none";
            slideshow.innerHTML = "";
        });
    }

    // Create an array of image sources and set current index
    imageSources = Array.from(imageGallery.querySelectorAll("img")).map((img) => img.src);
    currentImageIndex = imageSources.indexOf(imageSrc);

    // Display the selected image and update the preview
    previewImage.src = imageSrc;
    previewContainer.style.display = "block";

    // Automatically update slideshow every 3 seconds
    const slideshowInterval = setInterval(updateSlideshowAutomatically, 10000);

    // Update preview initially
    updatePreview();
}


// Function to update the slideshow automatically
function updateSlideshowAutomatically() {
    currentImageIndex++;
    if (currentImageIndex >= imageSources.length) {
        currentImageIndex = 0;
    }
    updatePreview();
}

// Function to update the preview based on the current image index
function updatePreview() {
    if (currentImageIndex < 0) {
        currentImageIndex = 0;
    } else if (currentImageIndex >= imageSources.length) {
        currentImageIndex = imageSources.length - 1;
    }
    previewImage.src = imageSources[currentImageIndex];
    prevIcon.disabled = currentImageIndex === 0;
    nextIcon.disabled = currentImageIndex === imageSources.length - 1;
}
