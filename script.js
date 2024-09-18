(function () {
    const init = () => {
        const inputArea = document.getElementById('subtitle-content');
        const titleInput = document.getElementById('subtitle-name');
        const buttonList = document.querySelectorAll('.button');
        const uploadButton = document.getElementById('file-upload');

        const charMap = {
            "º": "ș", "ª": "Ș", "ş": "ș", "Ş": "Ș",
            "ţ": "ț", "Ţ": "Ț", "þ": "ț", "Þ": "Ț",
            "ã": "ă", "Ã": "Ă"
        };

        const copyToClipboard = () => {
            if (inputArea.value.trim()) {
                navigator.clipboard.writeText(inputArea.value)
                    .then(() => {
                        console.log('Text copied to clipboard successfully.');
                    })
                    .catch(err => {
                        console.error('Failed to copy text to clipboard:', err);
                    });
            }
        };

        const fixSubtitle = (text = inputArea.value) => {
            return text.replace(/[ºªşŞţŢþÞãÃ]/g, match => charMap[match] || match);
        };

        const uploadFiles = () => {
            const files = uploadButton.files;
            const fileList = [...files];
            const totalFiles = fileList.length;

            if (totalFiles === 0) return;

            fileList.forEach(file => processFile(file, totalFiles));
        };

        const processFile = (file, totalFiles) => {
            const reader = new FileReader();
            reader.onload = () => {
                const correctedText = fixSubtitle(reader.result);
                handleFileRead(file, correctedText, totalFiles);
            };
            reader.readAsText(file, 'iso-8859-2');
        };

        const handleFileRead = (file, correctedText, totalFiles) => {
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            if (totalFiles > 1) {
                titleInput.value = "Toate fișierele au fost salvate";
                inputArea.value = "";
            } else {
                titleInput.value = nameWithoutExt;
                inputArea.value = correctedText;
            }
            saveCorrectedFile(correctedText, nameWithoutExt);
        };

        const saveCorrectedFile = (content, fileName) => {
            const blob = new Blob([content], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${fileName}.srt`;
            link.click();
        };

        const saveToFile = () => {
            const correctedText = fixSubtitle();
            const nameWithoutExt = titleInput.value || 'subtitle';
            saveCorrectedFile(correctedText, nameWithoutExt);
        };

        const handleButtonClick = event => {
            const action = event.target.dataset.action;
            switch (action) {
                case "copy":
                    copyToClipboard();
                    break;
                case "delete":
                    inputArea.value = "";
                    titleInput.value = "";
                    break;
                case "fix":
                    inputArea.value = fixSubtitle();
                    break;
                case "save":
                    saveToFile();
                    break;
                case "upload":
                    uploadButton.click();
                    break;
            }
        };

        uploadButton.addEventListener("change", uploadFiles);
        buttonList.forEach(button => button.addEventListener("click", handleButtonClick));
    };

    document.addEventListener("DOMContentLoaded", init);
})();
