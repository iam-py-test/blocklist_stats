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
    window.filter_stats = await (await fetch("stats.json")).json();
    window.filter_size_stats = await (await fetch("size_stats.json")).json();
    window.filter_change_stats = await (await fetch("change_stats.json")).json();
}

(async function(){
    const filter_imgs = document.getElementById("filter_imgs");
    let filterdata = await getAllFilters();
    await getAllFiltersData();
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
        try{
            let filterStatInfo = document.createElement('p');
            let filterChecks = Object.keys(window.filter_stats[filter]);
            let numFilters = window.filter_stats[filter][filterChecks[filterChecks.length-1]];
            let changedFilters = window.filter_stats[filter][filterChecks[filterChecks.length-1]] - window.filter_stats[filter][filterChecks[filterChecks.length-2]];
            let changedFiltersText = "";
            if(changedFilters === 0){
                changedFiltersText = " (no filters added or removed)"
            }
            if(changedFilters > 0){
                changedFiltersText = ` (${changedFilters} added filters)`
            }
            if(changedFilters < 0){
                changedFiltersText = ` (${Math.abs(changedFilters)} removed filters)`
            }
            filterStatInfo.textContent = `${numFilters} filters` + changedFiltersText;
            filterImgCont.appendChild(filterStatInfo)
        }
        catch(err){
            console.trace(`Failed to get filterStatInfo for ${filter} due to ${err}`)
        }
        filterCont.appendChild(filterImgCont);
        filter_imgs.appendChild(filterCont);
    })
})();
