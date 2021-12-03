/**
 * This function handles all the events  related to 'submit' button.
 * At first name would be validated, then HTTP request would be sent by fetch and promise,
 * if response is ok, then gender and probability would be shown.
 * @param event
 */
function submitName(event) {
    let name = validateName(event)
    if (name) {
        // To see if result for this name already saved in local storage?
        let saved_gender = localStorage.getItem(name)
        if (saved_gender != null) {
            document.getElementById('saved_gender').style.visibility = 'visible'
            document.getElementById('clear_button').style.visibility = 'visible'
            document.getElementById('saved_gender').innerHTML = `Gender: ${saved_gender}`
        } else {
            document.getElementById('saved_gender').style.visibility = 'hidden'
            document.getElementById('clear_button').style.visibility = 'hidden'
        }

        let url = 'https://api.genderize.io/?name=' + name
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    //error raised if response is not ok
                    throw new Error(
                        "Network response was not ok, " + response.status
                    );
                }
                return response.json();
            })
            .then((content) => {
                if (content['gender'] != null) {
                    // update the Gender and Probability
                    document.getElementById('predicted_gender').innerHTML = `Gender: ${content['gender']}`
                    document.getElementById('predicted_probability').innerHTML = `Probability: ${content['probability']}`
                }
                else {
                    // raise an error for name not considered valid by genderize
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

/**
 * This function handles all the events  related to 'save' button.
 * At first name would be validated, then if radio button is checked, name would be saved with
 * specified gender by that radio, if not name would be saved with predicted gender, and if there is not predicted
 * gender, then an error would be raised.
 * @param event
 */
function saveName(event) {
    let name = validateName(event)
    let predicted_gender = document.getElementById('predicted_gender').innerHTML.split(" ")
    if (name) {
        let gender = validateGender(event)
        if (gender) {
            localStorage.removeItem(name)
            localStorage.setItem(name, gender);

            raiseFlag(`\"${name}\" is now saved as \"${gender}\"`)
        }
        else if (predicted_gender.length > 1) {
            localStorage.removeItem(name)
            localStorage.setItem(name, predicted_gender[1]);

            raiseFlag(`\"${name}\" is now saved as \"${predicted_gender[1]}\"`)
        }
        else {
            raiseFlag('You must select a gender before saving!')
            event.preventDefault()
        }
    }
}

/**
 * This function handles all the events  related to 'clear' button.
 * At first name would be validated, then considering that this button would show up only if
 * there is a record for that name in local storage we can safely remove the record.
 * @param event
 */
function clearName(event) {
    let name = validateName(event)
    if (name) {
        localStorage.removeItem(name)
        raiseFlag(`\"${name}\" is now cleared from local storage!`)
        document.getElementById('saved_gender').style.visibility = 'hidden'
        document.getElementById('clear_button').style.visibility = 'hidden'
    }
}

/**
 * Iterate on radio buttons, return the value of the one that is checked
 * or return null.
 * @param event
 * @returns {null|*}
 */
function validateGender(event) {
    let radios = document.getElementsByName('gender')
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value
        }
    }
    return null
}

/**
 * Validate the name to be less than 255 characters and only include letters and space.
 * If not raise an appropriate error and prevent the submit button to perform as its default.
 * If validated return the value of name.
 * @param event
 * @returns {null|*}
 */
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

/**
 * Raise the error and messaging bar named flag, which sits on top of the main container.
 * Show the flag for 4.5 seconds and then roll it down by reducing the height.
 * @param error
 */
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

// register of handling functions
document.getElementById('submit').onclick = submitName
document.getElementById('save').onclick = saveName
document.getElementById('clear').onclick = clearName