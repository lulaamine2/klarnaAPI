document.addEventListener('DOMContentLoaded', function() {
    // Första API-anropet för att få data för att initiera Klarna Payments
    fetch('process_payment.php', { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (error) {
                    console.error("Failed to parse JSON:", text);
                    throw error;
                }
           });
        })
        .then(data => {
            console.log('Data received:', data);
            // Initialisera Klarna Payments 
            initializeKlarna(data);
        })
        .catch(error => console.error('Error during fetch:', error));
});

function initializeKlarna(data) {
    // Med client_token och initialiserar Klarna Payments
    Klarna.Payments.init({ client_token: data.client_token });
    Klarna.Payments.load(
        {
            container: '#klarna-checkout-container',
            payment_method_category: 'pay_later'
        },
        function(response) {
            console.log('Klarna Payments loaded', response);

            document.getElementById('klarna-complete-purchase').addEventListener('click', function() {
                Klarna.Payments.authorize(
                    { payment_method_category: 'pay_later' },
                    function(authorizationResponse) {
                        console.log("Authorization Response:", authorizationResponse);

                        if (authorizationResponse.approved) {
                            // Processa auktorisationen
                            processAuthorization(authorizationResponse.authorization_token);
                        } else {
                            console.error('Authorization was not approved', authorizationResponse);
                        }
                    }
                );
            });
        }
    );
}

function processAuthorization(authorizationToken) {
    // Här skickas auktorisationstoken till backend för att slutföra köpet
    fetch('complete_purchase.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'authorization_token=' + encodeURIComponent(authorizationToken)
    })
    .then(response => response.json())
    .then(data => console.log('Payment captured', data))
    .catch(error => console.error('Error capturing payment', error));
}
