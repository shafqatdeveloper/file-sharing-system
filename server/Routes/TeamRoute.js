import express from "express";
import {
  authorizeVerifiedUser,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import {
  addMemberToTeam,
  getTeamDetails,
  removeMemberFromTeam,
} from "../Controllers/TeamController.js";

const Router = express.Router();

// Add Member to Team
Router.put("/member/add-to-team/:teamId", isAuthenticatedUser, addMemberToTeam);

// Remove Member from Team
Router.put(
  "/member/remove-from-team/:memberId",
  isAuthenticatedUser,
  removeMemberFromTeam
);

// Get Team Details
Router.get("/team/details/:userId", isAuthenticatedUser, getTeamDetails);

export default Router;
