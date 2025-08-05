import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Create a new assignment
  app.post("/api/courses/:cid/assignments", async (req, res) => {
    try {
      const { cid } = req.params;
      const assignment = { ...req.body, course: cid };
      const newAssignment = await assignmentsDao.createAssignment(assignment);
      res.status(201).json(newAssignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ 
        status: "error",
        message: "Server error while creating assignment",
        error: error.message
      });
    }
  });

  // Get all assignments
  app.get("/api/assignments", async (req, res) => {
    try {
      const assignments = await assignmentsDao.findAllAssignments();
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching all assignments:", error);
      res.status(500).json({
        status: "error",
        message: "Server error while fetching assignments",
        error: error.message
      });
    }
  });

  // Get assignments for a specific course
  app.get("/api/courses/:cid/assignments", async (req, res) => {
    try {
      const { cid } = req.params;
      const assignments = await assignmentsDao.findAssignmentsForCourse(cid);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching course assignments:", error);
      res.status(500).json({
        status: "error",
        message: "Server error while fetching course assignments",
        error: error.message
      });
    }
  });

  // Get assignment by ID
  app.get("/api/assignments/:aid", async (req, res) => {
    try {
      const { aid } = req.params;
      const assignment = await assignmentsDao.findAssignmentById(aid);
      
      if (assignment) {
        res.json(assignment);
      } else {
        res.status(404).json({ 
          status: "error",
          message: "Assignment not found" 
        });
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
      res.status(500).json({
        status: "error",
        message: "Server error while fetching assignment",
        error: error.message
      });
    }
  });

  // Update assignment
  app.put("/api/assignments/:aid", async (req, res) => {
    try {
      const { aid } = req.params;
      const assignmentUpdates = req.body;
      const updatedAssignment = await assignmentsDao.updateAssignment(
        aid,
        assignmentUpdates
      );
      
      if (updatedAssignment) {
        res.json(updatedAssignment);
      } else {
        res.status(404).json({ 
          status: "error",
          message: "Assignment not found" 
        });
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      res.status(500).json({
        status: "error",
        message: "Server error while updating assignment",
        error: error.message
      });
    }
  });

  // Delete assignment
  app.delete("/api/assignments/:aid", async (req, res) => {
    try {
      const { aid } = req.params;
      const status = await assignmentsDao.deleteAssignment(aid);
      res.json(status);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      res.status(500).json({
        status: "error",
        message: "Server error while deleting assignment",
        error: error.message
      });
    }
  });
}