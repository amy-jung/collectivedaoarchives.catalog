import recordRoutes from "./records";
import searchRoutes from "./search";
import contributeRoutes from "./contribute";
import { Router } from "express";

const router = Router();

// App routes
router.get("/", async (req, res) => {
  res.json({ hello: "world!" });
});

router.use("/records", recordRoutes);
router.use("/search", searchRoutes);
router.use("/contribute", contributeRoutes);

export default router;
