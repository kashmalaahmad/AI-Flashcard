'use client'

import Image from "next/image";
import getStripe from '../utils/get-stripe'
import {SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import {Container, Typography, Grid, Button, AppBar, Toolbar, Box} from '@mui/material'
import Head from 'next/head'
import { grey } from "@mui/material/colors";
import { useRouter } from 'next/navigation'; // Correct import for app directory

export default function Home() {
  const router = useRouter(); // Initialize useRouter

  const handleGetStarted = () => {
    console.log("Get Started button clicked");
    router.push('/generate'); // Use the relative path to the page
  };

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000'
      },
    })

    console.log('Response:', checkoutSession);

    if (!checkoutSession.ok) {
      // Handle error response
      console.error('Error fetching checkout session:', checkoutSession.status, checkoutSession.statusText);
      return; // Exit or handle the error appropriately
    }

    const textResponse = await checkoutSession.text(); // Get the response as text
    if (!textResponse) {
      console.error('Empty response received');
      return; // Handle empty response
    }

    const checkoutSessionJson = JSON.parse(textResponse); // Parse the text response

    if(checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} =await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
    if (error) {
      console.warn(error.message)
    }
  } 
  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name = "description" content = "Create flashcard from your text"/>
      </Head>
      <AppBar position = "static">
        <Toolbar>
          <Typography variant = "h6" style ={{flexGrow: 1}} >Flashcard SaaS</Typography>
          <SignedOut>
            <Button color = "inherit" href ="/sign-in">
            {' '}
            Login</Button>
            <Button color = "inherit"href ="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton  />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx= {{
        textAlign: 'center', my: 4,
      }}>
        <Typography variant = "h2" gutterBottom>Welcome to Flashcard SaaS</Typography>
        <Typography variant = "h5" gutterBottom>
          {' '}
          The easiest way to make flashcards from your text
        </Typography>
        <Button variant = 'contained' color = 'primary' sx ={{mt: 2}} onClick={handleGetStarted}>
          Get Started
        </Button>
      </Box>
      <Box sx= {{my: 6}}>
        <Typography variant = "h4" gutterBottom>
          Features
        </Typography>
        <Grid container spacing = {4}>
          <Grid item xs = {12} md = {4}>
            <Typography variant = "h6" gutterBottom>Easy Text Input</Typography>
            <Typography> 
              {' '}
              Simply Input your text and let our software do the rest. Creating flashcards has never been easier! </Typography>
          </Grid>
          <Grid item xs = {12} md = {4}>
            <Typography variant = "h6" gutterBottom>Smart Flashcards</Typography>
            <Typography> 
              {' '}
              Our AI intelligently breaks down your text into concise flashcard, perfect for studying</Typography>
          </Grid>
          <Grid item xs = {12} md = {4}>
            <Typography variant = "h6" gutterBottom>Accessible Anywhere</Typography>
            <Typography> 
              {' '}
              Access your flashcards from any device, at any time. Study on the go with ease. </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my:6, textAlign: 'center'}}>
      <Typography variant = "h4" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing = {4}>
          <Grid item xs = {12} md = {6}>
            <Box 
            sx ={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
            <Typography variant = "h5" gutterBottom>Basic</Typography>
            <Typography variant = "h6" gutterBottom>$5 / Month</Typography>
            <Typography> 
              {' '}
              Access to Basic flashcard features and limited storage. </Typography>
              <Button variant = "contained" color = "primary" sx={{mt: 2}}
              >Choose Basic</Button>
              </Box>
          </Grid>
          <Grid item xs = {12} md = {6}>
          <Box 
            sx ={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
            <Typography variant = "h5" gutterBottom>Pro</Typography>
            <Typography variant = "h6" gutterBottom>$10 / Month</Typography>
            <Typography> 
              {' '}
              Unlimited flashcards and storage, with priority support.  </Typography>
              <Button variant = "contained" color = "primary" sx={{mt: 2}} onClick={handleSubmit}
              >Choose Pro</Button>
              </Box>
              </Grid>
        </Grid>
      </Box>
    </Container>
  );
}