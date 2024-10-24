"use client"
import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import "../globals.css";

export default function WebCalculator(){
    const [result, setResult] = useState<number>(0);
    const [input, setInput] = useState<string>("0");

    const keypad = [
        ["0", "+", "-", "*"],
        ["1", "2", "3", "/"],
        ["4", "5", "6", "."],
        ["7", "8", "9", "="]
    ];

    const appendInput = (keyStr:string|null): void => setInput(input => {
        const nextInput = input.match(/\.$/) && keyStr === "." ? input : input + keyStr;
        return input.match(/^0/) ? nextInput.slice(1) : nextInput;
    });

    const handleSetInput = ({currentTarget:{textContent}}:React.MouseEvent<HTMLButtonElement>): void => appendInput(textContent);

    const calculateResult = (operator:string|null): void => setResult(result => {
        if(input.match(/(\*|\/|\+|\-)$/) && operator !== "-") return result;
        else if(input.match(/\-{2,}$/)) return result;

        if(operator === "Clear") result = 0;
        else if(input.match(/\(\-\d+$/)) result = eval(`${input})`);
        else if(input.match(/\d+$/)) result = eval(input);

        setInput(operator === "-" && input.match(/\-$/) ? input + `(${operator}` : operator?.match(/\=|Enter|Clear/) ? `${result}` : `${result}` + operator);
        return result;
    });

    const handleSetResult = ({currentTarget:{textContent:operator}}:React.MouseEvent<HTMLButtonElement>): void => calculateResult(operator);

    const handleKeyDown = (e:React.KeyboardEvent) => e.key.match(/[0-9]|\./) ? appendInput(e.key) : e.key.match(/\*|\/|\+|\-|\=|Enter/) ? calculateResult(e.key) : undefined;

    return (
        <CalculatorUI
            result={[result, handleSetResult]}
            input={[input, handleSetInput]}
            keys={[keypad, handleKeyDown]}
        />
    );
};

interface CalculatorProps {
    result: [number, (e: React.MouseEvent<HTMLButtonElement>) => void]
    input: [string, (e: React.MouseEvent<HTMLButtonElement>) => void]
    keys: [string[][], (e:React.KeyboardEvent) => void]
};

function CalculatorUI({result, input, keys}:CalculatorProps){
    const [res, handleSetResult] = result;
    const [inpt, handleSetInput] = input;
    const [keypad, handleKeyDown] = keys;

    return (
        <Container className="flex flex-col h-full justify-center items-center" onKeyDown={handleKeyDown} tabIndex={0}>
            <h1 className="display-3">Dakota&apos;s Web Calculator</h1>
            <Container fluid="true" className="w-3/4">
                <div className="w-full text-left">
                    <Form.Control size="lg" type="text" placeholder={inpt}/>
                    <Form.Text className="px-3">{res}</Form.Text>
                </div>
                {keypad.map((row, i) => {
                    return (
                        <Row className="my-2" key={i}>
                            {row.map((calcKey, j) => {
                                return (
                                    <Col key={j}>
                                        <Button
                                            onClick={`${calcKey}`.match(/\*|\/|\+|\-|\=/) ? handleSetResult : handleSetInput}
                                            className="size-full"
                                            variant={i === 0 || j === 3 ? "primary" : "secondary"}
                                        >
                                            {calcKey}
                                        </Button>
                                    </Col>
                                );
                            })}
                        </Row>
                    ); 
                })}
            </Container>
            <Button variant="danger" size="lg" onClick={handleSetResult}>Clear</Button>
        </Container>
    );
};