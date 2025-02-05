'use client'

import {useUser} from '@clerk/nextjs'
import { useState, useEffect } from 'react';

import {doc, collection, setDoc, getDoc, getDocs } from 'firebase/firestore'; // Add getDocs here
import {db} from '@/firebase'
import {useSearchParams} from 'next/navigation'
import { Container, Box, Typography, TextField, Button, CardActionArea, DialogContentText, DialogActions, DialogContent, Dialog, Grid, Link, Paper, CardContent, Card, DialogTitle} from '@mui/material';


export default function Flashcard(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcards() {
            try {
                const response = await fetch('/api/flashcards'); // Adjust the endpoint as necessary
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setFlashcards(data.flashcards); // Adjust based on your API response structure
            } catch (error) {
                console.error('Failed to fetch flashcards:', error);
                alert('Failed to fetch flashcards. Please try again.'); // Show user-friendly message
            }
        }

        getFlashcards();
    }, [user, search]);

    const handleCardClick = (id) => {
        setFlipped ((prev) => ({
            ...prev,
            [id]: !prev[id],

        }))
    }

    if(!isLoaded || !isSignedIn) {
        return<></>
    }

    return (
        <Container maxWidth = "100vw">
            <Grid container spacing = {3} sx={{mt: 4}}>
       
                {flashcards.map((flashcard, index) => (
                    <Grid item xs = {12} sm = {6} md = {4} key= {index}>
                        <Card>
                            <CardActionArea
                            onClick ={()=>{
                                handleCardClick(index)
                            }}
                            >

                            <CardContent>
                                <Box
                                   sx={{
                                    perspective: '1000px',
                                    '& > div': {
                                        transition: 'transform 0.6s',
                                        transformStyle: 'preserve-3d',
                                        position: 'relative',
                                        width: '100%',
                                        height: '200px',
                                        BoxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        transform: flipped [index]
                                        ? 'rotateY(180deg)'
                                        : 'rotateY (0deg)',
                                     },
                                     '& > div > div': {
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backfaceVisibility: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 2,
                                        boxSizing: 'border-box'
                                     },
                                     '& > div > div:nth-of-type(2)': {
                                        transform: 'rotateY(180deg)'
                                     },
                                   }}
                                >
                                    <div>
                                        <div>
                                            <Typography
                                            variant = "h5"
                                            component = "div"
                                            >
                                                {flashcard.front}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography
                                            variant = "h5"
                                            component = "div"
                                            >
                                                {flashcard.back}
                                            </Typography>
                                        </div>
                                    </div>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                ))}
        
        </Grid>
    </Container>
)



