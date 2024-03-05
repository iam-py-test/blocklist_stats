"use strict";

function safeFilterName(filtername){
    return filtername.replaceAll(" ","_").replaceAll("'","").replaceAll("+","_").replaceAll(":", "").replaceAll("*", "").replaceAll("&", "_").replaceAll("/","_")
}

async function getAllFilters(){
    let filterdata = await (await fetch("filterlists.json")).json();
    window.filters = filterdata;
    return filterdata;
}

(async function(){
    const filter_imgs = document.getElementById("filter_imgs");
    let filterdata = await getAllFilters();
    let safefilternames = [];
    let filternames = Object.keys(filterdata);
    filternames.forEach((filter) => safefilternames.push(safeFilterName(filter)));
    safefilternames.forEach((filter) => {
        let filterCont = document.createElement("div");
        let realName = filternames[safefilternames.index(filter)];
        let filterTitle = document.createElement("p");
        filterTitle.textContent = realName;
        filterCont.appendChild(filterTitle);
        let filterImg = document.createElement("img");
        filterImg.src = `stats/${filter}.png`
        filterCont.appendChild(filterImg);
        filter_imgs.appendChild(filterCont);
    })
})();
