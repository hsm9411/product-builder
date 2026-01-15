import React, { useRef } from 'react';
import emailjs from 'emailjs-com';

const ContactPage = () => {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_uat02yj', 'template_jg7qinn', form.current, 'JeuzT7Yq85UM42Y3o')
            .then((result) => {
                alert('Sent! Thank you for your message.');
                form.current.reset();
            }, (error) => {
                alert('Failed to send message. Please try again later. Error: ' + error.text);
            });
    };

    return (
        <div className="content-section">
            <h1>문의하기</h1>
            <p>질문이 있으시면 아래 양식을 사용하여 언제든지 문의하십시오.</p>
            <form ref={form} onSubmit={sendEmail} className="page-form" id="contact-form">
                <div className="form-group">
                    <label htmlFor="name">이름</label>
                    <input type="text" id="name" name="user_name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" name="user_email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="message">메시지</label>
                    <textarea id="message" name="message" rows="5" required></textarea>
                </div>
                <button type="submit" className="submit-btn">보내기</button>
            </form>
        </div>
    );
};

export default ContactPage;
