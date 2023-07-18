import recordRoutes from "./records";
import { Router } from "express";

const router = Router();

// App routes
router.get("/", async (req, res) => {
  res.json({ hello: "world!" });
});

router.use("/records", recordRoutes);

export default router;
