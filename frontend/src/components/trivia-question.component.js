import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, LinearProgress } from "@material-ui/core";

export default class TriviaQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 10, questionSubmitted: false };
  }

  componentWillUnmount() {
    if (!this.state.questionSubmitted) {
      this.props.validateTriviaAnswer();
    }
    clearInterval(this.timer);
  }

  componentDidUpdate = (prevProps) => {
    if (
      this.props.currentQuestion.question !== prevProps.currentQuestion.question
    ) {
      this.setState({ questionSubmitted: false });
    }
  };

  tick = () => {
    if (this.state.seconds > 0 && !this.state.questionSubmitted) {
      this.setState((prevState) => {
        return { seconds: prevState.seconds - 1 };
      });
    } else {
      if (!this.state.questionSubmitted) {
        this.props.validateTriviaAnswer();
        this.setState({ seconds: 10.0, questionSubmitted: true });
      }
    }
  };
  normalise = (value) => (value * 100) / 10;
  submitButtonClicked = () => {
    this.props.validateTriviaAnswer();

    this.setState({ seconds: 10, questionSubmitted: true });
  };

  componentDidMount() {
    if (!this.props.selectedAnswer) {
      this.timer = setInterval(this.tick, 1000);
    } else {
      this.setState({ questionSubmitted: true });
    }
  }

  render() {
    let submitButtonClass = this.state.questionSubmitted
      ? "trivia-submit-button-clicked"
      : "trivia-submit-button";
    return (
      <div className="trivia-question">
        <div className="question-header">
          <div style={{ width: "100%", textAlign: "center" }}>
            <LinearProgress
              variant="determinate"
              value={this.normalise(this.state.seconds)}
            />
          </div>
          {this.props.currentQuestion.question}
        </div>
        <div className="response-options">
          {this.props.currentQuestion.responses.map((response) => (
            <Button
              key={response.text}
              className={
                response.text === this.props.selectedAnswer
                  ? "response-button-selected"
                  : "response-button-default"
              }
              variant="contained"
              onClick={() => this.props.setTriviaAnswer(response.text)}
            >
              {response.text}
            </Button>
          ))}
        </div>
        <div className="trivia-submit-button-container">
          <Button
            ref={(input) => (this.inputElement = input)}
            className={submitButtonClass}
            onClick={this.submitButtonClicked}
            disabled={this.state.questionSubmitted}
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }
}
TriviaQuestion.propTypes = {
  currentQuestion: PropTypes.object,
  getCurrentQuestion: PropTypes.func,
  completedQuestions: PropTypes.number,
  gotQuestionCompleted: PropTypes.bool,
};
