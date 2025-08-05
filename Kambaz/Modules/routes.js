import * as modulesDao from "./dao.js";
export default function ModuleRoutes(app) {
    app.put("/api/modules/:moduleId", async (req, res) => {
        try {
            const { moduleId } = req.params;
            const moduleUpdates = req.body;
            // Now await works correctly
            const status = await modulesDao.updateModule(moduleId, moduleUpdates);
            res.send(status);
        } catch (error) {
            console.error("Error updating module:", error);
            res.status(500).json({ 
                status: "error", 
                message: "Server error while updating module",
                error: error.message 
            });
        }
    });

    app.delete("/api/modules/:moduleId", async (req, res) => {
        const { moduleId } = req.params;
        const status = await modulesDao.deleteModule(moduleId);
        res.send(status);
    });
}
