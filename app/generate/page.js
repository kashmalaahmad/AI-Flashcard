'use client'

import {useUser} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'
import {db} from '@/firebase'
import {doc, collection, setDoc, getDoc, writeBatch} from 'firebase/firestore'
import { useState } from 'react'; // Added import for useState
import { Container, Box, Typography, TextField, Button, CardActionArea, DialogContentText, DialogActions, DialogContent, Dialog, Grid, Link, Paper, CardContent, Card, DialogTitle} from '@mui/material';

export default function Generate(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type to JSON
                },
                body: JSON.stringify({ text }), // Send the text as JSON
            });

            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }

            const data = await response.json(); // Parse the JSON response
            setFlashcards(data.flashcards); // Adjust based on your API response structure
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to fetch flashcards. Please try again.'); // Optional: alert the user
        }
    }

    const handleCardClick = (id) => {
        setFlipped ((prev) => ({
            ...prev,
            [id]: !prev[id],

        }))
    }
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const saveFlashcards = async () => {
        if(!name) {
            alert ('Please enter a name')
            return
        }
        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert ('Flashcard collection with the same name already exists.')
                return
            } else {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge:true})
            }
        }
        else {
            batch.set(userDocRef, {flashcards: [{name}]})
        }
        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return ( <Container maxWidth ="md">
    <Box sx={{
        mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}
    >
        <Typography variant = "h4">
            Generate Flashcards
        </Typography>
        <Paper sx={{p:4, width:'100%'}}>
            <TextField value = {text} onChange={(e)=> setText(e.target.value)} label="Enter Text"
            fullWidth
            multiline
            rows={4}
            variant = "outlined"
            sx = {{
                mb:2,
            }}
            />
            <Button
              variant = "contained"
              color = "primary"
              onClick = {handleSubmit}
              fullWidth
            >
                {' '}
                Submit
            </Button>
        </Paper>
    </Box>

    {flashcards.length>0 && (
        <Box sx= {{mt: 4}} >
            <Typography variant = "h5"> Flashcards Preview</Typography>
            <Grid container spacing ={3}>
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
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        transform: flipped [index]
                                        ? 'rotateY(180deg)'
                                        : 'rotateY(0deg)',
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
            <Box sx={{mt:4, display: 'flex', justifyContent: 'center'}}>
                <Button variant = "contained" color="secondary" onClick={handleOpen}>
                    Save
                </Button>
            </Box>
        </Box>
    )}
    <Dialog open = {open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Please enter a name for your flashcards collection!
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                label="Collection Name"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)} // Corrected spelling and defined the event handler
                variant = "outlined"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick ={handleClose}>Cancel</Button>
            <Button onClick ={saveFlashcards}>
                Save
            </Button>
        </DialogActions>
      </Dialog>
    </Container>
    )
}