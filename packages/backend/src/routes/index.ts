import recordRoutes from "./records";
import searchRoutes from "./search";
import { Router } from "express";

const router = Router();

// App routes
router.get("/", async (req, res) => {
  res.json({ hello: "world!" });
});

router.use("/records", recordRoutes);
router.use("/search", searchRoutes);

export default router;
