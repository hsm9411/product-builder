document.addEventListener('DOMContentLoaded', () => {
    // --- EmailJS Integration for Contact Page ---
    (function() {
        emailjs.init({
          publicKey: "JeuzT7Yq85UM42Y3o",
        });
    })();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const submitBtn = this.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const serviceID = 'service_uat02yj';
            const templateID = 'template_jg7qinn';

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    alert('Sent! Thank you for your message.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    this.reset();
                }, (err) => {
                    alert('Failed to send message. Please try again later. Error: ' + JSON.stringify(err));
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                });
        });
    }
});
