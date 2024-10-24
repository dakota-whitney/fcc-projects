"use client"
import { useState } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import "../globals.css";

export default function DigitalDrumset(){
    const drums:Map<string, string> = new Map([
        ["Q", "small-crash"],
        ["W", "big-crash"],
        ["A", "open-hihat"],
        ["S", "left-tom"],
        ["D", "right-tom"],
        ["E", "ride-cymbal"],
        ["Z", "closed-hihat"],
        ["X", "snare-drum"],
        ["C", "bass-drum"]
    ]);

    const [drum, setDrum] = useState<string|undefined>("");

    const playDrum = (audio:HTMLAudioElement, kKey:string): void => {
        audio.play();
        setDrum(drums.get(kKey));
        setTimeout(() => setDrum(""), 1000);
    };

    const drumClick = ({currentTarget}:React.MouseEvent<HTMLButtonElement>): void => playDrum(
        //@ts-expect-error Audio element was not found
        currentTarget.nextElementSibling,
        currentTarget.textContent
    );

    const drumKeydown = ({key}:React.KeyboardEvent): void => drums.has(key.toUpperCase()) ? playDrum(
        //@ts-expect-error Audio element was not found
        document.getElementById(key.toUpperCase())?.children[1],
        key.toUpperCase()
    ) : console.log(key);

    return (
        <DrumsetUI
            drums={drums}
            drum={drum}
            handleClick={drumClick}
            handleKeyDown={drumKeydown}
        />
    );
};

interface DrumsetProps {
    drums: Map<string, string>
    drum: string|undefined
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    handleKeyDown: (e: React.KeyboardEvent) => void
};

function DrumsetUI({drums, drum, handleClick, handleKeyDown}:DrumsetProps){
    const drumKeys = Array.from(drums);

    return (
        <Container className="flex flex-col h-full justify-center items-center" onKeyDown={handleKeyDown} tabIndex={0}>
            <h1 className="display-3">Dakota&apos;s Digital Drumset</h1>
            <div className="w-1/2 my-12">
                <div className="flex flex-row justify-between">
                    {drumKeys.slice(0, 2).map(([key, drumId], i) => {
                        return (
                            <DrumPad key={i} drumId={drumId} keyboardKey={key} handleClick={handleClick}/>
                        );
                    })}
                </div>
                <div className="flex flex-row justify-around">
                    {drumKeys.slice(2, 6).map(([key, drumId], i) => {
                        return (
                            <DrumPad key={i + 2} drumId={drumId} keyboardKey={key} handleClick={handleClick}/>
                        );
                    })}
                </div>
                <div className="flex flex-row justify-evenly">
                    {drumKeys.slice(6).map(([key, drumId], i) => {
                        return (
                            <DrumPad key={i + 6} drumId={drumId} keyboardKey={key} handleClick={handleClick}/>
                        );
                    })}
                </div>
            </div>
            <p className="text-xl">{drum}</p>
        </Container>
    );
};

interface DrumPadProps {
    drumId: string
    keyboardKey: string,
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void
};

function DrumPad({drumId,keyboardKey,handleClick}:DrumPadProps){
    return (
        <div id={keyboardKey}>
            <Button variant="primary" size="lg" className="text-2xl shadow" onClick={handleClick}>{keyboardKey}</Button>
            <audio>
                <source src={`/drums/${drumId}.wav`} type="audio/wav"></source>
            </audio>
        </div>
    );
};