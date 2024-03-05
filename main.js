"use strict";

function safeFilterName(filtername){
    return filtername.replaceAll(" ","_").replaceAll("'","").replaceAll("+","_").replaceAll(":", "").replaceAll("*", "").replaceAll("&", "_").replaceAll("/","_")
}

async function getAllFilters(){
    let filterdata = await (await fetch("filterlists.json")).json();
    window.filters = filterdata;
    return filterdata;
}

async function getAllFiltersData(){
    let filter_stats = await (await fetch("stats.json")).json();
    let filter_size_stats = await (await fetch("size_stats.json")).json();
    let filter_change_stats = await (await fetch("change_stats.json")).json();
    
}

(async function(){
    const filter_imgs = document.getElementById("filter_imgs");
    let filterdata = await getAllFilters();
    let safefilternames = [];
    let filternames = Object.keys(filterdata);
    filternames.forEach((filter) => safefilternames.push(safeFilterName(filter)));
    safefilternames.forEach((filter) => {
        let filterCont = document.createElement("div");
        let realName = filternames[safefilternames.indexOf(filter)];
        let filterTitle = document.createElement("p");
        filterTitle.textContent = realName;
        filterCont.appendChild(filterTitle);
        let filterImgCont = document.createElement("details");
        let filterImgSummary = document.createElement("summary");
        filterImgSummary.textContent = "View graph"
        filterImgCont.appendChild(filterImgSummary)
        let filterImg = document.createElement("img");
        filterImg.src = `stats/${filter}.png`
        filterImgCont.appendChild(filterImg);
        filterCont.appendChild(filterImgCont);
        filter_imgs.appendChild(filterCont);
    })
})();
