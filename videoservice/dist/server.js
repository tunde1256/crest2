"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const ws_1 = require("ws");
const PORT = 8080;
const app = (0, express_1.default)();
// Store meetings and participants
const meetings = {};
// Generate a new meeting link
app.get("/create-meeting", (req, res) => {
    const meetingId = (0, uuid_1.v4)(); // Generate a unique meeting ID
    res.json({ meetingLink: `http://localhost:${PORT}/meeting/${meetingId}` });
    console.log(`New meeting created: ${meetingId}`);
});
// Join a meeting
app.get("/meeting/:meetingId", (req, res) => {
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
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (ws) => {
    console.log("New WebSocket connection");
    let currentMeetingId = null;
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
                        peer.send(JSON.stringify({ type: "user-joined", peerId: data.peerId }));
                    }
                });
            }
            else if (data.type === "signal") {
                if (currentMeetingId && meetings[currentMeetingId]) {
                    meetings[currentMeetingId].forEach((peer) => {
                        if (peer !== ws) {
                            peer.send(JSON.stringify(data));
                        }
                    });
                }
            }
        }
        catch (error) {
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
