import React, { useState, useEffect } from "react";

const TranslatedMessage = ({ msg, targetLanguage }) => {
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    if (!msg || !msg.message) return;
    fetch(
      `https://www.apertium.org/apy/translate?langpair=en|${targetLanguage}&q=${encodeURIComponent(
        msg.message
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTranslatedText(
          data.responseData ? data.responseData.translatedText : msg.message
        );
      })
      .catch((err) => {
        console.error("Translation error:", err);
        setTranslatedText(msg.message);
      });
  }, [msg, targetLanguage]);

  return <span>{translatedText || msg.message}</span>;
};

export default TranslatedMessage;
