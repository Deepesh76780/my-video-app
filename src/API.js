// API.js
export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJlMWI1Mjg2ZC04YjkxLTRjMTMtYjdlMC01YTU0YTYyNTdmMWQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczMzk5NTQ1MSwiZXhwIjoxNzM2NTg3NDUxfQ.ugqpmSH8c95-A6UztebWNMKJr-ivl_9-jPTYWuTDSBg";

export const createMeeting = async ({ token }) => {
    const response = await fetch("https://api.videosdk.live/v1/meetings", {
        method: "POST",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data.meetingId;
};
