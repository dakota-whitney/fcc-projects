import Link from "next/link";
import Image from "next/image";
import Container from 'react-bootstrap/Container';
import "./globals.css";

export default function Home() {
  const fcc = new URL("https://www.freecodecamp.org/");

  return (
    <Container fluid={true} className="w-full flex flex-col items-center">
      <h1 className="display-2">Welcome to my first React Projects!</h1>
      <p className="lg:text-4xl text-xl mb-16">
        Initially using the <Link href={fcc.href} target="_blank" className="text-primary">freeCodeCamp</Link> platform
        <br />
        Now using the <Link href="https://nextjs.org/" target="_blank" className="text-primary">Next.js</Link> platform
      </p>
      <Link href={new URL("dakota-whitney", fcc).href} target="_blank" className="text-primary">
        <Image src="/fcc.png" alt="freeCodeCamp Logo" width={250} height={250}></Image>
      </Link>
    </Container>
  );
};
