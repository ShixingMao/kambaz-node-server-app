import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) {
  // POST - Enroll user in a course
  app.post("/api/users/:userId/enrollments/:courseId", async (req, res) => {
    try {
      const { userId, courseId } = req.params;
      const enrollment = await enrollmentsDao.enrollUserInCourse(userId, courseId);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error enrolling user in course:", error);
      res.status(500).json({
        status: "error",
        message: "Server error while enrolling user in course",
        error: error.message
      });
    }
  });

  // DELETE - Unenroll user from a course
  app.delete("/api/users/:userId/enrollments/:courseId", async (req, res) => {
    try {
      const { userId, courseId } = req.params;
      const status = await enrollmentsDao.unenrollUserFromCourse(userId, courseId);
      res.json(status);
    } catch (error) {
      console.error("Error unenrolling user from course:", error);
      res.status(500).json({
        status: "error",
        message: "Server error while unenrolling user from course",
        error: error.message
      });
    }
  });

  // GET - Get all enrollments for a user
  app.get("/api/users/:userId/enrollments", async (req, res) => {
    try {
      const { userId } = req.params;
      const enrollments = await enrollmentsDao.findEnrollmentsByUser(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching user enrollments:", error);
      res.status(500).json({
        status: "error",
        message: "Server error while fetching user enrollments",
        error: error.message
      });
    }
  });

  // GET - Get all enrollments for a course
  app.get("/api/courses/:courseId/enrollments", async (req, res) => {
    try {
      const { courseId } = req.params;
      const enrollments = await enrollmentsDao.findEnrollmentsByCourse(courseId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching course enrollments:", error);
      res.status(500).json({
        status: "error",
        message: "Server error while fetching course enrollments",
        error: error.message
      });
    }
  });

  // GET - Check if a user is enrolled in a specific course
  app.get("/api/users/:userId/enrollments/:courseId", async (req, res) => {
    try {
      const { userId, courseId } = req.params;
      const enrollment = await enrollmentsDao.findEnrollment(userId, courseId);
      if (enrollment) {
        res.json(enrollment);
      } else {
        res.status(404).json({
          status: "error",
          message: "Enrollment not found"
        });
      }
    } catch (error) {
      console.error("Error checking enrollment status:", error);
      res.status(500).json({
        status: "error",
        message: "Server error while checking enrollment status",
        error: error.message
      });
    }
  });
}