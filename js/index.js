// element representing selected tab
let selectedTab = document.querySelector(".left-menu-selected");
// element visible at the beginning
let selectedContent = document.getElementById("task-examples");

// array of "Saved for later" items
let savedItems = [];
// element representing saved items
const savedContent = document.getElementById("saved-for-later");

let savedInDOM = false; // "Saved for later" items present in DOM

//restore array of "Saved for later" when the page loads
window.onload = () => { //called 
    const storageValue = sessionStorage.getItem("savedItems");
    if (storageValue != null) {
        savedItems = JSON.parse(storageValue);//get the savedItems
    }
}


// builds DOM for "Saved for later" items
function buildSaved(onlyLast = false) {
    const startIndex = (onlyLast)?(savedItems.length - 1):0;
    for (let index = startIndex; index < savedItems.length; index++) {
        const htmlText = savedItems[index];
        savedContent.innerHTML += htmlText;
    }
    savedInDOM = true;
}

// event handler (onClick - Tabs)
function selectTab(el) {
    const newContentId = el.attributes.content_id.value;
    if (newContentId == selectedContent.id) {
        //same tab clicked,  nothing to do
        return
    }

    // change tabs presentation
    selectedTab.className = "left-menu bg-grey-gradient"; //unselect
    el.className = "left-menu left-menu-selected"; //select
    selectedTab = el;

    // make invisible previous content  
    selectedContent.className = "display-none";

    // new content
    selectedContent = document.getElementById(newContentId);

    if (newContentId == "saved-for-later" && !savedInDOM) {
        buildSaved();    
    }
    // make visible new content
    selectedContent.className = "";

}

// event handler (onClick - button "Save for later")
function saveForLater(el) {
    //add item to array 
    savedItems.push(el.parentElement.outerHTML);
    if (savedInDOM) {
        //add to "save for later" page
        buildSaved(true);    
    }

    //store to session storage
    sessionStorage.setItem("savedItems", JSON.stringify(savedItems));

    alert(savedItems.length + ` items in your "Save for later" folder`);
}

// event handler (onClick - button "like")
function changeLike(el) {
    el.firstChild.className = (el.firstChild.className[0]!='l')?"liked":"unliked";
}