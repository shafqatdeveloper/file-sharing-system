import Company from "../Schemas/CompanySchema.js";
import Folder from "../Schemas/FolderSchema.js";
import Team from "../Schemas/TeamSchema.js";
import User from "../Schemas/UserSchema.js";

// Add Member to Team
export const addMemberToTeam = async (req, res) => {
  try {
    const { teamMemberEmail } = req.body;
    const { teamId } = req.params;
    // Check if the user exists
    const userExist = await User.findOne({ email: teamMemberEmail });
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user is already a member of the team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const isMember = team.teamMembers.includes(userExist._id);
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of the team",
      });
    }

    // Add the user to the team members
    await Folder.updateMany(
      { folderAdmin: req.user },
      { $addToSet: { accessors: userExist._id } }
    );
    await Company.updateMany(
      { companyAdmin: req.user },
      { $addToSet: { accessors: userExist._id } }
    );
    team.teamMembers.push(userExist._id);
    await team.save();
    userExist.teams.push(team._id);
    await userExist.save();
    res.status(200).json({
      success: true,
      message: "Member added to the team successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Remove Member from Team
export const removeMemberFromTeam = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { teamId } = req.body;

    // Find the team
    console.log("Team id", teamId);
    console.log("Member id", memberId);
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Find the member
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

    // Remove the user from accessors of folders and companies
    await Folder.updateMany(
      { folderAdmin: req.user },
      { $pull: { accessors: memberId } }
    );
    await Company.updateMany(
      { companyAdmin: req.user },
      { $pull: { accessors: memberId } }
    );

    res.status(200).json({
      success: true,
      message: "Member removed from the team successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Get Team Details
export const getTeamDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const team = await Team.findOne({ teamMembers: userId }).populate(
      "teamMembers"
    );
    if (!team) {
      res.status(401).json({
        success: false,
        message: `Team not Exist`,
      });
    } else {
      res.status(200).json({ success: true, team });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
