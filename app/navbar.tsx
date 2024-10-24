"use client"
import Image from "next/image";
import { Container, Navbar, Nav } from 'react-bootstrap';

type AppBrand = {
    icon: string
    alt: string
    title: string
};

type AppLink = {
    href: string
    icon: string
    name: string
};

export default function NavBar({appBrand, appLinks}:{appBrand:AppBrand, appLinks: AppLink[]}){
    return (
        <Navbar bg="primary" expand="md" className="p-0 w-full">
            <Container fluid={true} className="m-0 p-0 h-full">
                <Navbar.Brand href="/" className="p-0 m-0 md:h-full md:w-1/4 !flex flex-row justify-evenly text-center items-center">
                <Image src={appBrand.icon} alt={appBrand.alt} width={75} height={75}></Image>
                {appBrand.title}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto w-full">
                    {appLinks.map(({href, icon, name}, i) => {
                        return (
                            <Nav.Link key={i} href={href} className="p-0 w-full h-30 text-center">
                                <span className="material-symbols-outlined">{icon}</span>
                                <br />
                                <span>{name}</span>
                            </Nav.Link>
                        );
                    })}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};