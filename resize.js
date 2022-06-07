
    let width = window.innerWidth;
    let height = window.innerHeight;
    let lowerVal = width > height ? height : width;
    let el = document.getElementsByClassName("container")[0];
    el.style.transform = `scale(${lowerVal / 600 * 0.9})`;
