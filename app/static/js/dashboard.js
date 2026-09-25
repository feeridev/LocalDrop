

/*
 * ==========================================
 * GLOBAL STATE
 * ==========================================
 */

let currentUserId = null;



/*
 * ==========================================
 * FORMAT FILE SIZE
 * ==========================================
 */

function formatFileSize(size) {

    if (
        size === null ||
        size === undefined ||
        Number.isNaN(Number(size))
    ) {

        return "Unknown size";
    }


    size = Number(size);


    if (size === 0) {

        return "0 B";
    }


    const units = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB"
    ];


    let value = size;

    let unitIndex = 0;


    while (
        value >= 1024 &&
        unitIndex < units.length - 1
    ) {

        value /= 1024;

        unitIndex++;
    }


    if (unitIndex === 0) {

        return `${value} ${units[unitIndex]}`;
    }


    return `${value.toFixed(2)} ${units[unitIndex]}`;
}



/*
 * ==========================================
 * FORMAT DATE
 * ==========================================
 */

function formatFileDate(dateString) {

    if (!dateString) {

        return "Unknown date";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Unknown date";
    }


    return date.toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}



/*
 * ==========================================
 * FILE ICON
 * ==========================================
 */

function getFileIcon(filename) {

    const extension =
        filename
            .split(".")
            .pop()
            .toLowerCase();


    const icons = {

        pdf: "📕",

        doc: "📘",
        docx: "📘",

        xls: "📗",
        xlsx: "📗",

        csv: "📊",

        ppt: "📙",
        pptx: "📙",

        txt: "📄",

        jpg: "🖼️",
        jpeg: "🖼️",
        png: "🖼️",
        gif: "🖼️",
        webp: "🖼️",
        svg: "🖼️",
        bmp: "🖼️",
        ico: "🖼️",

        mp4: "🎬",
        mkv: "🎬",
        avi: "🎬",
        mov: "🎬",
        webm: "🎬",

        mp3: "🎵",
        wav: "🎵",
        flac: "🎵",
        ogg: "🎵",
        m4a: "🎵",

        zip: "📦",
        rar: "📦",
        "7z": "📦",
        tar: "📦",
        gz: "📦",
        bz2: "📦",

        js: "💻",
        jsx: "💻",
        ts: "💻",
        tsx: "💻",
        py: "🐍",
        java: "☕",
        c: "💻",
        cpp: "💻",
        h: "💻",
        hpp: "💻",
        php: "💻",
        html: "🌐",
        css: "🎨",
        json: "🧩",
        xml: "🧩",
        sql: "🗄️",
        sh: "⌨️",
        bat: "⚙️"

    };


    return (
        icons[extension]
        || "📄"
    );
}



/*
 * ==========================================
 * CREATE FILE ELEMENT
 * ==========================================
 */

function createFileElement(
    file,
    type
) {

    const item =
        document.createElement("div");

    item.className =
        "file";


    const info =
        document.createElement("div");

    info.className =
        "file-info";


    const icon =
        document.createElement("div");

    icon.className =
        "file-icon";

    icon.textContent =
        getFileIcon(
            file.filename
        );


    const details =
        document.createElement("div");

    details.className =
        "file-details";


    const name =
        document.createElement("div");

    name.className =
        "file-name";

    name.textContent =
        file.filename;


    const meta =
        document.createElement("div");

    meta.className =
        "file-meta";


    if (type === "public") {

        meta.textContent =
            `${formatFileSize(file.size)} • Uploaded by ${file.owner_username} • ${formatFileDate(file.created_at)}`;
    }


    else if (type === "received") {

        meta.textContent =
            `${formatFileSize(file.size)} • From ${file.sender_username} • ${formatFileDate(file.created_at)}`;
    }


    else if (type === "sent") {

        meta.textContent =
            `${formatFileSize(file.size)} • To ${file.recipient_username} • ${formatFileDate(file.created_at)}`;
    }


    details.appendChild(name);

    details.appendChild(meta);

    info.appendChild(icon);

    info.appendChild(details);


    const actions =
        document.createElement("div");

    actions.className =
        "file-actions";


    const downloadButton =
        document.createElement("button");

    downloadButton.className =
        "file-button download";

    downloadButton.textContent =
        "Download";


    downloadButton.addEventListener(
        "click",
        () => downloadFile(file.id)
    );


    actions.appendChild(
        downloadButton
    );


    if (
        type === "public" &&
        Number(file.owner_id) === currentUserId
    ) {

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "file-button delete";

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            () => deleteFile(file.id)
        );


        actions.appendChild(
            deleteButton
        );
    }


    item.appendChild(info);

    item.appendChild(actions);


    return item;
}



/*
 * ==========================================
 * LOAD USER
 * ==========================================
 */

async function loadUser() {

    const response =
        await fetch(
            "/auth/me",
            {
                credentials: "include"
            }
        );


    if (!response.ok) {

        window.location.href = "/";

        return;
    }


    const user =
        await response.json();


    currentUserId =
        Number(user.id);


    document
        .getElementById("username")
        .textContent =
        user.username;
}



/*
 * ==========================================
 * LOAD PUBLIC FILES
 * ==========================================
 */

async function loadPublicFiles() {

    const container =
        document.getElementById(
            "public-files"
        );


    try {

        const response =
            await fetch(
                "/files/",
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            container.innerHTML =
                '<div class="empty">Unable to load files.</div>';

            return;
        }


        const files =
            await response.json();


        container.innerHTML = "";


        if (files.length === 0) {

            container.innerHTML =
                '<div class="empty">No public files yet.</div>';

            return;
        }


        for (const file of files) {

            container.appendChild(
                createFileElement(
                    file,
                    "public"
                )
            );
        }

    }

    catch (error) {

        container.innerHTML =
            '<div class="empty">Unable to connect to LocalDrop.</div>';
    }
}



/*
 * ==========================================
 * LOAD USERS
 * ==========================================
 */

async function loadUsers() {

    const select =
        document.getElementById(
            "recipient"
        );


    try {

        const response =
            await fetch(
                "/auth/users",
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            select.innerHTML =
                '<option value="">Unable to load users</option>';

            return;
        }


        const users =
            await response.json();


        select.innerHTML = "";


        if (users.length === 0) {

            select.innerHTML =
                '<option value="">No other users available</option>';

            return;
        }


        const defaultOption =
            document.createElement(
                "option"
            );


        defaultOption.value = "";

        defaultOption.textContent =
            "Select a user...";


        select.appendChild(
            defaultOption
        );


        for (const user of users) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                user.username;

            option.textContent =
                user.username;


            select.appendChild(
                option
            );
        }

    }

    catch (error) {

        select.innerHTML =
            '<option value="">Unable to connect</option>';
    }
}



/*
 * ==========================================
 * LOAD RECEIVED
 * ==========================================
 */

async function loadReceivedFiles() {

    const container =
        document.getElementById(
            "received-files"
        );


    try {

        const response =
            await fetch(
                "/files/private/received",
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            container.innerHTML =
                '<div class="empty">Unable to load received files.</div>';

            return;
        }


        const files =
            await response.json();


        container.innerHTML = "";


        if (files.length === 0) {

            container.innerHTML =
                '<div class="empty">No received files.</div>';

            return;
        }


        for (const file of files) {

            container.appendChild(
                createFileElement(
                    file,
                    "received"
                )
            );
        }

    }

    catch (error) {

        container.innerHTML =
            '<div class="empty">Unable to connect to LocalDrop.</div>';
    }
}



/*
 * ==========================================
 * LOAD SENT
 * ==========================================
 */

async function loadSentFiles() {

    const container =
        document.getElementById(
            "sent-files"
        );


    try {

        const response =
            await fetch(
                "/files/private/sent",
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            container.innerHTML =
                '<div class="empty">Unable to load sent files.</div>';

            return;
        }


        const files =
            await response.json();


        container.innerHTML = "";


        if (files.length === 0) {

            container.innerHTML =
                '<div class="empty">No sent files.</div>';

            return;
        }


        for (const file of files) {

            container.appendChild(
                createFileElement(
                    file,
                    "sent"
                )
            );
        }

    }

    catch (error) {

        container.innerHTML =
            '<div class="empty">Unable to connect to LocalDrop.</div>';
    }
}



/*
 * ==========================================
 * DOWNLOAD
 * ==========================================
 */

function downloadFile(fileId) {

    window.location.href =
        `/files/${fileId}/download`;
}



/*
 * ==========================================
 * DELETE
 * ==========================================
 */

async function deleteFile(fileId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this file?"
        );


    if (!confirmed) {

        return;
    }


    try {

        const response =
            await fetch(
                `/files/${fileId}`,
                {
                    method: "DELETE",

                    credentials:
                        "include"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.detail ||
                "Unable to delete file."
            );

            return;
        }


        await loadPublicFiles();

    }

    catch (error) {

        alert(
            "Unable to connect to LocalDrop."
        );
    }
}



/*
 * ==========================================
 * UPLOAD CONTROLLER
 * ==========================================
 *
 * This handles:
 *
 * - click
 * - drag & drop
 * - file selection
 * - progress
 * - success
 * - failure
 *
 */

function createUploadController(config) {

    const zone =
        document.getElementById(
            config.zoneId
        );


    const input =
        document.getElementById(
            config.inputId
        );


    const selected =
        document.getElementById(
            config.selectedId
        );


    const selectedName =
        document.getElementById(
            config.selectedNameId
        );


    const selectedSize =
        document.getElementById(
            config.selectedSizeId
        );


    const removeButton =
        document.getElementById(
            config.removeId
        );


    const uploadButton =
        document.getElementById(
            config.buttonId
        );


    const progress =
        document.getElementById(
            config.progressId
        );


    const progressStatus =
        document.getElementById(
            config.progressStatusId
        );


    const progressPercent =
        document.getElementById(
            config.progressPercentId
        );


    const progressBar =
        document.getElementById(
            config.progressBarId
        );


    const message =
        document.getElementById(
            config.messageId
        );


    let selectedFile = null;

    let uploading = false;



    /*
     * --------------------------------------
     * SHOW SELECTED FILE
     * --------------------------------------
     */

    function showSelectedFile(file) {

        selectedFile = file;


        selectedName.textContent =
            file.name;


        selectedSize.textContent =
            formatFileSize(
                file.size
            );


        selected.classList.add(
            "visible"
        );


        message.textContent = "";

        message.className =
            "message";
    }



    /*
     * --------------------------------------
     * CLEAR FILE
     * --------------------------------------
     */

    function clearFile() {

        if (uploading) {

            return;
        }


        selectedFile = null;

        input.value = "";


        selected.classList.remove(
            "visible"
        );


        selectedName.textContent =
            "";

        selectedSize.textContent =
            "";


        message.textContent =
            "";

        message.className =
            "message";
    }



    /*
     * --------------------------------------
     * SELECT FILE
     * --------------------------------------
     */

    function handleFile(file) {

        if (!file) {

            return;
        }


        if (uploading) {

            return;
        }


        showSelectedFile(file);
    }



    /*
     * --------------------------------------
     * INPUT CHANGE
     * --------------------------------------
     */

    input.addEventListener(
        "change",
        () => {

            if (
                input.files &&
                input.files.length > 0
            ) {

                handleFile(
                    input.files[0]
                );
            }
        }
    );



    /*
     * --------------------------------------
     * CLICK ZONE
     * --------------------------------------
     */

    zone.addEventListener(
        "click",
        () => {

            if (!uploading) {

                input.click();
            }
        }
    );



    /*
     * --------------------------------------
     * DRAG ENTER
     * --------------------------------------
     */

    zone.addEventListener(
        "dragenter",
        event => {

            event.preventDefault();

            if (!uploading) {

                zone.classList.add(
                    "dragover"
                );
            }
        }
    );



    /*
     * --------------------------------------
     * DRAG OVER
     * --------------------------------------
 */

    zone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            if (!uploading) {

                zone.classList.add(
                    "dragover"
                );
            }
        }
    );



    /*
     * --------------------------------------
     * DRAG LEAVE
     * --------------------------------------
     */

    zone.addEventListener(
        "dragleave",
        event => {

            event.preventDefault();

            zone.classList.remove(
                "dragover"
            );
        }
    );



    /*
     * --------------------------------------
     * DROP
     * --------------------------------------
     */

    zone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            zone.classList.remove(
                "dragover"
            );


            if (uploading) {

                return;
            }


            const files =
                event.dataTransfer.files;


            if (
                files &&
                files.length > 0
            ) {

                handleFile(
                    files[0]
                );
            }
        }
    );



    /*
     * --------------------------------------
     * REMOVE
     * --------------------------------------
     */

    removeButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            clearFile();
        }
    );



    /*
     * --------------------------------------
     * SET PROGRESS
     * --------------------------------------
     */

    function setProgress(
        percent,
        status
    ) {

        progress.classList.add(
            "visible"
        );


        progressPercent.textContent =
            `${percent}%`;


        progressStatus.textContent =
            status;


        progressBar.style.width =
            `${percent}%`;
    }



    /*
     * --------------------------------------
     * RESET PROGRESS
     * --------------------------------------
     */

    function resetProgress() {

        progress.classList.remove(
            "visible"
        );


        progressBar.classList.remove(
            "success"
        );


        progressBar.classList.remove(
            "error"
        );


        progressBar.style.width =
            "0%";


        progressPercent.textContent =
            "0%";


        progressStatus.textContent =
            "Preparing...";
    }



    /*
     * --------------------------------------
     * UPLOAD
     * --------------------------------------
     */

    async function upload() {

        if (uploading) {

            return;
        }


        if (!selectedFile) {

            message.textContent =
                "Please select a file.";

            message.className =
                "message error";

            return;
        }


        if (
            config.beforeUpload &&
            !config.beforeUpload()
        ) {

            return;
        }


        uploading = true;


        zone.classList.add(
            "uploading"
        );


        uploadButton.disabled =
            true;

        removeButton.disabled =
            true;


        message.textContent =
            "";

        message.className =
            "message";


        setProgress(
            0,
            "Starting upload..."
        );


        const formData =
            new FormData();


        formData.append(
            "uploaded_file",
            selectedFile
        );


        try {

            const result =
                await new Promise(
                    (resolve, reject) => {

                        const xhr =
                            new XMLHttpRequest();


                        xhr.open(
                            "POST",
                            config.url
                        );


                        xhr.withCredentials =
                            true;


                        /*
                         * Upload progress
                         */

                        xhr.upload.addEventListener(
                            "progress",
                            event => {

                                if (
                                    event.lengthComputable
                                ) {

                                    const percent =
                                        Math.round(
                                            (
                                                event.loaded /
                                                event.total
                                            ) * 100
                                        );


                                    setProgress(
                                        percent,
                                        `Uploading ${formatFileSize(event.loaded)} / ${formatFileSize(event.total)}`
                                    );
                                }
                            }
                        );


                        /*
                         * Complete
                         */

                        xhr.addEventListener(
                            "load",
                            () => {

                                let data = null;


                                try {

                                    data =
                                        JSON.parse(
                                            xhr.responseText
                                        );

                                }

                                catch {

                                    data = {};
                                }


                                if (
                                    xhr.status >= 200 &&
                                    xhr.status < 300
                                ) {

                                    resolve(data);

                                    return;
                                }


                                reject(
                                    new Error(
                                        data.detail ||
                                        "Upload failed."
                                    )
                                );
                            }
                        );


                        /*
                         * Network error
                         */

                        xhr.addEventListener(
                            "error",
                            () => {

                                reject(
                                    new Error(
                                        "Network error during upload."
                                    )
                                );
                            }
                        );


                        /*
                         * Abort
                         */

                        xhr.addEventListener(
                            "abort",
                            () => {

                                reject(
                                    new Error(
                                        "Upload cancelled."
                                    )
                                );
                            }
                        );


                        xhr.send(
                            formData
                        );
                    }
                );



            /*
             * SUCCESS
             */

            setProgress(
                100,
                "Upload complete"
            );


            progressBar.classList.add(
                "success"
            );


            message.textContent =
                config.successMessage(result);


            message.className =
                "message success";


            /*
             * Clear selected file
             */

            selectedFile = null;

            input.value = "";


            selected.classList.remove(
                "visible"
            );


            selectedName.textContent =
                "";

            selectedSize.textContent =
                "";


            /*
             * Refresh list
             */

            if (config.afterUpload) {

                await config.afterUpload(
                    result
                );
            }


            /*
             * Keep success visible
             * for a moment.
             */

            setTimeout(
                () => {

                    if (!uploading) {

                        resetProgress();
                    }

                },
                1500
            );

        }

        catch (error) {

            progressBar.classList.add(
                "error"
            );


            progressStatus.textContent =
                "Upload failed";


            message.textContent =
                error.message ||
                "Upload failed.";


            message.className =
                "message error";
        }


        finally {

            uploading = false;


            zone.classList.remove(
                "uploading"
            );


            uploadButton.disabled =
                false;

            removeButton.disabled =
                false;
        }
    }



    /*
     * --------------------------------------
     * UPLOAD BUTTON
     * --------------------------------------
     */

    uploadButton.addEventListener(
        "click",
        upload
    );


    return {
        upload,
        clearFile
    };
}



/*
 * ==========================================
 * PUBLIC UPLOAD CONTROLLER
 * ==========================================
 */

const publicUploader =
    createUploadController({

        zoneId:
            "public-upload-zone",

        inputId:
            "public-file",

        selectedId:
            "public-selected-file",

        selectedNameId:
            "public-selected-name",

        selectedSizeId:
            "public-selected-size",

        removeId:
            "public-remove-file",

        buttonId:
            "public-upload-button",

        progressId:
            "public-progress",

        progressStatusId:
            "public-progress-status",

        progressPercentId:
            "public-progress-percent",

        progressBarId:
            "public-progress-bar",

        messageId:
            "public-message",

        url:
            "/files/upload",

        successMessage:
            () =>
                "File uploaded successfully.",

        afterUpload:
            async () => {

                await loadPublicFiles();
            }

    });



/*
 * ==========================================
 * PRIVATE UPLOAD CONTROLLER
 * ==========================================
 */

const privateUploader =
    createUploadController({

        zoneId:
            "private-upload-zone",

        inputId:
            "private-file",

        selectedId:
            "private-selected-file",

        selectedNameId:
            "private-selected-name",

        selectedSizeId:
            "private-selected-size",

        removeId:
            "private-remove-file",

        buttonId:
            "private-upload-button",

        progressId:
            "private-progress",

        progressStatusId:
            "private-progress-status",

        progressPercentId:
            "private-progress-percent",

        progressBarId:
            "private-progress-bar",

        messageId:
            "private-message",


        /*
         * URL is created dynamically
         * because recipient is selected
         * from dropdown.
         */

        url:
            "/files/private/upload",


        beforeUpload:
            () => {

                const recipient =
                    document.getElementById(
                        "recipient"
                    ).value;


                const message =
                    document.getElementById(
                        "private-message"
                    );


                if (!recipient) {

                    message.textContent =
                        "Please select a recipient.";

                    message.className =
                        "message error";

                    return false;
                }


                return true;
            },


        successMessage:
            result =>
                `File sent to ${result.recipient}.`,


        afterUpload:
            async () => {

                await loadSentFiles();
            }

    });



/*
 * ==========================================
 * PRIVATE UPLOAD URL OVERRIDE
 * ==========================================
 *
 * Because the recipient is dynamic,
 * we replace the upload controller's
 * normal upload flow with a small wrapper.
 *
 * ==========================================
 */

document
    .getElementById(
        "private-upload-button"
    )
    .addEventListener(
        "click",
        async event => {

            /*
             * The controller already owns
             * this button.
             *
             * This listener only exists as
             * a placeholder for future
             * private-upload customization.
             *
             * Actual upload is handled by
             * the controller above.
             */
        }
    );



/*
 * ==========================================
 * IMPORTANT PRIVATE UPLOAD PATCH
 * ==========================================
 *
 * The private endpoint requires:
 *
 * ?recipient_username=username
 *
 * So we use the selected recipient
 * to construct the endpoint before
 * starting the upload.
 *
 */


/*
 * We recreate the private upload
 * controller with a dynamic URL by
 * overriding XMLHttpRequest endpoint
 * through a small standalone uploader.
 */


/*
 * The first controller is intentionally
 * not used for the actual private upload.
 *
 * Disable its button listener by replacing
 * the button with a clone.
 */

const oldPrivateButton =
    document.getElementById(
        "private-upload-button"
    );


const newPrivateButton =
    oldPrivateButton.cloneNode(
        true
    );


oldPrivateButton.parentNode.replaceChild(
    newPrivateButton,
    oldPrivateButton
);



/*
 * Private uploader state
 */

let privateSelectedFile = null;

const privateInput =
    document.getElementById(
        "private-file"
    );


const privateZone =
    document.getElementById(
        "private-upload-zone"
    );


const privateSelected =
    document.getElementById(
        "private-selected-file"
    );


const privateSelectedName =
    document.getElementById(
        "private-selected-name"
    );


const privateSelectedSize =
    document.getElementById(
        "private-selected-size"
    );


const privateRemove =
    document.getElementById(
        "private-remove-file"
    );


const privateProgress =
    document.getElementById(
        "private-progress"
    );


const privateProgressBar =
    document.getElementById(
        "private-progress-bar"
    );


const privateProgressPercent =
    document.getElementById(
        "private-progress-percent"
    );


const privateProgressStatus =
    document.getElementById(
        "private-progress-status"
    );


const privateMessage =
    document.getElementById(
        "private-message"
    );



/*
 * Private file selection
 */

function selectPrivateFile(file) {

    if (!file) {

        return;
    }


    privateSelectedFile =
        file;


    privateSelectedName.textContent =
        file.name;


    privateSelectedSize.textContent =
        formatFileSize(
            file.size
        );


    privateSelected.classList.add(
        "visible"
    );


    privateMessage.textContent =
        "";

    privateMessage.className =
        "message";
}


privateInput.addEventListener(
    "change",
    () => {

        if (
            privateInput.files &&
            privateInput.files.length
        ) {

            selectPrivateFile(
                privateInput.files[0]
            );
        }
    }
);


privateZone.addEventListener(
    "click",
    () => {

        if (
            !privateProgress.classList.contains(
                "visible"
            )
        ) {

            privateInput.click();
        }
    }
);


privateZone.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        privateZone.classList.add(
            "dragover"
        );
    }
);


privateZone.addEventListener(
    "dragleave",
    event => {

        event.preventDefault();

        privateZone.classList.remove(
            "dragover"
        );
    }
);


privateZone.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        privateZone.classList.remove(
            "dragover"
        );


        const files =
            event.dataTransfer.files;


        if (
            files &&
            files.length
        ) {

            selectPrivateFile(
                files[0]
            );
        }
    }
);


privateRemove.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        privateSelectedFile =
            null;


        privateInput.value =
            "";


        privateSelected.classList.remove(
            "visible"
        );


        privateSelectedName.textContent =
            "";

        privateSelectedSize.textContent =
            "";
    }
);



/*
 * ==========================================
 * PRIVATE UPLOAD
 * ==========================================
 */

newPrivateButton.addEventListener(
    "click",
    async () => {

        if (!privateSelectedFile) {

            privateMessage.textContent =
                "Please select a file.";

            privateMessage.className =
                "message error";

            return;
        }


        const recipient =
            document.getElementById(
                "recipient"
            ).value;


        if (!recipient) {

            privateMessage.textContent =
                "Please select a recipient.";

            privateMessage.className =
                "message error";

            return;
        }


        newPrivateButton.disabled =
            true;

        privateRemove.disabled =
            true;

        privateZone.classList.add(
            "uploading"
        );


        privateProgress.classList.add(
            "visible"
        );


        privateProgressBar.classList.remove(
            "success",
            "error"
        );


        privateProgressBar.style.width =
            "0%";


        privateProgressPercent.textContent =
            "0%";


        privateProgressStatus.textContent =
            "Starting upload...";


        privateMessage.textContent =
            "";

        privateMessage.className =
            "message";


        const formData =
            new FormData();


        formData.append(
            "uploaded_file",
            privateSelectedFile
        );


        const url =
            `/files/private/upload?recipient_username=${encodeURIComponent(recipient)}`;


        try {

            await new Promise(
                (resolve, reject) => {

                    const xhr =
                        new XMLHttpRequest();


                    xhr.open(
                        "POST",
                        url
                    );


                    xhr.withCredentials =
                        true;


                    xhr.upload.addEventListener(
                        "progress",
                        event => {

                            if (
                                event.lengthComputable
                            ) {

                                const percent =
                                    Math.round(
                                        (
                                            event.loaded /
                                            event.total
                                        ) * 100
                                    );


                                privateProgressBar.style.width =
                                    `${percent}%`;


                                privateProgressPercent.textContent =
                                    `${percent}%`;


                                privateProgressStatus.textContent =
                                    `Uploading ${formatFileSize(event.loaded)} / ${formatFileSize(event.total)}`;
                            }
                        }
                    );


                    xhr.addEventListener(
                        "load",
                        async () => {

                            let data = null;


                            try {

                                data =
                                    JSON.parse(
                                        xhr.responseText
                                    );

                            }

                            catch {

                                data = {};
                            }


                            if (
                                xhr.status >= 200 &&
                                xhr.status < 300
                            ) {

                                privateProgressBar.style.width =
                                    "100%";


                                privateProgressPercent.textContent =
                                    "100%";


                                privateProgressStatus.textContent =
                                    "Upload complete";


                                privateProgressBar.classList.add(
                                    "success"
                                );


                                privateMessage.textContent =
                                    `File sent to ${data.recipient || recipient}.`;


                                privateMessage.className =
                                    "message success";


                                privateSelectedFile =
                                    null;


                                privateInput.value =
                                    "";


                                privateSelected.classList.remove(
                                    "visible"
                                );


                                privateSelectedName.textContent =
                                    "";

                                privateSelectedSize.textContent =
                                    "";


                                await loadSentFiles();


                                resolve();

                                return;
                            }


                            reject(
                                new Error(
                                    data.detail ||
                                    "Private upload failed."
                                )
                            );
                        }
                    );


                    xhr.addEventListener(
                        "error",
                        () => {

                            reject(
                                new Error(
                                    "Network error during upload."
                                )
                            );
                        }
                    );


                    xhr.send(
                        formData
                    );
                }
            );

        }

        catch (error) {

            privateProgressStatus.textContent =
                "Upload failed";


            privateProgressBar.classList.add(
                "error"
            );


            privateMessage.textContent =
                error.message;


            privateMessage.className =
                "message error";
        }


        finally {

            newPrivateButton.disabled =
                false;

            privateRemove.disabled =
                false;

            privateZone.classList.remove(
                "uploading"
            );
        }
    }
);



/*
 * ==========================================
 * LOGOUT
 * ==========================================
 */

document
    .getElementById(
        "logout-button"
    )
    .addEventListener(
        "click",
        async () => {

            try {

                const response =
                    await fetch(
                        "/auth/logout",
                        {
                            method: "POST",

                            credentials:
                                "include"
                        }
                    );


                if (response.ok) {

                    window.location.href =
                        "/";

                    return;
                }


                alert(
                    "Logout failed."
                );

            }

            catch (error) {

                alert(
                    "Unable to connect to LocalDrop."
                );
            }
        }
    );



/*
 * ==========================================
 * INITIALIZE
 * ==========================================
 */

async function initializeDashboard() {

    await loadUser();

    await loadPublicFiles();

    await loadUsers();

    await loadReceivedFiles();

    await loadSentFiles();
}


initializeDashboard();

