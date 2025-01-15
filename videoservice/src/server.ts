import { promises } from "dns";
import express from "express";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { WebSocketServer, WebSocket } from "ws";

const PORT = 8080;
const app = express();

// Store meetings and participants
const meetings: { [meetingId: string]: WebSocket[] } = {};

// Generate a new meeting link
app.get("/create-meeting", (req:Request, res:Response) => {
    const meetingId = uuid(); // Generate a unique meeting ID
    res.json({ meetingLink: `http://localhost:${PORT}/meeting/${meetingId}` });
    console.log(`New meeting created: ${meetingId}`);
});

// Join a meeting
app.get("/meeting/:meetingId", (req: Request, res: Response) :void=> {
    const { meetingId } = req.params;

    if (!meetingId) {
         res.status(400).send("Meeting ID is required");
    }

    // Check if the meeting exists (optional for now)
    if (!meetings[meetingId]) {
        meetings[meetingId] = []; // Create a new meeting room if it doesn't exist
    }

    res.send(`Welcome to meeting: ${meetingId}`);
});

// Start the Express server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// WebSocket server for signaling
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket connection");
    let currentMeetingId: string | null = null;

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());

            if (data.type === "join") {
                currentMeetingId = data.meetingId;

                if (!currentMeetingId) {
                    return;
                }

                if (!meetings[currentMeetingId]) {
                    meetings[currentMeetingId] = [];
                }

                meetings[currentMeetingId].push(ws);
                console.log(`User joined meeting: ${currentMeetingId}`);

                // Notify others in the meeting
                meetings[currentMeetingId].forEach((peer) => {
                    if (peer !== ws) {
                        peer.send(
                            JSON.stringify({ type: "user-joined", peerId: data.peerId })
                        );
                    }
                });
            } else if (data.type === "signal") {
                if (currentMeetingId && meetings[currentMeetingId]) {
                    meetings[currentMeetingId].forEach((peer) => {
                        if (peer !== ws) {
                            peer.send(JSON.stringify(data));
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");

        if (currentMeetingId && meetings[currentMeetingId]) {
            meetings[currentMeetingId] = meetings[currentMeetingId].filter((peer) => peer !== ws);

            if (meetings[currentMeetingId].length === 0) {
                delete meetings[currentMeetingId];
                console.log(`Meeting ${currentMeetingId} closed (no participants)`);
            }
        }
    });
});
