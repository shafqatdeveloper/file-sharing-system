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

// Route to add a member to a team
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Calls the `addMemberToTeam` controller function to handle the request
Router.put("/member/add-to-team/:teamId", isAuthenticatedUser, addMemberToTeam);

// Route to remove a member from a team
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Calls the `removeMemberFromTeam` controller function to handle the request
Router.put(
  "/member/remove-from-team/:memberId",
  isAuthenticatedUser,
  removeMemberFromTeam
);

// Route to get team details
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Calls the `getTeamDetails` controller function to handle the request
Router.get("/team/details/:userId", isAuthenticatedUser, getTeamDetails);

export default Router;
