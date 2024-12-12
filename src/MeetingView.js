import React, { useState } from "react";
import { useMeeting, useTranscription, Constants } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";
import Controls from "./Controls";

function MeetingView(props) {
    const [transcript, setTranscript] = useState("Transcription");
    const [transcriptArray, setTranscriptArray] = useState([]);
    const [transcriptState, setTranscriptState] = useState("Not Started");
    const tConfig = { webhookUrl: "https://www.example.com" };
    const { startTranscription, stopTranscription } = useTranscription({
        onTranscriptionStateChanged: (data) => {
            const { status } = data;
            if (status === Constants.transcriptionEvents.TRANSCRIPTION_STARTING) {
                setTranscriptState("Transcription Starting");
            } else if (status === Constants.transcriptionEvents.TRANSCRIPTION_STARTED) {
                setTranscriptState("Transcription Started");
            } else if (status === Constants.transcriptionEvents.TRANSCRIPTION_STOPPING) {
                setTranscriptState("Transcription Stopping");
            } else if (status === Constants.transcriptionEvents.TRANSCRIPTION_STOPPED) {
                setTranscriptState("Transcription Stopped");
            }
        },
        onTranscriptionText: (data) => {
            let { participantName, text, timestamp } = data;
            setTranscript(transcript + `${participantName}: ${text} ${timestamp}`);
            setTranscriptArray(prev => [...prev, `${participantName}: ${text}`]);
        },
    });

    console.log(transcriptArray)

    const { startRecording, stopRecording } = useMeeting();

    const handleStartRecording = () => {
        startRecording("YOUR_WEB_HOOK_URL", "AWS_Directory_Path", {
            layout: { type: "GRID", priority: "SPEAKER", gridSize: 4 },
            theme: "DARK",
            mode: "video-and-audio",
            quality: "high",
            orientation: "landscape",
        });
    };

    const handleStopRecording = () => stopRecording();
    const handleStartTranscription = () => startTranscription(tConfig);
    const handleStopTranscription = () => stopTranscription();

    const [joined, setJoined] = useState(null);
    const { join, participants } = useMeeting({
        onMeetingJoined: () => setJoined("JOINED"),
        onMeetingLeft: () => props.onMeetingLeave(),
    });

    const joinMeeting = () => {
        setJoined("JOINING");
        join();
    };

    return (
        <div className="container">
            <h3>Meeting Id: {props.meetingId}</h3>
            {joined && joined === "JOINED" ? (
                <div>
                    <Controls />
                    <button onClick={handleStartRecording}>Start Recording</button>
                    <button onClick={handleStopRecording}>Stop Recording</button>
                    <button onClick={handleStartTranscription}>Start Transcription</button>
                    <button onClick={handleStopTranscription}>Stop Transcription</button>
                    {[...participants.keys()].map((participantId) => (
                        <ParticipantView participantId={participantId} key={participantId} />
                    ))}
                    <p>State: {transcriptState}</p>
                    <p>{transcript}</p>
                </div>
            ) : joined && joined === "JOINING" ? (
                <p>Joining the meeting...</p>
            ) : (
                <button onClick={joinMeeting}>Join</button>
            )}
        </div>
    );
}

export default MeetingView;