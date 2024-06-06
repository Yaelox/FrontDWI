async function validatePassword() {
    const password = document.getElementById('password').value;
    const response = await fetch('/validate-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    });
    const validationMessage = await response.text();
    document.getElementById('validationResult').innerText = validationMessage;
}
