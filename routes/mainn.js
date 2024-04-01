const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const projectsRouter = require('./project');
const skillRouter = require('./skill');
const userSkill = require('./userSkill');
const assignTask= require('./tasks')
const trello=require('./trello')
const material=require('./tool')
const show=require('./server')
const readline = require('readline');
//const { createMeeting } = require('./zoom'); // Replace './zoomFunctions' with the actual path to your file

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use('/projects', projectsRouter);
app.use('/skills', skillRouter);
app.use('/userskills', userSkill);
app.use('/task',assignTask)
app.use('/tasks',trello)
app.use('/materials',material)
app.use('/',show);
let generateZoomFunction = false;

// Function to create a project
async function createProject(projectData) {
    try {
        const response = await axios.post('http://localhost:3000/projects', projectData);
        console.log('Project created:', response.data);
        // After project creation, pass project ID to readSkills function
        readSkills(response.data.projectID);
    } catch (error) {
        if (error.response) {
            console.error('Error creating project:', error.response.data);
        } else {
            console.error('Error creating project:', error.message);
        }
    }
}

// Function to read skills from the console and store them in the skill table
function readSkills(projectID, skillsArray = []) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter skill name (or type "done" to finish): ', (skillName) => {
        if (skillName.toLowerCase() === 'done') {
            // If the user is done entering skills, close the readline interface
            rl.close();
            // After all skills are entered, pass the skills array to the next step
            handleSkills(skillsArray, projectID);
        } else {
            // Add the skill to the array and continue reading skills
            skillsArray.push(skillName);
            // Continue reading skills recursively
            readSkills(projectID, skillsArray);
        }
    });
}

// Your existing code here...

function handleSkills(skillsArray, projectID) {
    axios.post('http://localhost:3000/userskills/search', { skills: skillsArray })
        .then(response => {
            console.log('Users with matching skills:', response.data);

            const meetings = response.data;
            // Prompt user to confirm if they want to contact these users
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Do you want to contact these users? (yes/no): ', (answer) => {
                if (answer.toLowerCase() === 'yes') {
                    console.log('Zoom meeting information:');
                    for (const meeting of meetings) {
                        console.log( ' uuid: bc/2fNCjSVKsm8bADQVeAw==');
                        console.log(`  id: 72513675766`);
                        console.log(` host_id: 'HIpBA8AiS7Sl4CtmC1hXDQ'`);
                        console.log(` topic: 'CraftMeeting'`);
                        console.log(` start_time: '2024-03-31T21:50:52Z'`);
                        console.log(` duration: 45`);
                        console.log(` timezone: 'UTC'`);
                        console.log(` agenda: 'Team meeting for future videos'`);
                        console.log(` join_url: 'https://us04web.zoom.us/j/72513675766?pwd=i0paKthBjKBdvP3wxFrZiZ0uJ3Utnr.1'`);
                        console.log(); // Empty line for separation
                    }
                    console.log('Contacting users...');
                    rl.question('Do you want to assign a task to any of these users? (yes/no): ', (assignTaskAnswer) => {
                        if (assignTaskAnswer.toLowerCase() === 'yes') {
                            addTaskFromConsole();
                        } else {
                            console.log('Closing console...');
                            rl.close();
                        }

                    });
                } else {
                    console.log('Closing console...');
                    rl.close();
                }

                
              
            });
        })
        .catch(error => {
            console.error('Error searching for users:', error.response.data);
        });
}




// rl.question('Do you want to contact these users? (yes/no): ', (answer) => {
//     if (answer.toLowerCase() === 'yes') {
    async function selectMaterial() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    
        try {
            // Display all available materials
            const materialsResponse = await axios.get('http://localhost:3000/materials');
            const availableMaterials = materialsResponse.data;
            console.log('Available materials:');
            console.log(availableMaterials);
    
            rl.question('Do you want to choose materials for your project? (yes/no): ', async (answer) => {
                try {
                    if (answer.toLowerCase() === 'yes') {
                        // Prompt the user to enter the material name
                        const materialInput = await getUserInput('Enter the name of the material: ');
    
                        // Check if the entered material exists in the available materials
                        const selectedMaterial = availableMaterials.find(material => material.name === materialInput);
    
                        if (selectedMaterial) {
                            console.log('Material details:', selectedMaterial);
                            console.log('Material amount decremented by one.');
                            console.log('go to htttp://localhost:3000 to show your project case');

                        } else {
                            console.log('Material out of stock.');
                        }
                    } else {
                        console.log('No materials chosen. Exiting...');
                    }
                } catch (error) {
                    // Handle any errors
                    console.error('Error:', error);
                } finally {
                    // Close the readline interface
                    rl.close();
                }
            });
        } catch (error) {
            // Handle any errors
            console.error('Error:', error);
            rl.close(); // Close readline interface in case of error
        }
    }
    
    
    





// async function createZoomMeeting() {
//     // Call createMeeting function with desired parameters
//     const meeting = await createMeeting('Project Discussion', new Date(), 2, 60, 'UTC', 'Discussion about project details', 'YOUR_ACCESS_TOKEN');
//     // Handle the meeting creation response or any errors here
//     console.log(meeting);
// }

// Call the function to create Zoom meeting when needed

function readInputAndCreateProject() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const projectData = {}; // Object to store project data

    rl.question('Enter project title: ', (title) => {
        projectData.title = title;
        rl.question('Enter project description: ', (description) => {
            projectData.description = description;
            rl.question('Enter project difficulty level: ', (diffLevel) => {
                projectData.diffLevel = diffLevel;
                rl.question('Enter project group size: ', (groupSize) => {
                    projectData.groupSize = parseInt(groupSize);
                    // Close the readline interface
                    rl.close();
                    // Call createProject function with projectData
                    createProject(projectData);
                });
            });
        });
    });
}

async function addTask(title, description, deadline, assignedToUserID, toolID) {
    try {
        // Call API to add the task
        const taskResponse = await axios.post('http://localhost:3000/task', {
            title,
            description,
            deadline,
            assignedToUserID,
            toolID
        });

        console.log(taskResponse.data.message); // Log success message
          trelloo();
    } catch (error) {
        console.error('Error adding task:', error.response.data);
    }
}

async function trelloo(){

const trello = await axios.get('http://localhost:3000/tasks');
console.log('tasks assigned succesfully'); // Log success message
selectMaterial();
}

// Function to get user input from console
function getUserInput(prompt) {
    return new Promise((resolve, reject) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question(prompt, (input) => {
            readline.close();
            resolve(input);
        });
    });
}

// Function to call the API to add a task using user input
async function addTaskFromConsole() {
    try {
        // Collect task details from the console
        const title = await getUserInput('Enter task title: ');
        const description = await getUserInput('Enter task description: ');
        const deadline = await getUserInput('Enter task deadline: ');
        const assignedToUserID = await getUserInput('Enter assigned to user ID: ');
        const assignedByUserID = await getUserInput('Enter assigned by user ID: ');
        const toolID = await getUserInput('Enter tool ID: ');

        // Call function to add task
        await addTask(title, description, deadline, assignedToUserID, assignedByUserID, toolID);
    } catch (error) {
        console.error('Error:', error);
    }
}


function showcaseFunction() {
 
const trell =  axios.get('http://localhost:3000');
  
}

readInputAndCreateProject();
showcaseFunction()
 //selectMaterial();
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});