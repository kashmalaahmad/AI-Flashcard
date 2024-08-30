"use client";

import { SignUp } from '@clerk/nextjs'
import {Container, AppBar, ToolBar, Typography, Button, Link, Box} from '@mui/material'

export default function SignUpPage(){
    return <Container maxWidth = "100vw">
        <AppBar position = "static" sx = {{backgroundColor: "#3f51b5"}}>
            <ToolBar>
                <Typography variant = 'h6' sx={{
                    felxGrow: 1
                }}>
                    Flashcard SaaS
                </Typography>
                <Button color = "inherit">
                    <Link href = "/sign-in" passHref>
                    Login
                    </Link>
                </Button>
                <Button color = "inherit">
                    <Link href = "/sign-up" passHref>
                    Sign Up
                    </Link>
                </Button>
            </ToolBar>
        </AppBar>

        <Box
            display = "flex" flexDirection = "column" alignItems = "center" justifyContent = "center"
        >
            <Typography variant = "h4">
                Sign Up
            </Typography>
            <SignUp />
        </Box>
    </Container>
}