

function submitName(event) {
    let name = validateName(event)
    if (name) {
    //    does it already exist?
    //    send request
    //    update elements
        let url = 'https://api.genderize.io/?name=' + name
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Network response was not ok, " + response.status
                    );
                }
                return response.json();
            })
            .then((content) => {
                if (content['gender'] != null) {
                    document.getElementById('predicted_gender').innerHTML = `Gender: ${content['gender']}`
                    document.getElementById('predicted_probability').innerHTML = `Probability: ${content['probability']}`
                }
                else {
                    document.getElementById('predicted_gender').innerHTML = `Gender:`
                    document.getElementById('predicted_probability').innerHTML = `Probability:`
                    raiseFlag('Genderize does not consider your name valid!')
                }


            })
            .catch((error) => {
                raiseFlag(error)
            });

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