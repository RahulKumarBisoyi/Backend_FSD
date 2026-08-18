import fs from "fs/promises";

const fileName = "student.txt";

// Create File
async function createFile() {
    try {
        await fs.writeFile(fileName, "Name: Rahul\nCourse: B.Tech CSE", "utf8");
        console.log("File created successfully");
    } catch (error) {
        console.log("Error creating file:", error);
    }
}

// Read File
async function readFile() {
    try {
        const data = await fs.readFile(fileName, "utf8");
        console.log("File content:");
        console.log(data);
    } catch (error) {
        console.log("Error reading file:", error);
    }
}

// Update File
async function updateFile() {
    try {
        await fs.appendFile(fileName, "\nYear: 2nd Year", "utf8");
        console.log("File updated successfully");
    } catch (error) {
        console.log("Error updating file:", error);
    }
}

// Delete File
async function deleteFile() {
    try {
        await fs.unlink(fileName);
        console.log("File deleted successfully");
    } catch (error) {
        console.log("Error deleting file:", error);
    }
}

// Execute functions
async function main() {
    await createFile();
    await readFile();
    await updateFile();
    await readFile();
    await deleteFile();
}

main();