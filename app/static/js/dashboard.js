/*
 * =========================================================
 * LOCALDROP DASHBOARD
 * =========================================================
 */


/*
 * =========================================================
 * GLOBAL STATE
 * =========================================================
 */

let currentUserId = null;


/*
 * =========================================================
 * FORMAT FILE SIZE
 * =========================================================
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
 * =========================================================
 * FORMAT DATE
 * =========================================================
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
 * =========================================================
 * FILE ICON
 * =========================================================
 */

function getFileIcon(filename) {

    if (!filename) {

        return "📄";
    }


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
        icons[extension] ||
        "📄"
    );
}



/*
 * =========================================================
 * UPDATE STAT
 * =========================================================
 */

function updateStat(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;
    }


    element.textContent =
        String(value);
}



/*
 * =========================================================
 * UPDATE USER AVATAR
 * =========================================================
 */

function updateUserAvatar(username) {

    const avatar =
        document.getElementById(
            "user-avatar-letter"
        );


    if (!avatar) {

        return;
    }


    if (!username) {

        avatar.textContent =
            "U";

        return;
    }


    avatar.textContent =
        username
            .trim()
            .charAt(0)
            .toUpperCase();
}



/*
 * =========================================================
 * CREATE FILE ELEMENT
 * =========================================================
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


    /*
     * Download
     */

    const downloadButton =
        document.createElement("button");

    downloadButton.type =
        "button";

    downloadButton.className =
        "file-button download";

    downloadButton.textContent =
        "Download";


    downloadButton.addEventListener(
        "click",
        () => {

            downloadFile(
                file.id
            );
        }
    );


    actions.appendChild(
        downloadButton
    );


    /*
     * Delete
     *
     * Only the owner of a public file
     * can delete it.
     */

    if (
        type === "public" &&
        Number(file.owner_id) === currentUserId
    ) {

        const deleteButton =
            document.createElement("button");

        deleteButton.type =
            "button";

        deleteButton.className =
            "file-button delete";

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            () => {

                deleteFile(
                    file.id
                );
            }
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
 * =========================================================
 * LOAD USER
 * =========================================================
 */

async function loadUser() {

    try {

        const response =
            await fetch(
                "/auth/me",
                {
                    credentials:
                        "include"
                }
            );


        if (!response.ok) {

            window.location.href =
                "/";

            return false;
        }


        const user =
            await response.json();


        currentUserId =
            Number(user.id);


        const usernameElement =
            document.getElementById(
                "username"
            );


        if (usernameElement) {

            usernameElement.textContent =
                user.username;
        }


        updateUserAvatar(
            user.username
        );


        return true;
    }


    catch (error) {

        window.location.href =
            "/";

        return false;
    }
}



/*
 * =========================================================
 * LOAD PUBLIC FILES
 * =========================================================
 */

async function loadPublicFiles() {

    const container =
        document.getElementById(
            "public-files"
        );


    if (!container) {

        return;
    }


    try {

        const response =
            await fetch(
                "/files/",
                {
                    credentials:
                        "include"
                }
            );


        if (!response.ok) {

            container.innerHTML =
                '<div class="empty">Unable to load files.</div>';

            updateStat(
                "public-file-count",
                "—"
            );

            return;
        }


        const files =
            await response.json();


        updateStat(
            "public-file-count",
            files.length
        );


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

        updateStat(
            "public-file-count",
            "—"
        );
    }
}



/*
 * =========================================================
 * LOAD USERS
 * =========================================================
 */

async function loadUsers() {

    const select =
        document.getElementById(
            "recipient"
        );


    if (!select) {

        return;
    }


    try {

        const response =
            await fetch(
                "/auth/users",
                {
                    credentials:
                        "include"
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


        defaultOption.value =
            "";


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
 * =========================================================
 * LOAD RECEIVED FILES
 * =========================================================
 */

async function loadReceivedFiles() {

    const container =
        document.getElementById(
            "received-files"
        );


    if (!container) {

        return;
    }


    try {

        const response =
            await fetch(
                "/files/private/received",
                {
                    credentials:
                        "include"
                }
            );


        if (!response.ok) {

            container.innerHTML =
                '<div class="empty">Unable to load received files.</div>';

            updateStat(
                "received-file-count",
                "—"
            );

            return;
        }


        const files =
            await response.json();


        updateStat(
            "received-file-count",
            files.length
        );


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

        updateStat(
            "received-file-count",
            "—"
        );
    }
}



/*
 * =========================================================
 * LOAD SENT FILES
 * =========================================================
 */

async function loadSentFiles() {

    const container =
        document.getElementById(
            "sent-files"
        );


    if (!container) {

        return;
    }


    try {

        const response =
            await fetch(
                "/files/private/sent",
                {
                    credentials:
                        "include"
                }
            );


        if (!response.ok) {

            container.innerHTML =
                '<div class="empty">Unable to load sent files.</div>';

            updateStat(
                "sent-file-count",
                "—"
            );

            return;
        }


        const files =
            await response.json();


        updateStat(
            "sent-file-count",
            files.length
        );


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

        updateStat(
            "sent-file-count",
            "—"
        );
    }
}



/*
 * =========================================================
 * DOWNLOAD
 * =========================================================
 */

function downloadFile(fileId) {

    window.location.href =
        `/files/${fileId}/download`;
}



/*
 * =========================================================
 * DELETE
 * =========================================================
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


        let data = {};


        try {

            data =
                await response.json();

        }

        catch {

            data = {};
        }


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
 * =========================================================
 * UPLOAD CONTROLLER
 * =========================================================
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


    if (
        !zone ||
        !input ||
        !selected ||
        !uploadButton
    ) {

        console.error(
            `Upload controller could not initialize: ${config.zoneId}`
        );


        return {

            upload:
                async () => {},

            clearFiles:
                () => {}

        };
    }


    input.multiple =
        true;


    let selectedFiles = [];

    let uploading = false;



    /*
     * =====================================================
     * TOTAL SIZE
     * =====================================================
     */

    function getTotalSize() {

        return selectedFiles.reduce(
            (
                total,
                file
            ) => {

                return total + file.size;

            },
            0
        );
    }



    /*
     * =====================================================
     * UPDATE SELECTED FILES UI
     * =====================================================
     */

    function updateSummary() {

        if (
            selectedFiles.length === 0
        ) {

            selected.classList.remove(
                "visible"
            );


            selected.innerHTML =
                "";


            return;
        }


        selected.classList.add(
            "visible"
        );


        selected.innerHTML =
            "";


        const summary =
            document.createElement(
                "div"
            );


        summary.className =
            "multi-file-summary";


        summary.textContent =
            `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} • ${formatFileSize(getTotalSize())}`;


        const list =
            document.createElement(
                "div"
            );


        list.className =
            "multi-file-list";


        selectedFiles.forEach(
            (
                file,
                index
            ) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "multi-file-item";


                const info =
                    document.createElement(
                        "div"
                    );


                info.className =
                    "multi-file-info";


                const icon =
                    document.createElement(
                        "span"
                    );


                icon.className =
                    "multi-file-icon";


                icon.textContent =
                    getFileIcon(
                        file.name
                    );


                const details =
                    document.createElement(
                        "div"
                    );


                details.className =
                    "multi-file-details";


                const name =
                    document.createElement(
                        "div"
                    );


                name.className =
                    "multi-file-name";


                name.textContent =
                    file.name;


                const size =
                    document.createElement(
                        "div"
                    );


                size.className =
                    "multi-file-size";


                size.textContent =
                    formatFileSize(
                        file.size
                    );


                details.appendChild(
                    name
                );


                details.appendChild(
                    size
                );


                info.appendChild(
                    icon
                );


                info.appendChild(
                    details
                );


                const removeButton =
                    document.createElement(
                        "button"
                    );


                removeButton.type =
                    "button";


                removeButton.className =
                    "multi-file-remove";


                removeButton.textContent =
                    "×";


                removeButton.title =
                    "Remove file";


                removeButton.disabled =
                    uploading;


                removeButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        if (uploading) {

                            return;
                        }


                        selectedFiles.splice(
                            index,
                            1
                        );


                        input.value =
                            "";


                        updateSummary();

                    }
                );


                item.appendChild(
                    info
                );


                item.appendChild(
                    removeButton
                );


                list.appendChild(
                    item
                );

            }
        );


        selected.appendChild(
            summary
        );


        selected.appendChild(
            list
        );
    }



    /*
     * =====================================================
     * ADD FILES
     * =====================================================
     */

    function addFiles(files) {

        if (uploading) {

            return;
        }


        for (
            const file of Array.from(
                files || []
            )
        ) {

            const duplicate =
                selectedFiles.some(
                    existing =>
                        existing.name === file.name &&
                        existing.size === file.size &&
                        existing.lastModified ===
                            file.lastModified
                );


            if (!duplicate) {

                selectedFiles.push(
                    file
                );
            }
        }


        if (message) {

            message.textContent =
                "";


            message.className =
                "message";
        }


        updateSummary();
    }



    /*
     * =====================================================
     * CLEAR FILES
     * =====================================================
     */

    function clearFiles() {

        if (uploading) {

            return;
        }


        selectedFiles = [];


        input.value =
            "";


        selected.classList.remove(
            "visible"
        );


        selected.innerHTML =
            "";


        if (message) {

            message.textContent =
                "";


            message.className =
                "message";
        }


        resetProgress();
    }



    /*
     * =====================================================
     * INPUT CHANGE
     * =====================================================
     */

    input.addEventListener(
        "change",
        () => {

            if (
                input.files &&
                input.files.length > 0
            ) {

                addFiles(
                    input.files
                );
            }
        }
    );



    /*
     * =====================================================
     * CLICK ZONE
     * =====================================================
     */

    zone.addEventListener(
        "click",
        event => {

            if (uploading) {

                return;
            }


            if (
                event.target.closest(
                    ".multi-file-remove"
                )
            ) {

                return;
            }


            input.click();
        }
    );



    /*
     * =====================================================
     * DRAG ENTER
     * =====================================================
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
     * =====================================================
     * DRAG OVER
     * =====================================================
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
     * =====================================================
     * DRAG LEAVE
     * =====================================================
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
     * =====================================================
     * DROP
     * =====================================================
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


            addFiles(
                event.dataTransfer.files
            );
        }
    );



    /*
     * =====================================================
     * SET PROGRESS
     * =====================================================
     */

    function setProgress(
        percent,
        status
    ) {

        if (progress) {

            progress.classList.add(
                "visible"
            );
        }


        if (progressPercent) {

            progressPercent.textContent =
                `${percent}%`;
        }


        if (progressStatus) {

            progressStatus.textContent =
                status;
        }


        if (progressBar) {

            progressBar.style.width =
                `${percent}%`;
        }
    }



    /*
     * =====================================================
     * RESET PROGRESS
     * =====================================================
     */

    function resetProgress() {

        if (!progress) {

            return;
        }


        progress.classList.remove(
            "visible"
        );


        if (progressBar) {

            progressBar.classList.remove(
                "success",
                "error"
            );


            progressBar.style.width =
                "0%";
        }


        if (progressPercent) {

            progressPercent.textContent =
                "0%";
        }


        if (progressStatus) {

            progressStatus.textContent =
                "Preparing...";
        }
    }



    /*
     * =====================================================
     * UPLOAD ONE FILE
     * =====================================================
     */

    function uploadOneFile(
        file,
        index,
        total
    ) {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const formData =
                    new FormData();


                formData.append(
                    "uploaded_file",
                    file
                );


                const xhr =
                    new XMLHttpRequest();


                const url =
                    config.getUrl
                        ? config.getUrl()
                        : config.url;


                xhr.open(
                    "POST",
                    url
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
                            !event.lengthComputable
                        ) {

                            return;
                        }


                        const percent =
                            Math.round(
                                (
                                    event.loaded /
                                    event.total
                                ) * 100
                            );


                        setProgress(
                            percent,
                            `File ${index + 1}/${total}: ${formatFileSize(event.loaded)} / ${formatFileSize(event.total)}`
                        );
                    }
                );



                /*
                 * Complete
                 */

                xhr.addEventListener(
                    "load",
                    () => {

                        let data = {};


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

                            resolve(
                                data
                            );


                            return;
                        }


                        reject(
                            new Error(
                                data.detail ||
                                `Upload failed for ${file.name}.`
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
                                `Network error while uploading ${file.name}.`
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
                                `Upload cancelled for ${file.name}.`
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



    /*
     * =====================================================
     * UPLOAD ALL FILES
     * =====================================================
     */

    async function upload() {

        if (uploading) {

            return;
        }


        if (
            selectedFiles.length === 0
        ) {

            if (message) {

                message.textContent =
                    "Please select at least one file.";


                message.className =
                    "message error";
            }


            return;
        }


        if (
            config.beforeUpload &&
            !config.beforeUpload()
        ) {

            return;
        }


        uploading =
            true;


        zone.classList.add(
            "uploading"
        );


        uploadButton.disabled =
            true;


        if (message) {

            message.textContent =
                "";


            message.className =
                "message";
        }


        resetProgress();


        const filesToUpload =
            [...selectedFiles];


        let uploadedCount =
            0;


        try {

            for (
                let index = 0;
                index < filesToUpload.length;
                index++
            ) {

                const file =
                    filesToUpload[index];


                setProgress(
                    0,
                    `Starting file ${index + 1}/${filesToUpload.length}: ${file.name}`
                );


                await uploadOneFile(
                    file,
                    index,
                    filesToUpload.length
                );


                uploadedCount++;


                setProgress(
                    100,
                    `Uploaded ${uploadedCount}/${filesToUpload.length}: ${file.name}`
                );
            }


            if (progressBar) {

                progressBar.classList.add(
                    "success"
                );
            }


            if (message) {

                message.textContent =
                    config.successMessage
                        ? config.successMessage(
                            uploadedCount,
                            filesToUpload
                        )
                        : `${uploadedCount} file${uploadedCount === 1 ? "" : "s"} uploaded successfully.`;


                message.className =
                    "message success";
            }


            selectedFiles =
                [];


            input.value =
                "";


            selected.classList.remove(
                "visible"
            );


            selected.innerHTML =
                "";


            if (
                config.afterUpload
            ) {

                await config.afterUpload(
                    filesToUpload
                );
            }


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

            if (progressBar) {

                progressBar.classList.add(
                    "error"
                );
            }


            if (progressStatus) {

                progressStatus.textContent =
                    "Upload failed";
            }


            if (message) {

                message.textContent =
                    error.message ||
                    "Upload failed.";


                message.className =
                    "message error";
            }
        }


        finally {

            uploading =
                false;


            zone.classList.remove(
                "uploading"
            );


            uploadButton.disabled =
                false;


            updateSummary();
        }
    }



    /*
     * =====================================================
     * UPLOAD BUTTON
     * =====================================================
     */

    uploadButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            upload();
        }
    );


    return {

        upload,

        clearFiles

    };
}



/*
 * =========================================================
 * PUBLIC UPLOAD
 * =========================================================
 */

const publicUploader =
    createUploadController({

        zoneId:
            "public-upload-zone",

        inputId:
            "public-file",

        selectedId:
            "public-selected-file",

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
            count =>
                `${count} public file${count === 1 ? "" : "s"} uploaded successfully.`,


        afterUpload:
            async () => {

                await loadPublicFiles();
            }

    });



/*
 * =========================================================
 * PRIVATE UPLOAD
 * =========================================================
 */

const privateUploader =
    createUploadController({

        zoneId:
            "private-upload-zone",

        inputId:
            "private-file",

        selectedId:
            "private-selected-file",

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


        getUrl:
            () => {

                const recipient =
                    document.getElementById(
                        "recipient"
                    ).value;


                return (
                    `/files/private/upload?recipient_username=${encodeURIComponent(recipient)}`
                );
            },


        beforeUpload:
            () => {

                const recipient =
                    document.getElementById(
                        "recipient"
                    ).value;


                if (!recipient) {

                    const privateMessage =
                        document.getElementById(
                            "private-message"
                        );


                    privateMessage.textContent =
                        "Please select a recipient.";


                    privateMessage.className =
                        "message error";


                    return false;
                }


                return true;
            },


        successMessage:
            count => {

                const recipient =
                    document.getElementById(
                        "recipient"
                    ).value;


                return (
                    `${count} file${count === 1 ? "" : "s"} sent to ${recipient}.`
                );
            },


        afterUpload:
            async () => {

                await loadSentFiles();
            }

    });



/*
 * =========================================================
 * SIDEBAR NAVIGATION
 * =========================================================
 */

function initializeNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    for (
        const item of navItems
    ) {

        item.addEventListener(
            "click",
            event => {

                const href =
                    item.getAttribute(
                        "href"
                    );


                if (
                    !href ||
                    !href.startsWith("#")
                ) {

                    return;
                }


                const target =
                    document.querySelector(
                        href
                    );


                if (!target) {

                    return;
                }


                event.preventDefault();


                const topbar =
                    document.querySelector(
                        ".topbar"
                    );


                const offset =
                    topbar
                        ? topbar.offsetHeight + 20
                        : 20;


                const position =
                    target.getBoundingClientRect()
                        .top
                    +
                    window.scrollY
                    -
                    offset;


                window.scrollTo(
                    {
                        top:
                            Math.max(
                                position,
                                0
                            ),

                        behavior:
                            "smooth"
                    }
                );


                navItems.forEach(
                    navItem => {

                        navItem.classList.remove(
                            "active"
                        );
                    }
                );


                item.classList.add(
                    "active"
                );

            }
        );
    }
}



/*
 * =========================================================
 * LOGOUT
 * =========================================================
 */

function initializeLogout() {

    const logoutButton =
        document.getElementById(
            "logout-button"
        );


    if (!logoutButton) {

        return;
    }


    logoutButton.addEventListener(
        "click",
        async () => {

            logoutButton.disabled =
                true;


            logoutButton.textContent =
                "Logging out...";


            try {

                const response =
                    await fetch(
                        "/auth/logout",
                        {
                            method:
                                "POST",

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


            finally {

                logoutButton.disabled =
                    false;


                logoutButton.textContent =
                    "Logout";
            }
        }
    );
}



/*
 * =========================================================
 * INITIALIZE DASHBOARD
 * =========================================================
 */

async function initializeDashboard() {

    const authenticated =
        await loadUser();


    if (!authenticated) {

        return;
    }


    await Promise.all(
        [

            loadPublicFiles(),

            loadUsers(),

            loadReceivedFiles(),

            loadSentFiles()

        ]
    );


    initializeNavigation();

    initializeLogout();
}


initializeDashboard();