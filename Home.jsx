import React, { useState, useEffect, useRef } from "react";
import NavBarr from "../components/NavBarr";
import { Form, FormControl, Button } from "react-bootstrap";
import CustomCarousel2 from "../components/Picture 2";
import CustomCarousel1 from "../components/Picture 1";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSpinner } from '@fortawesome/free-solid-svg-icons';
import "../pages/CSS/Home.css";
import logo from '../images/Buitems.png';

const suggestionsList = [
  "Tell me fees Structure",
  "Pre req of OOP","About FICT","Software Engineering",
  "Addmission Process","Chairperson of IT",
  "Who has expertise in ML","Freezing Semester",
  "Office No of Sir Arbab","Dean of FMS",
  "Last date of enrollment","Contact CP of CE",
  "Credit hour of OOP","Duration of Program"
];

const getRandomSuggestions = (arr, num) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const Home = () => {
  const [questionText, setQuestionText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const answerTextAreaRef = useRef(null);
  let recognition;

  useEffect(() => {
    setSuggestions(getRandomSuggestions(suggestionsList, 4 + Math.floor(Math.random() * 2)));
  }, []);

  useEffect(() => {
    if (answerTextAreaRef.current) {
      answerTextAreaRef.current.scrollTop = answerTextAreaRef.current.scrollHeight;
    }
  }, [chat]);

  const handleEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading) {
        handleClick();
      }
    }
  };

  const handleClick = async (questionToSubmit) => {
    const currentQuestion = questionToSubmit || questionText;
    if (currentQuestion.trim() !== "" && !isLoading) {
      setIsLoading(true);
      setChat(prevChat => [...prevChat, { question: currentQuestion, answer: "Generating response..." }]);
      setQuestionText("");
      setSuggestions([]);

      try {
        const response = await fetch("http://localhost:8000/llm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: currentQuestion }),
        });

        if (!response.ok) {
          throw new Error("Error in getting response");
        }

        const data = await response.json();
        setChat(prevChat => {
          if (prevChat.length > 0) {
            const newChat = [...prevChat];
            newChat[newChat.length - 1].answer = data.response.trim();
            return newChat;
          }
          return prevChat;
        });
      } catch (err) {
        console.log(err);
        setChat(prevChat => {
          if (prevChat.length > 0) {
            const newChat = [...prevChat];
            newChat[newChat.length - 1].answer = "There was an error";
            return newChat;
          }
          return prevChat;
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClearChat = () => {
    setQuestionText("");
    setChat([]);
    setIsLoading(false);
    setSuggestions(getRandomSuggestions(suggestionsList, 4 + Math.floor(Math.random() * 2)));
  };

  const startSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestionText(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      console.error('Speech recognition not supported in this browser');
    }
  };

  const stopSpeechRecognition = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleClick(suggestion);
  };

  return (
    <div className="something">
      <NavBarr />
      <div style={styles.container}>
        <div style={styles.mainDiv} className="col-7">
          <Form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleClick(); }}>
            <Form.Group controlId="answerTextField" style={styles.formGroup}>
              <div style={styles.textArea} ref={answerTextAreaRef}>
                {chat.length === 0 ? (
                  <>
                    <h3 style={styles.placeholderText}>How can I help you?</h3>
                    <div className="suggestions-container">
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className="suggestion-card" onClick={() => handleSuggestionClick(suggestion)}>
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  chat.map((curr, index) => (
                    <div key={index} style={{ marginBottom: '5px', wordWrap: "break-word" }}>
                      <div className="question">
                        <h5>{curr.question}</h5>
                      </div>
                      <div className="answer">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={logo}
                            alt="logo"
                            className={isLoading && curr.answer === "Generating response..." ? 'spinner' : 'noSpinner'}
                            style={{
                              width: '25px',
                              height: '25px',
                              marginRight: '5px',
                              marginTop: '3px',
                              alignSelf: 'flex-start',
                            }}
                          />
                          <p style={{ color: "gray", margin: 0 }}>{curr.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Form.Group>
            <Form.Group controlId="questionTextArea" style={styles.formGroup2}>
              <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <FormControl
                  as="textarea"
                  placeholder="Ask your question..."
                  style={styles.textField}
                  rows={1}
                  onKeyDown={handleEnter}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
                <div
                  style={{
                    position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)',
                  }}
                  onMouseDown={startSpeechRecognition}
                  onMouseUp={stopSpeechRecognition}
                  onMouseLeave={stopSpeechRecognition}
                >
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    style={styles.microphoneIcon}
                    title="Speech to Text"
                  />
                  {isListening && <div style={{ marginLeft: '5px' }}>Listening...</div>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button style={{ ...styles.newchatButton, marginRight: '10px' }} onClick={handleClearChat}>
                  New chat
                </Button>
                <Button style={styles.submitButton} type="submit" disabled={isLoading}>
                  {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Submit'}
                </Button>
              </div>
            </Form.Group>
          </Form>
        </div>
        <div style={styles.carouselDiv} className="col-4">
          <div style={{ marginTop: "5vh", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)" }}>
            <CustomCarousel1 />
          </div>
          <div style={{ marginTop: "5vh", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)" }}>
            <CustomCarousel2 />
          </div>
        </div>
      </div>
    </div>
  );
};


export default Home;

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    height: "93vh",
  },
  mainDiv: {
    flex: 1,
    padding: "1.5%",
    display: "flex",
    flexDirection: "row",
  },
  carouselDiv: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "1vh",
    paddingRight: "1vh",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  formGroup: {
    flex: 5,
    marginBottom: "2%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    padding: "10px",
    overflowY: "auto",
    width: "100%",
  },
  formGroup2: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  textArea: {
    borderRadius: "20px",
    resize: "none",
    overflowY: "auto",
    flex: 1,
    padding: "4%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.4)",
    whiteSpace: 'pre-wrap',
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    wordBreak: "break-word", 
    wordWrap: "break-word",
  },
  placeholderText: {
    fontSize: "24px",
    color: "gray",
    fontWeight: "bold",
    margin: 0,
  },
  textField: {
    borderRadius: "20px",
    flex: 1,
    overflowY: "auto",
    resize: "none",
    padding: "20px",
    height: "70px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    wordBreak: "break-word", 
    wordWrap: "break-word",
  },
  submitButton: {
    marginTop: "10px",
    borderRadius: "20px",
    padding: "8px 20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  },
  newchatButton: {
    marginTop: "10px",
    borderRadius: "20px",
    padding: "8px 20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  },
  microphoneIcon: {
    fontSize: '24px',
    color: '#007bff',
    cursor: 'pointer',
  },
};
