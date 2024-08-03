import mongoose from "mongoose";
const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  teamLeader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teamMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Team = mongoose.model("Team", teamSchema);
export default Team;
