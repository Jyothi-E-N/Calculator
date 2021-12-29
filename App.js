import "./App.css";
import React from "react";

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operators = ["C", "/", "X", "-", "+"];

const buttons = [
    { id: "clear", val: "C" },
    { id: "divide", val: "/" },
    { id: "multiply", val: "X" },
    { id: "seven", val: "7" },
    { id: "eight", val: "8" },
    { id: "nine", val: "9" },
    { id: "subtract", val: "-" },
    { id: "four", val: "4" },
    { id: "five", val: "5" },
    { id: "six", val: "6" },
    { id: "add", val: "+" },
    { id: "one", val: "1" },
    { id: "two", val: "2" },
    { id: "three", val: "3" },
    { id: "equals", val: "=" },
    { id: "zero", val: "0" },
    { id: "decimal", val: "." },
];

const Key = (props) => {
    return (
        <button
            className="button"
            id={props.button.id}
            onClick={() => props.Click(props.button.val)}
        >
            {props.button.val}
        </button>
    );
};

const Display = (props) => {
    return (
        <div id="disp">
            <span className="exp">{props.exp}</span>
            <span id="display" className="inp">
                {props.input}
            </span>
        </div>
    );
};

const Keyboard = (props) => {
    return buttons.map((key) => <Key button={key} Click={props.handClick} />);
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: "",
            input: "0",
            cmpltExp: "",
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleNumbers = this.handleNumbers.bind(this);
        this.handleOperators = this.handleOperators.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
    }

    handleClick(value) {
        const number = numbers.find((num) => num === value);
        const operator = operators.find((num) => num === value);

        switch (value) {
            case "=":
                this.handleSubmit();
                break;
            case "C":
                this.handleClear();
                break;
            case number:
                this.handleNumbers(value);
                break;
            case operator:
                this.handleOperators(value);
                break;
            case ".":
                this.handleDecimal();
                break;
            default:
                break;
        }
    }

    handleSubmit() {
        console.log("handleSubmit", this.state.cmpltExp);
        const total = eval(this.state.cmpltExp);
        console.log(total);
        this.setState({
            input: `${total}`,
            output: `${total}`,
            cmpltExp: `${total}`,
        });
    }

    handleClear() {
        this.setState({
            input: "0",
            cmpltExp: "",
            result: "",
        });
    }

    handleNumbers(value) {
        const expLen = this.state.cmpltExp.length;
        if (!expLen) {
            this.setState({
                input: value,
                cmpltExp: value,
            });
        } else {
            // to avoid many zeros at the beginning
            if (
                value == "0" &&
                (this.state.cmpltExp == "0" || this.state.input == "0")
            ) {
                this.setState((state) => ({
                    cmpltExp: state.cmpltExp,
                }));
            } else {
                const lastChar = this.state.cmpltExp.charAt(expLen - 1);
                const isLastCharOperator =
                    lastChar === "*" || operators.includes(lastChar);
                if (isLastCharOperator) {
                    this.setState({
                        input: value,
                    });
                } else {
                    this.setState((state) => ({
                        input: `${state.input}${value}`,
                    }));
                }
                this.setState((state) => ({
                    cmpltExp: `${state.cmpltExp}${value}`,
                }));
            }
        }
    }

    handleOperators(value) {
        if (this.state.cmpltExp.length) {
            this.setState({
                input: value,
            });
            const explen = this.state.cmpltExp.length;
            const beforeLastChar = this.state.cmpltExp.charAt(explen - 2);
            const beforeLastCharIsOperator =
                operators.includes(beforeLastChar) || beforeLastChar == "*";
            const lastChar = this.state.cmpltExp.charAt(explen - 1);
            const lastCharIsOperator =
                operators.includes(lastChar) || lastChar == "*";

            const validOp = value == "X" ? "*" : value;
            if (
                (lastCharIsOperator && value != "-") ||
                (beforeLastCharIsOperator && lastCharIsOperator)
            ) {
                if (beforeLastCharIsOperator) {
                    const updatedExp = `${this.state.cmpltExp.substring(
                        0,
                        explen - 2
                    )}${value}`;
                    this.setState({
                        cmpltExp: updatedExp,
                    });
                } else {
                    this.setState((state) => ({
                        cmpltExp: `${state.cmpltExp.substring(
                            0,
                            explen - 1
                        )}${validOp}`,
                    }));
                }
            } else {
                this.setState((state) => ({
                    cmpltExp: `${state.cmpltExp}${validOp}`,
                }));
            }
        }
    }

    handleDecimal() {
        console.log("input", this.state.input);
        const explen = this.state.cmpltExp.length;
        const lastChar = this.state.cmpltExp.charAt(explen - 1);
        if (!explen) {
            this.setState({
                input: "0.",
                cmpltExp: "0.",
            });
        } else {
            if (lastChar === "*" || operators.includes(lastChar)) {
                this.setState((state) => ({
                    input: "0.",
                    cmpltExp: `${state.cmpltExp}0.`,
                }));
            } else {
                if (lastChar == "." || this.state.input.includes(".")) {
                    this.setState((state) => ({
                        input: `${state.input}`,
                    }));
                } else {
                    this.setState((state) => ({
                        input: `${state.input}.`,
                    }));
                }

                const formattedValue =
                    lastChar === "." || this.state.input.includes(".")
                        ? `${this.state.cmpltExp}`
                        : `${this.state.cmpltExp}.`;

                this.setState({
                    cmpltExp: formattedValue,
                });
            }
        }
    }

    render() {
        return (
            <div className="main d-flex flex-column justify-content-center align-items-center">
                <div
                    id="calculator"
                >
                    <Display
                        input={this.state.input}
                        exp={this.state.cmpltExp}
                    />
                    <div className="wrapper">
                        <Keyboard handClick={this.handleClick} />
                    </div>
                </div>
                
            </div>
        );
    }
}

export default App;
