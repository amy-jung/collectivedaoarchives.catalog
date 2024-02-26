import categoryRoutes from "./category";
import contributeRoutes from "./contribute";
import homeRoutes from "./home";
import organizationRoutes from "./organization";
import recordRoutes from "./records";
import searchRoutes from "./search";
import { Router } from "express";

const router = Router();

// App routes
router.get("/", async (req, res) => {
  res.json({ hello: "world!" });
});

router.use("/home", homeRoutes);
router.use("/records", recordRoutes);
router.use("/search", searchRoutes);
router.use("/contribute", contributeRoutes);
router.use("/categories", categoryRoutes);
router.use("/organizations", organizationRoutes);

export default router;
