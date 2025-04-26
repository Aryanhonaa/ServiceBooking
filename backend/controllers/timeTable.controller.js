const TimeTable = require("../models/timeTableModel");

exports.setAvailability = async (req, res) => {
    try {
      const { providerId, schedule } = req.body;
  
      console.log("Request Data:", JSON.stringify(req.body, null, 2));
  
      if (!providerId || typeof schedule !== "object" || Object.keys(schedule).length === 0) {
        return res.status(400).json({ message: "Invalid Input", success: false });
      }
  
      let timetable = await TimeTable.findOne({ providerId });
  
      if (!timetable) {
        timetable = new TimeTable({ providerId, schedule });
      } else {
        timetable.schedule = schedule;
      }
  
      await timetable.save();
  
      res.status(200).json({
        message: "Time table updated successfully",
        success: true,
        timetable,
      });
    } catch (err) {
      console.error("Error in setAvailability:", err);
      res.status(500).json({ error: err.message });
    }
  };


exports.getAvailability= async(req,res)=>{
    try{
        const {providerId}=req.query;
        const timeTable= await TimeTable.findOne({providerId});

        if(!timeTable){
            return res.status(200).json({ schedule:{}})
        }

        res.status(200).json({schedule: timeTable.schedule})
        
    }catch(err){
        console.log(err);
        res.status(400).json({
            error: err.message,
            message:"Error in getAvailability",
            success:false
        })
    }
}
