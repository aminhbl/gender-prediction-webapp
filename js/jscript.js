

function submitName(event) {
    let name = validateName(event)
    if (name) {
    //    does it already exist?
    //    send request
    //    update elements
    }


}

function validateName(event) {
    let name = document.getElementById('name').value
    if (name.length > 255) {
        raiseFlag('Name has more character than expected!')
        // Prevent the submit button to work as default
        event.preventDefault()
        return null
    }
    let regex = /^[a-zA-Z\s]+$/;
    if (!regex.test(name)) {
        raiseFlag("Name has unexpected characters!")
        // Prevent the submit button to work as default
        event.preventDefault()
        return null
    }
    return name
}

function raiseFlag(error) {
    document.getElementById("flag").style.padding = "2px";
    document.getElementById("flag").style.height = "30px";
    document.getElementById("flag").innerHTML = error;

    setTimeout(function () {
        document.getElementById("flag").style.padding = "0";
        document.getElementById("flag").style.height = "0";
        document.getElementById("flag").innerHTML = '';
    }, 4500);
}

document.getElementById('submit').onclick = submitName