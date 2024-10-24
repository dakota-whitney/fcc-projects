"use client";
import { useState } from 'react';
import Link from "next/link";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import "../globals.css";

export default function AdviceMachine(){
    const [show, setShow] = useState<boolean>(false);
    const [advice, setAdvice] = useState<string>("");
    const [adviceList, setAdviceList] = useState<string[]>([]);

    const adviceApi = new URL("https://api.adviceslip.com/");

    const handleSetAdvice = async (): Promise<undefined> => {
        const { slip } = await fetch(new URL("advice", adviceApi)).then(res => res.json());
        setAdvice(slip.advice);
        setShow(true);
    };

    const handleSetAdviceList = (): void => {
        setAdviceList(adviceList => adviceList.includes(advice) ? adviceList : [...adviceList, advice]);
        setShow(false);
    };

    return (
        <AdviceUI
            api={adviceApi}
            modalState={[show, setShow]}
            adviceState={[advice, handleSetAdvice]}
            adviceListState={[adviceList, handleSetAdviceList]}
        />
    );
};

interface AdviceProps {
    api: URL
    modalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    adviceState: [string,  () => void]
    adviceListState: [string[],  () => void]
};

function AdviceUI({api, modalState, adviceState, adviceListState}:AdviceProps){
    const [show, setShow] = modalState;
    const [advice, handleSetAdvice] = adviceState;
    const [adviceList, handleSetAdviceList] = adviceListState;

    return (
        <Container className="flex flex-col h-full justify-center items-center">
            <h1 className="display-3">Dakota&apos;s Advice Machine</h1>
            <p className="lg:text-4xl text-xl">
                This app fetches positive vibes from
                <Link href={api.href} target="_blank" className="text-primary"> The Advice API</Link>
            </p>
            <Button variant="primary" size="lg" className="my-16" onClick={handleSetAdvice}>Get Advice</Button>
            <ListGroup>
                {adviceList.map((slip, i) => <ListGroup.Item key={i}>{slip}</ListGroup.Item>)}   
            </ListGroup>
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{advice}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSetAdviceList}>Pin</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};