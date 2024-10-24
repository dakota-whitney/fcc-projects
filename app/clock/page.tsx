"use client"
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import "../globals.css";

type MinuteControls = {
    arrow_circle_up: () => void,
    arrow_circle_down: () => void
};

type TimerID = NodeJS.Timeout | string | number | undefined;

export default function SessionTimer(){
    const initialTime = new Date();

    const [sessionMinutes, setSessionMinutes] = useState<number>(25);
    const [breakMinutes, setBreakMinutes] = useState<number>(5);

    initialTime.setMinutes(sessionMinutes, 0);
    const [time, setTime] = useState<Date>(initialTime);
    const [sessionActive, setSessionActive] = useState<boolean>(true);
    const [timerId, setTimerId] = useState<TimerID>(0);

    const decrementSeconds = (): void => {
        setTime(time => {
            const seconds = time.getSeconds();
            const newSeconds = new Date(time);
            if(time.getMinutes() === 0 && seconds === 0){
                //@ts-expect-error Audio element was not found
                document.getElementById("beep").play();
                setSessionActive(sessionActive => {
                    newSeconds.setMinutes(sessionActive ? sessionMinutes - 1 : breakMinutes - 1);
                    return !sessionActive
                });

            };
            newSeconds.setSeconds(seconds - 1);
            return newSeconds;
        });
    };

    const startTimer = (): void => !timerId ? setTimerId(setInterval(decrementSeconds, 1000)) : setTimerId(timerId);
    const stopTimer = (): void => setTimerId((tId:TimerID) => {
        clearInterval(tId);
        return 0;
    });
    const resetTimer = (): void => {
        setTime(() => {
            stopTimer();
            const defaultTime = new Date();
            defaultTime.setMinutes(25);
            defaultTime.setSeconds(0);
            setSessionMinutes(defaultTime.getMinutes());
            setBreakMinutes(5);
            return defaultTime;
        });
    };

    const setMinutes = (minutes:number, increment:number, changeTime:boolean): number => {
        const newMinutes = minutes + increment;
        minutes = increment > 0 ? minutes < 60 ? newMinutes : minutes : minutes > 1 ? newMinutes : minutes;
        if(changeTime){
            const newTime = new Date(time);
            newTime.setMinutes(minutes);
            setTime(newTime);
        };
        return minutes;
    };

    const sessionControls: MinuteControls = {
        arrow_circle_up: () => setSessionMinutes(minutes => setMinutes(minutes, 1, sessionActive)),
        arrow_circle_down: () => setSessionMinutes(minutes => setMinutes(minutes, -1, sessionActive))
    };

    const breakControls: MinuteControls = {
        arrow_circle_up: () => setBreakMinutes(minutes => setMinutes(minutes, 1, !sessionActive)),
        arrow_circle_down: () => setBreakMinutes(minutes => setMinutes(minutes, -1, !sessionActive))
    };

    return (
        <TimerUI
            session={sessionMinutes}
            sessionControls={sessionControls}
            sessionActive={sessionActive}
            break={breakMinutes}
            breakControls={breakControls}
            time={time}
            timerId={timerId}
            start={startTimer}
            stop={stopTimer}
            reset={resetTimer}
        />
    );
};

interface TimerProps {
    session: number
    sessionControls: MinuteControls
    sessionActive: boolean
    break: number
    breakControls: MinuteControls
    time: Date
    timerId: TimerID
    start: () => void
    stop: () => void
    reset: () => void
};

function TimerUI(props:TimerProps){
    return (
        <Container>
            <h1 className="display-3">Dakota&apos;s 25/5 Timer</h1>
            <div className="flex flex-row justify-around my-8">
                <TimerControls
                    variant="primary"
                    minutes={props.session}
                    controls={props.sessionControls}
                />
                <TimerControls
                    variant="secondary"
                    minutes={props.break}
                    controls={props.breakControls}
                />
            </div>
            <h2 className="display-5">
                {props.sessionActive ? "Session" : "Break"}
                <br />
                {
                    (props.sessionActive && props.session == 60) || (!props.sessionActive && props.break == 60) ?
                    "60:00" : 
                    props.time.toTimeString().substring(3, 8)
                }
            </h2>
            <ButtonGroup size="lg" className="w-80">
                <Button variant="primary" onClick={props.timerId ? props.stop : props.start}>
                    <span className="material-symbols-outlined">{props.timerId ? "pause" : "timer"}</span>
                </Button>
                <Button variant="secondary" onClick={props.reset}>
                    <span className="material-symbols-outlined">refresh</span>
                </Button>
            </ButtonGroup>
            <audio id="beep">
                <source src="/clock/beeps.wav" type="audio/wav"></source>
            </audio>
        </Container>
    );
};

interface ControlProps {
    variant: string
    minutes: number
    controls: MinuteControls
};

function TimerControls({variant, controls, minutes}:ControlProps){
    const buttons = Object.entries(controls);

    return (
        <ButtonGroup size="lg" className="w-48">
            <div className="flex flex-col w-full">
                <h2 className="display-5">{variant == "primary" ? "Session" : "Break"}</h2>
                <div className="flex flex-row justify-evenly">
                    {buttons.map(([icon, handleSetMinutes], i) => {
                        return (
                            <Button key={i} variant={variant} onClick={handleSetMinutes}>
                                <span className="material-symbols-outlined">{icon}</span>
                            </Button>
                        );
                    })}
                </div>
                <h3 className="display-6">{minutes}</h3>
            </div>
        </ButtonGroup>
    );
};