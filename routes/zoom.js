require('dotenv').config();
const axios = require('axios');
const mysql = require('mysql2/promise');
const db = require('../models/connection');

const token ='eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6ImEwNDdlNzc0LTMyNDMtNGVkZC1iNzQwLWU1MGJhNDg5ZTQxMyJ9.eyJ2ZXIiOjksImF1aWQiOiI3MjlhNjFhZGRhMTA0N2E1Mzg5YjZhZGM5ZDNmYzRmMiIsImNvZGUiOiIyN25NQVNJdjZXRTlfMGVuRVJYUWUyc181SUNuR3VWVUEiLCJpc3MiOiJ6bTpjaWQ6MEVMNGZHVkdSN2EwM0hjbk9QbFZsUSIsImdubyI6MCwidHlwZSI6MCwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJISXBCQThBaVM3U2w0Q3RtQzFoWERRIiwibmJmIjoxNzExMTg1NDEzLCJleHAiOjE3MTExODkwMTMsImlhdCI6MTcxMTE4NTQxMywiYWlkIjoiX2VZLUNKS2VRYk9SdFRBaGhLS0FOZyJ9.nyWToWpj7GnrrqKxUmlFF0H8340i9OYDS2RZ089woseWJhXZWxiIFP5lqv527LiqXCuYQU9S7S3EmU6mVCRkDQ'; // Replace with your Zoom API token

async function getMeetings() {
    try {
        const response = await axios.get('https://api.zoom.us/v2/users/me/meetings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error', error);
    }
}

async function createMeeting(topic, start_time, type, duration, timezone, agenda) {
    try {
        const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
            topic,
            type,
            start_time,
            duration,
            timezone,
            agenda,
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: true,
                watermark: false,
                use_pmi: false,
                approval_type: 0,
                audio: 'both',
                auto_recording: 'none'
            }
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        const body = response.data;
        console.log('Meeting created:', body); // Log the created meeting details

        // Insert meeting details into the SQL table
        await insertMeetingIntoDatabase(body);

        return body;
    } catch (error) {
        console.error('Error', error);
    }
}

async function insertMeetingIntoDatabase(meetingDetails) {
    try {
        // Create a MySQL connection
        const connection = await mysql.createConnection(db.config);

        // Insert the meeting details into the database table
        const [rows, fields] = await connection.execute('INSERT INTO zoom_details (meetingDetails) VALUES (?)', [JSON.stringify(meetingDetails)]);

        console.log('Meeting details inserted into the database:', rows);

        // Close the connection
        await connection.end();
    } catch (error) {
        console.error('Error inserting meeting into database:', error);
    }
}

(async () => {
    console.log(await getMeetings());
    const createdMeeting = await createMeeting('CraftMeeting', '2024-3-20T10:00:00', 2, 45, 'UTC', 'Team meeting for future videos');
    console.log(await getMeetings());
})();