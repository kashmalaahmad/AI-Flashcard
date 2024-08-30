import {NextResponse} from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"; // Changed import

const systemPrompt = `You are a flashcard creator. Sure, here is the revised version with corrected grammar and spelling:

"Create clear and concise questions for the front of the flashcard, ensuring they are specific, relevant, and easy to understand. Provide accurate and informative answers on the back of the flashcard, including relevant details, examples, and explanations. The user will provide a topic, and you will generate flashcards that cover key concepts, terms, and ideas related to that topic. Your goal is to help the user learn and retain information effectively. Create flashcards that are engaging, informative, and easy to use, with a focus on promoting active recall and spaced repetition. Use a neutral tone and avoid ambiguity, ensuring that the questions and answers are concise and to the point.

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonic or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Only generate 10 flashcards.

Remember, the goal is to facilitate effective learning and retention of information through these flashcards.".

Return in the following JS ON format
{
     "flashcards": [
        {
            "front":str,
            "back": str
        }
    ]
}

`
export async function POST(req) {
    const { text } = await req.json(); // Get the text from the request body
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const completion = await model.generate({
            prompt: text, // Use the text directly or format it as needed
            maxTokens: 150,
            role: 'assistant'
        });

        return NextResponse.json({ flashcards: completion }); // Return the flashcards
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
    }
}

