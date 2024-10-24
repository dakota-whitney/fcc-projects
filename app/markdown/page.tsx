"use client";
import { useState } from 'react';
import Markdown from "react-markdown";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import "../globals.css";

export default function MarkdownPreviewer(){
    const [markdown, setMarkdown] = useState<string>("# Your **markdown**");
    const handleChange = ({currentTarget:{value}}:React.ChangeEvent<HTMLTextAreaElement>): void => setMarkdown(value);

    return (
        <MarkdownUI md={markdown} handleChange={handleChange} />
    );
};

interface MarkdownProps {
    md: string
    handleChange: (e:React.ChangeEvent<HTMLTextAreaElement>) => void
};

function MarkdownUI({md, handleChange}:MarkdownProps){
    return (
        <Container className="flex flex-col h-full justify-center items-center">
            <h1 className="display-3">Dakota&apos;s Markdown Previewer</h1>
            <Form.Control
                as="textarea"
                rows={10}
                size="lg"
                className="mt-16 mb-8"
                value={md}
                onChange={handleChange}
            />
            <Markdown className="w-full text-5xl">{md}</Markdown>
        </Container>
    );
};