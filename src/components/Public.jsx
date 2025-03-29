import { Link } from "react-router-dom";
import React, { useState } from "react";

const faqs = [
  {
    question: "How can I take notes securely?",
    answer: "You can take notes securely using encryption. Your notes are stored safely in your account and accessible only by you.",
  },
  {
    question: "Can I manage my passwords here?",
    answer: "Yes! Our password manager helps you securely store and retrieve passwords with strong encryption.",
  },
  {
    question: "Is my data safe with this platform?",
    answer: "Absolutely! We use industry-standard security practices to ensure your data remains protected.",
  },
  {
    question: "Can I access my notes from multiple devices?",
    answer: "Yes, you can sync your notes across multiple devices by logging into your account.",
  },
];

const Public = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const content = (
    <>
      <nav className="nav">
        <div className="logo">
          Note<span>Nexus</span>
        </div>
        <div className="nav__right">
            <Link to='/login' className="a">About</Link>
            <Link to='/contact' className="a">Contact</Link>
        </div>
      </nav>
      <div className="hero">
        <div>Secure Your Notes, Manage Your Passwords Effortlessly!</div>
        <div> Write, Organize & Share Your Notes with High Security.</div>
      </div>
      <div className="login">
        <p>Get started with NoteNexus</p>
        <button type="submit">Login -&gt;</button>
      </div>
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {
          faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
                <span className={`icon ${openIndex === index ? "open" : ""}`}>
                  &#x2B;
                </span>
              </button>
              <div className={`faq-answer ${openIndex === index ? "show" : ""}`}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return content;
};

export default Public;