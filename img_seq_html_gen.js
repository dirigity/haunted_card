const fs = require("fs");

const file = fs.readdirSync("./photo_mirror_split");

let html = "";

let plantilla = (path, id) =>
    `<div class="photo_holder">
        <img class="photo" id="${id}" src="${path}" alt="my face">
    </div>
    `

file.forEach(path => {
    html += plantilla("./photo_mirror_split/" + path, path)
});

fs.writeFileSync("img_seq.html", html);