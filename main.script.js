var gotError = false;

function requestFileFromServer(pathToFile, onError, onLoad) {
    let url = this.window.location.origin.toString() + "/" + pathToFile;

    try {
        let xhr = new XMLHttpRequest();

        xhr.open("GET", url, true)

        xhr.onload = function () { onLoad(xhr) };
        xhr.onerror = function () { onError(xhr) };

        xhr.send();
    }
    catch (error)
    {
        onError(error);
    }
}

function checkMobileMode()
{
    if (window.innerWidth < 480) {
        document.getElementById("bodycontent").classList.add("hidden");
        document.getElementById("sorrybutyourscreentoosmall").classList.remove("hidden");
        return;
    }
    document.getElementById("bodycontent").classList.remove("hidden");
    document.getElementById("sorrybutyourscreentoosmall").classList.add("hidden");

    if (window.innerWidth < 580) {
        document.getElementById("resolutionwarning").classList.remove("hidden");
    } else {
        document.getElementById("resolutionwarning").classList.add("hidden");
    }

    if (window.innerWidth < 840) {
        document.body.classList.add("MobileView");
        return;
    }

    const elements = this.document.getElementsByClassName("nav");
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        element.classList.remove("show");
    }

    document.body.classList.remove("MobileView");
}

function showOrHideNavigationMobile()
{
    const elements = this.document.getElementsByClassName("nav");
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        if (element.classList.contains("show"))
            element.classList.remove("show");
        else
            element.classList.add("show");
    }
}

const linksIDs = {
    0: "home_hl",
    1: "software_hl",
    2: "donation_hl"
}

window.hideAllErrors = function()
{
	window.showError("javascripterror", false);
	window.showError("connectionerror", false);
	window.showError("notfound", false);
}

function checkError(i)
{
	switch (i)
	{
		case 404:
			gotError = true;
			window.hideAllErrors();
			window.showError("notfound", true);
			document.body.classList.remove("hidden");
			return;
	}
}

function updatePage(i)
{
	checkError(i)
	
	if (linksIDs[i] == undefined)
	{
		window.location.href = window.location.origin + window.location.pathname + "#ERROR_NOT_FOUND"
		return;
	}
	
	if (gotError == true)
	{
		window.location.reload();
	}
	
    document.getElementById(linksIDs[i]).classList.add("selected")
    for (let index = 0; index < 3; index++) {
        const element = document.getElementById(linksIDs[index])
        if (index != i)
            element.classList.remove("selected")
    }
}

const pageHashs = {
    "#home": 0,
    "#oursoftware": 1,
    "#donation": 2,
	"#ERROR_NOT_FOUND": 404
}

const subTitles = {
    0: "Home!",
    1: "Our software!",
    2: "Donation!",
	404: "Not found!"
}

function hashCheck()
{
	if (window.location.hash == "")
	{
        window.location.href = window.location.origin + window.location.pathname + "#home"
	}
	
    let i = pageHashs[window.location.hash];
    if (i == undefined)
    {
        window.location.href = window.location.origin + window.location.pathname + "#ERROR_NOT_FOUND"
        i = 0;
    }
    document.title = "LiDNY - " + subTitles[i] + (window.isIE == true ? " (IE)" : "");
    return i;
}

window.addEventListener("resize", checkMobileMode)
window.addEventListener("hashchange", function() {
    updatePage(hashCheck())
})

window.showError = function(error, state)
{
	const elements = this.document.getElementById("errors").getElementsByClassName(error);
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        if (state == true) element.classList.remove("hidden");
		else element.classList.add("hidden");
		
		if (state == true)
		{
            let content = document.getElementById("maincontent");
            content.classList.add("hidden");
			gotError = true;
		}
    }
}

window.addEventListener("DOMContentLoaded", function() {
	window.showError("javascripterror", false);

    checkMobileMode();
    updatePage(hashCheck());

    let i = pageHashs[window.location.hash];
	
	checkError(i)
	
    const xhrOnError = function() {
        document.body.classList.remove("hidden");
		window.showError("connectionerror", true);
    }

	console.log(gotError)

	if (gotError == false)
	{

		console.log(gotError)
		requestFileFromServer("home.page", xhrOnError, function(xhr)
		{
			let content = document.getElementById("maincontent");
			content.innerHTML += "<div id=\"homeContent\">" + xhr.responseText + "</div>";
			requestFileFromServer("ourSoftware.page", xhrOnError, function(xhr)
			{
				let content = document.getElementById("maincontent");
				content.innerHTML += "<div id=\"ourSoftware\">" + xhr.responseText + "</div>";
				requestFileFromServer("donation.page", xhrOnError, function(xhr)
				{
					let content = document.getElementById("maincontent");
					content.innerHTML += "<div id=\"donation\">" + xhr.responseText + "</div>";
					content.classList.remove("hidden");
					document.body.classList.remove("hidden");
				});
			});
		});
	
	}
})