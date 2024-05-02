let input = document.getElementById("image");
let label = document.getElementById("imageDiv");


input.addEventListener("change", e => {
    console.log(label);
    console.log(e);
    let values = Object.values(e.target.files).map(file => `${file.name}`);
    console.log(values);
    label.innerText = values.join(" ");
});