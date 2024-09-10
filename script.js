(function() {

    var init = function() {

        var inputArea = document.getElementById('subtitle-content'),
            titleInput = document.getElementById('subtitle-name'),
            buttonList = document.getElementsByClassName('button'),
            uploadButton = document.getElementById('file-upload'),
            originalInput = "";

        function copyToClipboard() {
            if (inputArea.value !== " ") {
                inputArea.select();
                document.execCommand('copy');
                if (window.getSelection) {
                    if (window.getSelection().empty) {
                        window.getSelection().empty();
                    } else if (window.getSelection().removeAllRanges) {
                        window.getSelection().removeAllRanges();
                    }
                } else if (document.selection) {
                    document.selection.empty();
                }
            }
            return;
        }

        function fixSubtitle(text) {
            var charMap = { "º": "ș", "ª": "Ș", "ş": "ș", "Ş": "Ș", "ţ": "ț", "Ţ": "Ț", "þ": "ț", "Þ": "Ț", "ã": "ă", "Ã": "Ă" };
            var charList = text ? text.split("") : inputArea.value.split("");
            for (var index = 0; index < charList.length; index++) {
                var char = charList[index];
                if (char in charMap) {
                    charList[index] = charMap[char];
                }
            }
            inputArea.value = charList.join("");
            return charList.join("");
        }

        function uploadFile() {
            if ('files' in uploadButton) {
                var reader = new FileReader();
                reader.onload = (function() {
                    inputArea.value = fixSubtitle(reader.result);
                    var name = uploadButton.files[0].name,
                        nameArr = name.split("");
                    titleInput.value = nameArr.splice(0, nameArr.length - name.split("").reverse().indexOf(".") - 1).join("");
                });
                reader.readAsText(uploadButton.files[0], 'iso-8859-2');
            }
        }

        function saveFile() {
            var fileBlob = new Blob([inputArea.value], { type: 'text/plain' });
            var saveButton = document.querySelectorAll('[data-action=save]')[0];
            saveButton.setAttribute("href", URL.createObjectURL(fileBlob));
            if (titleInput.value) {
                saveButton.setAttribute("download", titleInput.value + ".srt");
            } else {
                saveButton.setAttribute("download", "subtitle.srt");
            }
        }

        function uploadClick() {
            uploadButton.click();
        }

        uploadButton.addEventListener("change", uploadFile);

        var changeCase = function(event) {
            switch (event.target.dataset.action) {
                case "copy":
                    copyToClipboard();
                    break;
                case "delete":
                    inputArea.value = "";
                    titleInput.value = "";
                    break;
                case "fix":
                    fixSubtitle();
                    break;
                case "save":
                    saveFile();
                    break;
                case "upload":
                    uploadClick();
                    break;
                default:
                    break;
            }
            return;
        };

        for (var i = 0; i < buttonList.length; i++) {
            buttonList[i].addEventListener("click", changeCase);
        }

    };

    document.addEventListener("DOMContentLoaded", function() {
        init();
    });

})();
