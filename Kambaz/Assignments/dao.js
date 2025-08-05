import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: assignment._id || uuidv4() };
  Database.assignments.push(newAssignment);
  return newAssignment;
}

export function findAllAssignments() {
  return Database.assignments;
}

export function findAssignmentById(assignmentId) {
  return Database.assignments.find((assignment) => assignment._id === assignmentId);
}

export function findAssignmentsForCourse(courseId) {
  return Database.assignments.filter((assignment) => assignment.course === courseId);
}

export function updateAssignment(assignmentId, assignmentUpdates) {
  const assignmentIndex = Database.assignments.findIndex(
    (assignment) => assignment._id === assignmentId
  );
  
  if (assignmentIndex !== -1) {
    Database.assignments[assignmentIndex] = {
      ...Database.assignments[assignmentIndex],
      ...assignmentUpdates,
    };
    return Database.assignments[assignmentIndex];
  }
  
  return null;
}

export function deleteAssignment(assignmentId) {
  const assignmentIndex = Database.assignments.findIndex(
    (assignment) => assignment._id === assignmentId
  );
  
  if (assignmentIndex !== -1) {
    Database.assignments.splice(assignmentIndex, 1);
    return { status: "ok" };
  }
  
  return { status: "error", message: "Assignment not found" };
}