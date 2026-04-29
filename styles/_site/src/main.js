/**
 * Creates an element based on the tag name and classes given.
 * 
 * @param {string} tagName The tag name of the element (ie div, img, etc.)
 * @param {string} classes Sets the class attribute. Multiple separated by a space
 * @returns {HTMLElement}
 */

function createElementWithClass(tagName, classes) {
    const el = document.createElement(tagName);

    el.setAttribute("class", classes);

    return el;
}

/**
 * Creates a Palette Item based on the given color information.
 * 
 * @param {string} color The value of the color
 * @param {string} desc The description/name/use of the color
 * 
 * @returns {HTMLElement}
 */

function createItem(color, desc) {
    const elmItem = createElementWithClass("div", "palette__item");
    const elmColor = createElementWithClass("div", "palette__color");
    const elmDesc = createElementWithClass("div", "palette__desc");
    const elmInput = createElementWithClass("div", "palette__details");
    const elmOverlay = createElementWithClass("div", "palette__overlay");
    const elmName = createElementWithClass("div", "palette__name");

    elmColor.style.backgroundColor = color;
    elmName.textContent = color.toUpperCase();
    elmDesc.textContent = desc;
    elmOverlay.textContent = "click to copy";

    elmItem.appendChild(elmColor);
    elmInput.appendChild(elmDesc);
    elmInput.appendChild(elmName);
    elmColor.appendChild(elmOverlay);
    elmItem.appendChild(elmInput);

    elmColor.style.cursor = "pointer";
    elmColor.addEventListener("click", () => {
        navigator.clipboard.writeText(color).then(() => {
            elmOverlay.textContent = "copied!";
            elmColor.classList.add("palette__color--copied");
            setTimeout(() => {
                elmOverlay.textContent = "click to copy";
                elmColor.classList.remove("palette__color--copied");
            }, 1500);
        });
    });

    return elmItem;
}

function createPalette(c, src) {
    const paletteContainer = document.querySelector(c);

fetch(src).then(response => {
    return response.json();
}).then(colorList => {
    for (const {desc, color} of colorList) {
        console.log(desc, color);
        paletteContainer.appendChild(createItem(color, desc));
    }
})
}

function createContinuousItem(color, desc) {
    const elmItem = createElementWithClass("div", "palette__item palette__item--continuous");
    const elmColor = createElementWithClass("div", "palette__color palette__color--continuous");
    const elmInput = createElementWithClass("div", "palette__details palette__details--continuous");
    const elmOverlay = createElementWithClass("div", "palette__overlay");
    const elmName = createElementWithClass("div", "palette__name palette__name--continuous");

    elmColor.style.backgroundColor = color;
    elmName.textContent = color.toUpperCase();
    elmOverlay.textContent = "click to copy";

    elmItem.appendChild(elmColor);
    elmInput.appendChild(elmName);
    elmColor.appendChild(elmOverlay);
    elmItem.appendChild(elmInput);

    elmColor.style.cursor = "pointer";
    elmColor.addEventListener("click", () => {
        navigator.clipboard.writeText(color).then(() => {
            elmOverlay.textContent = "copied!";
            elmColor.classList.add("palette__color--copied");
            setTimeout(() => {
                elmOverlay.textContent = "click to copy";
                elmColor.classList.remove("palette__color--copied");
            }, 1500);
        });
    });

    return elmItem;
}
function createContinuousPalette(c, src) {
    const paletteContainer = document.querySelector(c);
    paletteContainer.style.display = "flex";

    fetch(src).then(response => {
        return response.json();
    }).then(colorList => {
        for (const {desc, color} of colorList) {
            paletteContainer.appendChild(createContinuousItem(color, desc));
        }

        const items = paletteContainer.querySelectorAll(".palette__item--continuous");
        const count = items.length;

        function getExpandedWidth() {
            const containerWidth = paletteContainer.getBoundingClientRect().width;
            const shrunkWidth = 30;
            // expanded = total width minus all shrunk siblings
            return containerWidth - (shrunkWidth * (count - 1));
        }

        items.forEach(item => {
            item.addEventListener("mouseenter", () => {
                const expandedWidth = getExpandedWidth();
                items.forEach(i => {
                    i.style.flex = "0 0 30px";
                    i.querySelector(".palette__name--continuous").style.opacity = "0";
                });
                item.style.flex = `0 0 ${expandedWidth}px`;
                item.querySelector(".palette__name--continuous").style.opacity = "1";
            });

            item.addEventListener("mouseleave", () => {
                items.forEach(i => {
                    i.style.flex = "1";
                    i.querySelector(".palette__name--continuous").style.opacity = "0";
                });
            });
        });
    });
}