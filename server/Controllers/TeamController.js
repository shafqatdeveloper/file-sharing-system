import Company from "../Schemas/CompanySchema.js";
import Folder from "../Schemas/FolderSchema.js";
import Team from "../Schemas/TeamSchema.js";
import User from "../Schemas/UserSchema.js";

// Function to add a member to a team
export const addMemberToTeam = async (req, res) => {
  try {
    const { teamMemberEmail } = req.body; // Get the team member's email from the request body
    const { teamId } = req.params; // Get the team ID from the request parameters

    // Check if the user with the provided email exists
    const userExist = await User.findOne({ email: teamMemberEmail });
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the team with the provided ID exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Check if the user is already a member of the team
    const isMember = team.teamMembers.includes(userExist._id);
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of the team",
      });
    }

    // Add the user to the accessors of all folders and companies managed by the team admin
    await Folder.updateMany(
      { folderAdmin: req.user },
      { $addToSet: { accessors: userExist._id } }
    );
    await Company.updateMany(
      { companyAdmin: req.user },
      { $addToSet: { accessors: userExist._id } }
    );

    // Add the user to the team members
    team.teamMembers.push(userExist._id);
    await team.save();

    // Add the team to the user's teams
    userExist.teams.push(team._id);
    await userExist.save();

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Member added to the team successfully",
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to remove a member from a team
export const removeMemberFromTeam = async (req, res) => {
  try {
    const { memberId } = req.params; // Get the member ID from the request parameters
    const { teamId } = req.body; // Get the team ID from the request body

    // Find the team with the provided ID
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Find the member with the provided ID
    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user is a member of the team
    const isMember = team.teamMembers.includes(memberId);
    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of the team",
      });
    }

    // Remove the user from the team members
    team.teamMembers.pull(memberId);
    await team.save();

    // Remove the team from the user's teams
    member.teams.pull(teamId);
    await member.save();

    // Remove the user from accessors of folders and companies managed by the team admin
    await Folder.updateMany(
      { folderAdmin: req.user },
      { $pull: { accessors: memberId } }
    );
    await Company.updateMany(
      { companyAdmin: req.user },
      { $pull: { accessors: memberId } }
    );

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Member removed from the team successfully",
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to get team details by a user ID
export const getTeamDetails = async (req, res) => {
  try {
    const { userId } = req.params; // Get the user ID from the request parameters

    // Find the team that the user is a member of and populate the team members
    const team = await Team.findOne({ teamMembers: userId }).populate(
      "teamMembers"
    );
    if (!team) {
      return res.status(401).json({
        success: false,
        message: "Team not Exist",
      });
    } else {
      // Respond with the team details
      res.status(200).json({ success: true, team });
    }
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
